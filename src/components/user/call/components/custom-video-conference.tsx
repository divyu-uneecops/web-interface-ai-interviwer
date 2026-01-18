"use client";

import {
  useLocalParticipant,
  useParticipants,
  RoomAudioRenderer,
  ConnectionStateToast,
} from "@livekit/components-react";
import { Mic, MicOff, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomVideoConferenceProps {
  onEndCall?: () => void;
}

export function CustomVideoConference({
  onEndCall,
}: CustomVideoConferenceProps) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const participants = useParticipants();

  // Sync state with actual participant state
  const [isMicEnabled, setIsMicEnabled] = useState(isMicrophoneEnabled ?? true);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

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

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative bg-white">
        {/* Agent Speaking Animation - Left side */}
        {isAgentSpeaking && (
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative flex flex-col items-center gap-4">
              {/* Label */}
              <div className="text-xs font-medium text-[#02563d] mb-2">
                Agent Speaking
              </div>
              {/* Thinking dots animation */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 bg-[#02563d] rounded-full"
                  style={{
                    animation: "agent-bounce 1.4s ease-in-out infinite",
                    animationDelay: "0ms",
                  }}
                />
                <div
                  className="w-2.5 h-2.5 bg-[#02563d] rounded-full"
                  style={{
                    animation: "agent-bounce 1.4s ease-in-out infinite",
                    animationDelay: "200ms",
                  }}
                />
                <div
                  className="w-2.5 h-2.5 bg-[#02563d] rounded-full"
                  style={{
                    animation: "agent-bounce 1.4s ease-in-out infinite",
                    animationDelay: "400ms",
                  }}
                />
              </div>
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-20 h-20 border-2 border-[#02563d] rounded-full opacity-30"
                  style={{
                    animation: "agent-pulse-ring 2s ease-out infinite",
                  }}
                />
                <div
                  className="absolute w-16 h-16 border-2 border-[#02563d] rounded-full opacity-40"
                  style={{
                    animation: "agent-pulse-ring 2s ease-out infinite 0.5s",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* User Speaking Animation - Right side */}
        {isUserSpeaking && (
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative flex flex-col items-center gap-4">
              {/* Label */}
              <div className="text-xs font-medium text-[#2563eb] mb-2">
                You Speaking
              </div>
              {/* Thinking dots animation */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 bg-[#2563eb] rounded-full"
                  style={{
                    animation: "user-bounce 1.4s ease-in-out infinite",
                    animationDelay: "0ms",
                  }}
                />
                <div
                  className="w-2.5 h-2.5 bg-[#2563eb] rounded-full"
                  style={{
                    animation: "user-bounce 1.4s ease-in-out infinite",
                    animationDelay: "200ms",
                  }}
                />
                <div
                  className="w-2.5 h-2.5 bg-[#2563eb] rounded-full"
                  style={{
                    animation: "user-bounce 1.4s ease-in-out infinite",
                    animationDelay: "400ms",
                  }}
                />
              </div>
              {/* Pulsing ring animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-20 h-20 border-2 border-[#2563eb] rounded-full opacity-30"
                  style={{
                    animation: "user-pulse-ring 2s ease-out infinite",
                  }}
                />
                <div
                  className="absolute w-16 h-16 border-2 border-[#2563eb] rounded-full opacity-40"
                  style={{
                    animation: "user-pulse-ring 2s ease-out infinite 0.5s",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-100/80 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {/* Microphone with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-white/50 transition-colors flex items-center gap-1"
                  aria-label={
                    isMicEnabled ? "Mute microphone" : "Unmute microphone"
                  }
                >
                  {isMicEnabled ? (
                    <Mic className="w-5 h-5 text-black" />
                  ) : (
                    <MicOff className="w-5 h-5 text-black" />
                  )}
                  <ChevronDown className="w-4 h-4 text-black" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleToggleMic}>
                  {isMicEnabled ? "Mute" : "Unmute"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Controls - END CALL */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onEndCall}
              className="px-4 py-2 bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md font-medium transition-colors"
            >
              END CALL
            </Button>
          </div>
        </div>
      </div>

      {/* Essential LiveKit Components */}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
