"use client";

import {
  useLocalParticipant,
  useParticipants,
  RoomAudioRenderer,
  ConnectionStateToast,
  useDataChannel,
} from "@livekit/components-react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface CustomVideoConferenceProps {
  onEndCall?: () => void;
}

export function CustomVideoConference({
  onEndCall,
}: CustomVideoConferenceProps) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const participants = useParticipants();

  // Fix: useDataChannel returns { message, send } - need to properly handle message
  const { message, send } = useDataChannel("chat");

  // Sync state with actual participant state
  const [isMicEnabled, setIsMicEnabled] = useState(isMicrophoneEnabled ?? true);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [audioLevels, setAudioLevels] = useState([0, 0, 0, 0, 0]);
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; from: string; timestamp: number }>
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  useEffect(() => {
    setIsMicEnabled(isMicrophoneEnabled ?? true);
  }, [isMicrophoneEnabled]);

  // Find agent participant
  const agentParticipant = participants.find(
    (p) => p.identity !== localParticipant?.identity
  );

  // Fix: Properly handle incoming data channel messages
  useEffect(() => {
    if (!message) return;

    try {
      // Backend sends as bytes (text.encode()), so decode it
      let text: string;
      if (message.payload instanceof ArrayBuffer) {
        const decoder = new TextDecoder();
        text = decoder.decode(message.payload);
      } else if (typeof message.payload === "string") {
        text = message.payload;
      } else if (message.payload instanceof Uint8Array) {
        const decoder = new TextDecoder();
        text = decoder.decode(message.payload);
      } else {
        // Fallback: try to convert
        text = String(message.payload);
      }

      if (!text || !text.trim()) return;

      // Try to parse as JSON (new format with role info)
      let messageText: string;
      let messageRole: string | null = null;

      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && parsed.text) {
          messageText = parsed.text;
          messageRole = parsed.role || null;
        } else {
          messageText = text.trim();
        }
      } catch {
        // Not JSON, use as plain text (backward compatibility)
        messageText = text.trim();
      }

      // Determine sender identity
      // If message has role info, use it; otherwise check participant identity
      let senderIdentity: string;
      if (messageRole === "candidate") {
        senderIdentity = localParticipant?.identity || "candidate";
      } else if (messageRole === "interviewer") {
        senderIdentity = agentParticipant?.identity || "agent";
      } else {
        // Fallback: check if from local participant (candidate) or remote (agent)
        senderIdentity =
          message.from?.identity ||
          (message.from?.identity === localParticipant?.identity
            ? localParticipant?.identity
            : "agent");
      }

      setChatMessages((prev) => [
        ...prev,
        {
          text: messageText,
          from: senderIdentity,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error processing data channel message:", error);
    }
  }, [message, localParticipant, agentParticipant]);

  // Track if user is at bottom of chat
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const checkIfAtBottom = () => {
      const threshold = 100; // pixels from bottom
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      setIsUserAtBottom(isAtBottom);
    };

    // Check on scroll
    container.addEventListener("scroll", checkIfAtBottom);

    // Initial check
    checkIfAtBottom();

    return () => {
      container.removeEventListener("scroll", checkIfAtBottom);
    };
  }, [chatMessages]);

  // Auto-scroll to bottom when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (chatMessages.length > 0 && chatContainerRef.current && isUserAtBottom) {
      const container = chatContainerRef.current;

      const scrollToBottom = () => {
        // Direct scroll to bottom
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      };

      // Use multiple attempts to ensure scrolling works
      // First attempt: immediate
      requestAnimationFrame(() => {
        scrollToBottom();
      });

      // Second attempt: after a short delay to ensure DOM is updated
      const timeoutId1 = setTimeout(() => {
        scrollToBottom();
      }, 50);

      // Third attempt: after render completes
      const timeoutId2 = setTimeout(() => {
        scrollToBottom();
      }, 150);

      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }
  }, [chatMessages, isUserAtBottom]);

  // Check if agent is speaking
  useEffect(() => {
    if (!agentParticipant) {
      setIsAgentSpeaking(false);
      return;
    }

    setIsAgentSpeaking(agentParticipant.isSpeaking);

    const interval = setInterval(() => {
      if (agentParticipant) {
        setIsAgentSpeaking(agentParticipant.isSpeaking);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [agentParticipant]);

  // Check if user (local participant) is speaking
  useEffect(() => {
    if (!localParticipant) {
      setIsUserSpeaking(false);
      return;
    }

    setIsUserSpeaking(localParticipant.isSpeaking);

    const interval = setInterval(() => {
      if (localParticipant) {
        setIsUserSpeaking(localParticipant.isSpeaking);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [localParticipant]);

  // Generate dynamic audio levels for visualization
  useEffect(() => {
    const isActive = isUserSpeaking || isAgentSpeaking;

    if (!isActive) {
      setAudioLevels([0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      const centerLevel = 0.7 + Math.random() * 0.3;
      const levels = [
        Math.random() * 0.3,
        Math.random() * 0.5 + 0.2,
        centerLevel,
        Math.random() * 0.5 + 0.2,
        Math.random() * 0.3,
      ];
      setAudioLevels(levels);
    }, 100);

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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-glow-blue {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
            }
            50% {
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
            }
          }
          @keyframes pulse-glow-green {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(2, 86, 61, 0.4);
            }
            50% {
              box-shadow: 0 0 0 4px rgba(2, 86, 61, 0);
            }
          }
        `
      }} />
      <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#fafafa] via-white to-[#fafafa] overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 py-4 md:px-6 md:py-6 relative">
          {/* Audio Visualization Section */}
          <div className="flex-1 flex items-center justify-center">
            {isActive && (
              <div className="relative flex items-end justify-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50">
                {audioLevels.map((level, index) => {
                  const isCenter = index === 2;
                  const color = isUserSpeaking ? "#2563eb" : "#02563d";
                  const maxHeight = isCenter
                    ? 64
                    : index === 1 || index === 3
                      ? 40
                      : 24;
                  const dynamicHeight = maxHeight * Math.max(level, 0.15);
                  const opacity = isCenter
                    ? 1
                    : index === 1 || index === 3
                      ? 0.7
                      : 0.4;
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
          <div className="w-full md:w-80 lg:w-96 flex flex-col bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden h-full max-h-full">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  Interview Chat
                </span>
                <span className="text-xs text-gray-500">
                  {chatMessages?.length > 0
                    ? `${chatMessages?.length} message${chatMessages?.length > 1 ? "s" : ""
                    }`
                    : "Waiting for messages..."}
                </span>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 min-h-0 px-3 py-3 space-y-2 overflow-y-auto overflow-x-hidden scroll-smooth"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
                WebkitOverflowScrolling: "touch",
                maxHeight: "100%",
              }}
            >
              {chatMessages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center mt-6">
                  No messages yet. The interviewer's messages will appear here.
                </p>
              ) : (
                <>
                  {chatMessages.map((msg, index) => {
                    const isLocal = msg.from === localParticipant?.identity;
                    const senderName = isLocal ? "You" : "Interviewer";

                    // Determine if this message sender is currently speaking
                    const isCurrentlySpeaking = isLocal
                      ? isUserSpeaking
                      : isAgentSpeaking;

                    // Find the most recent message from this sender
                    let mostRecentMessageFromSender = false;
                    for (let i = chatMessages.length - 1; i >= 0; i--) {
                      if (chatMessages[i].from === msg.from) {
                        mostRecentMessageFromSender = i === index;
                        break;
                      }
                    }

                    // Animate when the sender is speaking and this is their most recent message
                    const shouldAnimate = isCurrentlySpeaking && mostRecentMessageFromSender;

                    return (
                      <div
                        key={`${msg.timestamp}-${index}`}
                        className={`flex ${isLocal ? "justify-end" : "justify-start"
                          } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        style={{
                          animationDelay: `${Math.min(index * 30, 200)}ms`,
                        }}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm transition-all duration-500 ease-in-out ${isLocal
                            ? "bg-[#02563d] text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm"
                            } ${shouldAnimate
                              ? isLocal
                                ? "ring-2 ring-[#02563d] ring-opacity-70 shadow-lg shadow-[#02563d]/30 scale-[1.02]"
                                : "ring-2 ring-blue-400 ring-opacity-70 shadow-lg shadow-blue-400/30 scale-[1.02]"
                              : ""
                            }`}
                          style={{
                            animation: shouldAnimate
                              ? isLocal
                                ? "pulse-glow-green 1.5s ease-in-out infinite"
                                : "pulse-glow-blue 1.5s ease-in-out infinite"
                              : undefined,
                          }}
                        >
                          <div
                            className={`mb-0.5 font-medium flex items-center gap-1.5 ${isLocal ? "text-white/80" : "text-gray-600"
                              }`}
                          >
                            <span>{senderName}</span>
                            {shouldAnimate && (
                              <span
                                className={`inline-flex items-center gap-1 ${isLocal ? "text-white/70" : "text-gray-500"
                                  }`}
                              >
                                <span className="relative flex h-2 w-2">
                                  <span
                                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isLocal ? "bg-white/60" : "bg-blue-400"
                                      }`}
                                  />
                                  <span
                                    className={`relative inline-flex h-2 w-2 rounded-full ${isLocal ? "bg-white/80" : "bg-blue-500"
                                      }`}
                                  />
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="whitespace-pre-wrap break-words">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    ref={messagesEndRef}
                    className="h-1 w-full"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Control Bar - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/85 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" />

          <div className="relative flex items-center justify-between px-8 py-5">
            <Button
              onClick={handleToggleMic}
              className="group relative flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={isMicEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              <div
                className={`relative ${isMicEnabled ? "text-gray-700" : "text-red-500"
                  }`}
              >
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
    </>
  );
}
