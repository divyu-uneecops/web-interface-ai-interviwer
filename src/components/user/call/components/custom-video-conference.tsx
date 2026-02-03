"use client";

import {
  useLocalParticipant,
  useParticipants,
  RoomAudioRenderer,
  ConnectionStateToast,
  useChat,
} from "@livekit/components-react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomVideoConferenceProps {
  onEndCall?: () => void;
}

export function CustomVideoConference({
  onEndCall,
}: CustomVideoConferenceProps) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const participants = useParticipants();
  const { chatMessages, send, isSending } = useChat();

  // Sync state with actual participant state
  const [isMicEnabled, setIsMicEnabled] = useState(isMicrophoneEnabled ?? true);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [audioLevels, setAudioLevels] = useState([0, 0, 0, 0, 0]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    setIsMicEnabled(isMicrophoneEnabled ?? true);
  }, [isMicrophoneEnabled]);

  // Find agent participant (any remote participant that's not the local one)
  const agentParticipant = participants.find(
    (p) => p.identity !== localParticipant?.identity
  );

  // Check if agent is speaking
  useEffect(() => {
    if (!agentParticipant) {
      setIsAgentSpeaking(false);
      return;
    }

    // Set initial state
    setIsAgentSpeaking(agentParticipant.isSpeaking);

    // Use a polling approach to check speaking state
    // This is more reliable than event listeners which may not always fire
    const interval = setInterval(() => {
      if (agentParticipant) {
        setIsAgentSpeaking(agentParticipant.isSpeaking);
      }
    }, 100); // Check every 100ms for smooth animation

    return () => {
      clearInterval(interval);
    };
  }, [agentParticipant]);

  // Check if user (local participant) is speaking
  useEffect(() => {
    if (!localParticipant) {
      setIsUserSpeaking(false);
      return;
    }

    // Set initial state
    setIsUserSpeaking(localParticipant.isSpeaking);

    // Use a polling approach to check speaking state
    const interval = setInterval(() => {
      if (localParticipant) {
        setIsUserSpeaking(localParticipant.isSpeaking);
      }
    }, 100); // Check every 100ms for smooth animation

    return () => {
      clearInterval(interval);
    };
  }, [localParticipant]);

  // Generate dynamic audio levels for visualization
  useEffect(() => {
    const isActive = isUserSpeaking || isAgentSpeaking;

    if (!isActive) {
      setAudioLevels([0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      // Generate random levels with center bar being highest (like in the image)
      // Center bar should be solid/highest, outer bars progressively shorter
      const centerLevel = 0.7 + Math.random() * 0.3; // 0.7 to 1.0 (center is always high)
      const levels = [
        Math.random() * 0.3, // Leftmost: 0-0.3 (lightest)
        Math.random() * 0.5 + 0.2, // Left: 0.2-0.7 (medium)
        centerLevel, // Center: 0.7-1.0 (highest/solid)
        Math.random() * 0.5 + 0.2, // Right: 0.2-0.7 (medium)
        Math.random() * 0.3, // Rightmost: 0-0.3 (lightest)
      ];
      setAudioLevels(levels);
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isUserSpeaking, isAgentSpeaking]);

  const handleToggleMic = async () => {
    if (localParticipant) {
      try {
        if (isMicEnabled) {
          await localParticipant.setMicrophoneEnabled(false);
        } else {
          await localParticipant.setMicrophoneEnabled(true);
        }
      } catch (error) {
        console.error("Error toggling microphone:", error);
      }
    }
  };

  const isActive = isUserSpeaking || isAgentSpeaking;

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed) return;
    try {
      await send(trimmed);
      setMessageText("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#fafafa] via-white to-[#fafafa] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 py-4 md:px-6 md:py-6 relative">
        {/* Audio Visualization Section */}
        <div className="flex-1 flex items-center justify-center">
          {/* Audio Visualization Bars Container - Only show when speaking */}
          {isActive && (
            <div className="relative flex items-end justify-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50">
              {audioLevels.map((level, index) => {
                const isCenter = index === 2;
                // Different colors: Blue for user, Green for agent
                const color = isUserSpeaking ? "#2563eb" : "#02563d";

                // Height calculation: Center bar tallest, outer bars progressively shorter
                const maxHeight =
                  isCenter ? 64 : index === 1 || index === 3 ? 40 : 24;
                const dynamicHeight = maxHeight * Math.max(level, 0.15);

                // Opacity gradient: center solid, outer bars lighter
                const opacity =
                  isCenter ? 1 : index === 1 || index === 3 ? 0.7 : 0.4;

                // Width: center bar slightly wider
                const width = isCenter ? "16px" : "12px";

                return (
                  <div
                    key={index}
                    className="rounded-full transition-all duration-100 ease-out will-change-transform"
                    style={{
                      width,
                      height: `${Math.max(dynamicHeight, 6)}px`,
                      backgroundColor: color,
                      opacity: opacity,
                      boxShadow: isCenter
                        ? `0 0 12px ${color}40`
                        : `0 0 6px ${color}20`,
                      transform: "scaleY(1)",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                Interview Chat
              </span>
              <span className="text-xs text-gray-500">
                Chat with the AI interviewer
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 px-3 py-3 space-y-2 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-6">
                No messages yet. Your conversation will appear here.
              </p>
            ) : (
              chatMessages.map((msg, index) => {
                const isLocal = msg.from?.isLocal;
                const senderName =
                  isLocal || msg.from?.identity === localParticipant?.identity
                    ? "You"
                    : msg.from?.name || "Interviewer";

                return (
                  <div
                    key={(msg as any).id ?? index}
                    className={`flex ${
                      isLocal ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                        isLocal
                          ? "bg-[#02563d] text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <div
                        className={`mb-0.5 font-medium ${
                          isLocal ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {senderName}
                      </div>
                      <div className="whitespace-pre-wrap break-words">
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-100 px-3 py-2.5 bg-white/90"
          >
            <div className="flex items-center gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="h-9 text-sm"
                disabled={isSending}
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 px-3 text-xs font-medium bg-[#02563d] text-white hover:bg-[#02563d]/90"
                disabled={isSending || !messageText.trim()}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Control Bar - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/85 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" />

        <div className="relative flex items-center justify-between px-8 py-5">
          {/* Mute Button */}
          <Button
            onClick={handleToggleMic}
            className="group relative flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={
              isMicEnabled ? "Mute microphone" : "Unmute microphone"
            }
          >
            <div className={`relative ${isMicEnabled ? 'text-gray-700' : 'text-red-500'}`}>
              {isMicEnabled ? (
                <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
              ) : (
                <MicOff className="w-5 h-5 transition-transform group-hover:scale-110" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {isMicEnabled ? "Mute" : "Unmute"}
            </span>
          </Button>

          {/* End Call Button */}
          <Button
            onClick={onEndCall}
            className="group relative flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border-0"
          >
            <PhoneOff className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span>End Call</span>
          </Button>
        </div>
      </div>


      {/* Essential LiveKit Components */}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
