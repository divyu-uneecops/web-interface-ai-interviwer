"use client";

import {
  useLocalParticipant,
  useParticipants,
  RoomAudioRenderer,
  ConnectionStateToast,
} from "@livekit/components-react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
  const [audioLevels, setAudioLevels] = useState([0, 0, 0, 0, 0]);

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

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#fafafa] via-white to-[#fafafa] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Audio Visualization Bars Container - Only show when speaking */}
        {isActive && (
          <div className="relative flex items-end justify-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50">
            {audioLevels.map((level, index) => {
              const isCenter = index === 2;
              // Different colors: Blue for user, Green for agent
              const color = isUserSpeaking ? "#2563eb" : "#02563d";

              // Height calculation: Center bar tallest, outer bars progressively shorter
              const maxHeight = isCenter ? 64 : index === 1 || index === 3 ? 40 : 24;
              const dynamicHeight = maxHeight * Math.max(level, 0.15);

              // Opacity gradient: center solid, outer bars lighter
              const opacity = isCenter ? 1 : index === 1 || index === 3 ? 0.7 : 0.4;

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
                    transform: 'scaleY(1)',
                  }}
                />
              );
            })}
          </div>
        )}
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
