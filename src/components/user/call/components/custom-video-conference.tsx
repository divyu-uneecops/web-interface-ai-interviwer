"use client";

import {
  useLocalParticipant,
  useParticipants,
  RoomAudioRenderer,
  ConnectionStateToast,
  useDataChannel,
} from "@livekit/components-react";
import { Mic, MicOff, PhoneOff, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface CustomVideoConferenceProps {
  onEndCall?: () => void;
}

const BRAND = {
  primary: "#02563d",
  primaryLight: "rgba(2, 86, 61, 0.08)",
  primaryMuted: "rgba(2, 86, 61, 0.12)",
  destructive: "#dc2626",
  destructiveHover: "#b91c1c",
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },
};

export function CustomVideoConference({
  onEndCall,
}: CustomVideoConferenceProps) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const participants = useParticipants();

  const { message } = useDataChannel("chat");

  const [isMicEnabled, setIsMicEnabled] = useState(isMicrophoneEnabled ?? true);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [showUserSpeaking, setShowUserSpeaking] = useState(false);
  const [showAgentSpeaking, setShowAgentSpeaking] = useState(false);
  const speakCooldownRef = useRef<{
    user: ReturnType<typeof setTimeout> | null;
    agent: ReturnType<typeof setTimeout> | null;
  }>({ user: null, agent: null });
  const SPEAK_COOLDOWN_MS = 1400;
  const [audioLevels, setAudioLevels] = useState([0, 0, 0, 0, 0]);
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; from: string; timestamp: number }>
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  useEffect(() => {
    setIsMicEnabled(isMicrophoneEnabled ?? true);
  }, [isMicrophoneEnabled]);

  const agentParticipant = participants?.find(
    (p) => p.identity !== localParticipant?.identity
  );

  useEffect(() => {
    if (!message) return;

    try {
      let text: string;
      if (message.payload instanceof ArrayBuffer) {
        text = new TextDecoder().decode(message.payload);
      } else if (typeof message.payload === "string") {
        text = message.payload;
      } else if (message.payload instanceof Uint8Array) {
        text = new TextDecoder().decode(message.payload);
      } else {
        text = String(message.payload);
      }

      if (!text?.trim()) return;

      let messageText: string;
      let messageRole: string | null = null;

      try {
        const parsed = JSON.parse(text);
        if (parsed?.text) {
          messageText = parsed.text;
          messageRole = parsed.role ?? null;
        } else {
          messageText = text.trim();
        }
      } catch {
        messageText = text.trim();
      }

      let senderIdentity: string;
      if (messageRole === "candidate") {
        senderIdentity = localParticipant?.identity || "candidate";
      } else if (messageRole === "interviewer") {
        senderIdentity = agentParticipant?.identity || "agent";
      } else {
        senderIdentity =
          (message as { from?: { identity?: string } }).from?.identity ||
          (localParticipant?.identity ?? "agent");
      }

      setChatMessages((prev) => [
        ...prev,
        { text: messageText, from: senderIdentity, timestamp: Date.now() },
      ]);
    } catch (error) {
      console.error("Error processing data channel message:", error);
    }
  }, [message, localParticipant, agentParticipant]);

  useEffect(() => {
    const container = chatContainerRef?.current;
    if (!container) return;

    const checkIfAtBottom = () => {
      const threshold = 80;
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold;
      setIsUserAtBottom(isAtBottom);
    };

    container.addEventListener("scroll", checkIfAtBottom);
    checkIfAtBottom();
    return () => container.removeEventListener("scroll", checkIfAtBottom);
  }, [chatMessages]);

  useEffect(() => {
    if (
      chatContainerRef?.current &&
      (chatMessages?.length > 0 || showUserSpeaking || showAgentSpeaking) &&
      isUserAtBottom
    ) {
      const container = chatContainerRef.current;
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
      };
      requestAnimationFrame(scrollToBottom);
      const t1 = setTimeout(scrollToBottom, 50);
      const t2 = setTimeout(scrollToBottom, 150);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [chatMessages, isUserAtBottom, showUserSpeaking, showAgentSpeaking]);

  useEffect(() => {
    if (!agentParticipant) {
      setIsAgentSpeaking(false);
      return;
    }
    setIsAgentSpeaking(agentParticipant.isSpeaking);
    const interval = setInterval(() => {
      setIsAgentSpeaking(agentParticipant.isSpeaking);
    }, 100);
    return () => clearInterval(interval);
  }, [agentParticipant]);

  useEffect(() => {
    if (!localParticipant) {
      setIsUserSpeaking(false);
      return;
    }
    setIsUserSpeaking(localParticipant.isSpeaking);
    const interval = setInterval(() => {
      setIsUserSpeaking(localParticipant.isSpeaking);
    }, 100);
    return () => clearInterval(interval);
  }, [localParticipant]);

  // Cooldown: keep speaking row visible briefly after pause to avoid flicker
  useEffect(() => {
    if (isUserSpeaking) {
      if (speakCooldownRef.current.user) {
        clearTimeout(speakCooldownRef.current.user);
        speakCooldownRef.current.user = null;
      }
      setShowUserSpeaking(true);
    } else {
      speakCooldownRef.current.user = setTimeout(() => {
        setShowUserSpeaking(false);
        speakCooldownRef.current.user = null;
      }, SPEAK_COOLDOWN_MS);
    }
    return () => {
      if (speakCooldownRef.current.user)
        clearTimeout(speakCooldownRef.current.user);
    };
  }, [isUserSpeaking]);

  useEffect(() => {
    if (isAgentSpeaking) {
      if (speakCooldownRef.current.agent) {
        clearTimeout(speakCooldownRef.current.agent);
        speakCooldownRef.current.agent = null;
      }
      setShowAgentSpeaking(true);
    } else {
      speakCooldownRef.current.agent = setTimeout(() => {
        setShowAgentSpeaking(false);
        speakCooldownRef.current.agent = null;
      }, SPEAK_COOLDOWN_MS);
    }
    return () => {
      if (speakCooldownRef.current.agent)
        clearTimeout(speakCooldownRef.current.agent);
    };
  }, [isAgentSpeaking]);

  useEffect(() => {
    const isActive = isUserSpeaking || isAgentSpeaking;
    if (!isActive) {
      setAudioLevels([0, 0, 0, 0, 0]);
      return;
    }
    const interval = setInterval(() => {
      const center = 0.7 + Math.random() * 0.3;
      setAudioLevels([
        Math.random() * 0.3,
        Math.random() * 0.5 + 0.2,
        center,
        Math.random() * 0.5 + 0.2,
        Math.random() * 0.3,
      ]);
    }, 100);
    return () => clearInterval(interval);
  }, [isUserSpeaking, isAgentSpeaking]);

  const handleToggleMic = async () => {
    if (!localParticipant) return;
    try {
      await localParticipant.setMicrophoneEnabled(!isMicEnabled);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (prefers-reduced-motion: reduce) {
              .interview-reduce-motion * { animation: none !important; }
            }
            .interview-focus-ring:focus-visible {
              outline: 2px solid ${BRAND.primary};
              outline-offset: 2px;
            }
          `,
        }}
      />
      <div className="interview-reduce-motion flex flex-col h-full w-full bg-[#fafafa] overflow-hidden">
        {/* Status strip — interview context */}
        <div
          className="shrink-0 flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-[#e5e5e5] bg-white/80"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-sm text-[#52525b]">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden
            />
            <span>Interview in progress</span>
          </div>
        </div>

        {/* Main content: chat */}
        <div className="flex-1 min-h-0 flex flex-col px-4 md:px-6 py-4 md:py-5">
          {/* Chat — primary content */}
          <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-[#e5e5e5] bg-white shadow-sm overflow-hidden">
            <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-[#f4f4f5] bg-[#fafafa]">
              <MessageSquare className="w-4 h-4 text-[#71717a]" />
              <span className="text-sm font-medium text-[#18181b]">
                Interview chat
              </span>
              {chatMessages.length > 0 && (
                <span className="text-xs text-[#71717a]">
                  {chatMessages.length} message
                  {chatMessages.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 min-h-[200px] overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d4d4d8 transparent",
              }}
              tabIndex={0}
              aria-label="Interview messages"
            >
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-[#f4f4f5] p-3 mb-3">
                    <MessageSquare className="w-6 h-6 text-[#a1a1aa]" />
                  </div>
                  <p className="text-sm text-[#71717a] max-w-[240px]">
                    Questions and answers will appear here as the interview
                    continues.
                  </p>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, index) => {
                    const isLocal = msg.from === localParticipant?.identity;
                    const senderName = isLocal ? "You" : "Interviewer";

                    return (
                      <div
                        key={`${msg.timestamp}-${index}`}
                        className={`flex ${
                          isLocal ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isLocal
                              ? "rounded-br-md bg-[#02563d] text-white"
                              : "rounded-bl-md bg-[#f4f4f5] text-[#18181b] border border-[#e5e5e5]"
                          } `}
                        >
                          <div
                            className={`text-xs font-medium mb-1 ${
                              isLocal ? "text-white/80" : "text-[#71717a]"
                            }`}
                          >
                            {senderName}
                          </div>
                          <div className="whitespace-pre-wrap wrap-break-word">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Live speaking row: only the current speaker (You or Interviewer), with cooldown to avoid flicker */}
                  {showUserSpeaking && (
                    <div className="flex justify-end pt-1">
                      <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-br-md px-4 py-2.5 bg-[#02563d] text-white">
                        <div className="text-xs font-medium mb-1.5 text-white/80">
                          You
                        </div>
                        <div
                          className="flex items-end justify-center gap-1 h-8"
                          aria-hidden
                        >
                          {isUserSpeaking
                            ? audioLevels.map((level, i) => {
                                const isCenter = i === 2;
                                const maxH = isCenter
                                  ? 20
                                  : i === 1 || i === 3
                                  ? 14
                                  : 10;
                                const h = Math.max(
                                  maxH * Math.max(level, 0.15),
                                  4
                                );
                                return (
                                  <div
                                    key={i}
                                    className="rounded-full transition-all duration-75 ease-out"
                                    style={{
                                      width: isCenter ? 6 : 5,
                                      height: h,
                                      backgroundColor: "rgba(255,255,255,0.9)",
                                      opacity: isCenter ? 1 : 0.8,
                                    }}
                                  />
                                );
                              })
                            : [0.3, 0.5, 0.4, 0.5, 0.3].map((q, i) => (
                                <div
                                  key={i}
                                  className="rounded-full animate-pulse transition-opacity duration-300"
                                  style={{
                                    width: 5,
                                    height: 8 + q * 8,
                                    backgroundColor: "rgba(255,255,255,0.5)",
                                  }}
                                />
                              ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {showAgentSpeaking && (
                    <div className="flex justify-start pt-1">
                      <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-bl-md px-4 py-2.5 bg-[#f4f4f5] text-[#18181b] border border-[#e5e5e5]">
                        <div className="text-xs font-medium mb-1.5 text-[#71717a]">
                          Interviewer
                        </div>
                        <div
                          className="flex items-end justify-center gap-1 h-8"
                          aria-hidden
                        >
                          {isAgentSpeaking
                            ? audioLevels.map((level, i) => {
                                const isCenter = i === 2;
                                const maxH = isCenter
                                  ? 20
                                  : i === 1 || i === 3
                                  ? 14
                                  : 10;
                                const h = Math.max(
                                  maxH * Math.max(level, 0.15),
                                  4
                                );
                                return (
                                  <div
                                    key={i}
                                    className="rounded-full transition-all duration-75 ease-out"
                                    style={{
                                      width: isCenter ? 6 : 5,
                                      height: h,
                                      backgroundColor: BRAND.primary,
                                      opacity: isCenter ? 1 : 0.8,
                                    }}
                                  />
                                );
                              })
                            : [0.3, 0.5, 0.4, 0.5, 0.3].map((q, i) => (
                                <div
                                  key={i}
                                  className="rounded-full animate-pulse transition-opacity duration-300"
                                  style={{
                                    width: 5,
                                    height: 8 + q * 8,
                                    backgroundColor: "rgba(2, 86, 61, 0.3)",
                                  }}
                                />
                              ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Control bar — durable, clear actions */}
        <div
          className="shrink-0 flex items-center justify-center gap-4 px-4 py-4 bg-white border-t border-[#e5e5e5] shadow-[0_-1px_3px_rgba(0,0,0,0.04)]"
          role="toolbar"
          aria-label="Call controls"
        >
          <Button
            onClick={handleToggleMic}
            variant="outline"
            className="interview-focus-ring h-12 min-w-[120px] rounded-xl border-[#e5e5e5] bg-white hover:bg-[#fafafa] hover:border-[#d4d4d8] transition-colors"
            aria-label={isMicEnabled ? "Mute microphone" : "Unmute microphone"}
            aria-pressed={!isMicEnabled}
          >
            {isMicEnabled ? (
              <Mic className="w-5 h-5 text-[#02563d] mr-2" />
            ) : (
              <MicOff className="w-5 h-5 text-[#dc2626] mr-2" />
            )}
            <span className="text-sm font-medium text-[#18181b]">
              {isMicEnabled ? "Mute" : "Unmute"}
            </span>
          </Button>

          <Button
            onClick={onEndCall}
            className="interview-focus-ring h-12 min-w-[140px] rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium border-0 shadow-sm"
            aria-label="End call"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            End call
          </Button>
        </div>

        <RoomAudioRenderer />
        <ConnectionStateToast />
      </div>
    </>
  );
}
