"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight,
  Check,
  Clock,
  AlertTriangle,
  Maximize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { InterviewFlowState } from "../types/flow.types";
import { useFaceValidation } from "../hooks/useFaceValidation";

import { LiveKitRoom } from "@livekit/components-react";
import { CustomVideoConference } from "./custom-video-conference";

import "@livekit/components-styles";

const REMINDER_THRESHOLD_SECONDS = 5 * 60; // 5 minutes
const DEFAULT_DURATION_MINUTES = 30;

/** Parse round duration string (e.g. "30 mins", "45 minutes", "1 hour") to total seconds. */
function parseDurationToSeconds(duration: string | undefined): number {
  if (!duration || typeof duration !== "string") {
    return DEFAULT_DURATION_MINUTES * 60;
  }
  const normalized = duration.trim().toLowerCase();
  const numMatch = normalized.match(/^(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : NaN;
  if (Number.isNaN(num) || num <= 0) return DEFAULT_DURATION_MINUTES * 60;
  if (/\b(hr|hour|h)\b/.test(normalized)) return num * 3600;
  return num * 60; // mins / minutes / min
}

function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

interface InterviewActiveFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  onStopCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  interviewDetails: any;
  token?: string | null;
  serverUrl?: string | null;
}

export function InterviewActiveFlow({
  onStateChange,
  onStopCamera,
  videoRef,
  interviewDetails,
  token,
  serverUrl,
}: InterviewActiveFlowProps) {
  const [showTipsModal, setShowTipsModal] = useState(true);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [showFiveMinReminder, setShowFiveMinReminder] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<
    number | null
  >(null);
  const hasLiveKitConfig = Boolean(token && serverUrl);
  const totalDurationSecondsRef = useRef(0);
  const fiveMinReminderShownRef = useRef(false);

  const faceValidationActive =
    !showTipsModal && timeRemainingSeconds !== null && timeRemainingSeconds > 0;
  const { warning: faceWarning, warningMessage: faceWarningMessage } =
    useFaceValidation({ videoRef, active: faceValidationActive });

  const endInterview = useCallback(() => {
    if (document?.fullscreenElement) {
      document
        ?.exitFullscreen()
        ?.catch((err) => console.error("Exit fullscreen error:", err));
    }
    onStateChange("interview-complete");
    onStopCamera();
  }, []);

  const handleEnterFullscreen = () => {
    setShowFullscreenWarning(false);
    document.documentElement.requestFullscreen().catch(() => {});
  };

  // Show one penalty warning every time user leaves fullscreen (interview is never ended)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement !== null) return;
      setShowFullscreenWarning(true);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Initialize total duration from round (used when tips modal closes)
  useEffect(() => {
    const total = parseDurationToSeconds(interviewDetails?.round?.duration);
    totalDurationSecondsRef.current = total;
  }, [interviewDetails?.round?.duration]);

  // Countdown timer: runs only after user starts interview (!showTipsModal)
  useEffect(() => {
    if (showTipsModal || timeRemainingSeconds === null) return;

    if (timeRemainingSeconds <= 0) {
      endInterview();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev === null || prev <= 0) return 0;
        const next = prev - 1;
        if (
          next <= REMINDER_THRESHOLD_SECONDS &&
          next > 0 &&
          totalDurationSecondsRef.current >= REMINDER_THRESHOLD_SECONDS &&
          !fiveMinReminderShownRef.current
        ) {
          fiveMinReminderShownRef.current = true;
          setShowFiveMinReminder(true);
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showTipsModal, timeRemainingSeconds, endInterview]);

  // Ensure video plays when component mounts and stream is available
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef]);

  const handleStartInterview = () => {
    setShowTipsModal(false);
    const total =
      totalDurationSecondsRef.current ||
      parseDurationToSeconds(interviewDetails?.round?.duration);
    setTimeRemainingSeconds(total);
  };

  const handleCloseFiveMinReminder = () => {
    setShowFiveMinReminder(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex flex-col h-screen w-screen overflow-hidden bg-[#fafafa]">
        <Header isUser={true} />
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 min-h-0 w-full">
            {/* Left: Interviewer video */}
            <div className="w-1/2 flex flex-col border-r border-[#e5e5e5] bg-white overflow-hidden">
              <div className="flex-1 flex flex-col justify-center px-6 py-5 min-h-0">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#02563d]/08 text-[#02563d] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#02563d] animate-pulse" />
                    {interviewDetails?.round?.type} Round
                  </span>
                  <div className="flex items-center gap-2">
                    {!showTipsModal && timeRemainingSeconds !== null && (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0a0a0a] text-white text-sm tabular-nums font-medium"
                        aria-live="polite"
                        aria-label={`Time remaining: ${formatTimeRemaining(
                          timeRemainingSeconds
                        )}`}
                      >
                        <Clock className="w-3.5 h-3.5 text-[#a3a3a3]" />
                        {formatTimeRemaining(timeRemainingSeconds)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#e5e5e5] relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.play().catch((error) => {
                        console.error("Error playing video on load:", error);
                      });
                    }}
                  />
                  {faceWarningMessage && (
                    <div
                      className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-amber-500/95 text-amber-950 text-sm font-medium rounded-b-xl"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{faceWarningMessage}</span>
                    </div>
                  )}
                </div>
                <p className="mt-3 mx-auto text-sm font-medium text-[#0a0a0a] truncate">
                  {interviewDetails?.applicant?.name}
                </p>
              </div>
            </div>

            {/* Right: LiveKit / controls */}
            <div className="w-1/2 flex flex-col bg-[#fafafa] min-h-0">
              {hasLiveKitConfig ? (
                <LiveKitRoom
                  token={token!}
                  serverUrl={serverUrl!}
                  connect
                  data-lk-theme="default"
                >
                  <CustomVideoConference onEndCall={endInterview} />
                </LiveKitRoom>
              ) : (
                <div className="flex-1 flex items-center justify-center px-6 text-sm text-[#737373] text-center">
                  Unable to connect: missing LiveKit token.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen exit warning — one penalty message every time user leaves fullscreen */}
      <Dialog
        open={showFullscreenWarning}
        onOpenChange={(open) => {
          if (!open) setShowFullscreenWarning(false);
        }}
      >
        <DialogContent
          role="alertdialog"
          aria-describedby="fullscreen-warning-desc"
          className="max-w-[420px] p-0 overflow-hidden rounded-xl shadow-xl border-l-4 border-l-amber-500 border border-amber-500/20"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="p-6 pb-4">
            <div className="flex gap-4">
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600"
                aria-hidden
              >
                <AlertTriangle className="w-6 h-6" strokeWidth={2.25} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <DialogHeader className="space-y-1 p-0">
                  <DialogTitle className="text-lg font-semibold tracking-tight text-amber-900">
                    Leaving fullscreen is a penalty
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription
                  id="fullscreen-warning-desc"
                  className="text-sm leading-relaxed mt-1.5 text-amber-800/90"
                >
                  You left fullscreen during the interview. This may be recorded
                  as a penalty. Return to fullscreen to continue.
                </DialogDescription>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3 px-6 py-4 bg-[#fafafa] border-t border-[#e5e5e5] rounded-b-xl">
            <Button
              onClick={handleEnterFullscreen}
              className="h-10 px-5 bg-[#02563d] text-white text-sm font-semibold hover:bg-[#02563d]/90 rounded-lg shadow-sm inline-flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" aria-hidden />
              Enter fullscreen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5-minute remaining reminder */}
      <Dialog
        open={showFiveMinReminder}
        onOpenChange={(open) => !open && handleCloseFiveMinReminder()}
      >
        <DialogContent
          className="max-w-[400px] p-6 rounded-xl"
          aria-describedby="five-min-reminder-desc"
        >
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-base font-semibold text-[#0a0a0a]">
              Time reminder
            </DialogTitle>
          </DialogHeader>
          <p
            id="five-min-reminder-desc"
            className="text-sm text-[#737373] leading-relaxed"
          >
            You have about 5 minutes left in this round. Use the time to wrap up
            your answers. The interview will end automatically when time is up.
          </p>
          <DialogFooter className="pt-4">
            <Button
              onClick={handleCloseFiveMinReminder}
              className="h-9 bg-[#02563d] text-white text-sm font-medium hover:bg-[#02563d]/90 rounded-lg"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview tips */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent
          className="max-w-[400px] p-6 rounded-xl"
          showCloseButton={false}
        >
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold text-[#0a0a0a]">
              Interview tips
            </DialogTitle>
          </DialogHeader>
          <ul className="space-y-2.5 py-4">
            {[
              "Speak clearly and at a moderate pace",
              "Look at the camera when responding",
              "Don't switch tabs while interview is in progress",
              "Take a moment to think before answering",
              "Be authentic and honest in your responses",
            ].map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm text-[#0a0a0a]"
              >
                <Check className="w-4 h-4 text-[#02563d] shrink-0 mt-0.5" />
                <span className="leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleStartInterview}
            className="w-full h-10 bg-[#02563d] text-white text-sm font-medium rounded-lg hover:bg-[#02563d]/90"
          >
            Start interview
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
