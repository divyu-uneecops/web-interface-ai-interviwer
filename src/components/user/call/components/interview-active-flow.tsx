"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { InterviewFlowState } from "../types/flow.types";

import { LiveKitRoom } from "@livekit/components-react";
import { CustomVideoConference } from "./custom-video-conference";

import "@livekit/components-styles";

interface InterviewActiveFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  onStopCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  applicantName: string;
  token?: string | null;
  serverUrl?: string | null;
}

export function InterviewActiveFlow({
  onStateChange,
  onStopCamera,
  videoRef,
  applicantName,
  token,
  serverUrl,
}: InterviewActiveFlowProps) {
  const [showTipsModal, setShowTipsModal] = useState(true);
  const [fullscreenWarningType, setFullscreenWarningType] = useState<
    null | 1 | 2 | 3
  >(null);
  const hasLiveKitConfig = Boolean(token && serverUrl);
  const exitFullscreenCountRef = useRef(0);

  const handleEnterFullscreen = () => {
    setFullscreenWarningType(null);
    document.documentElement.requestFullscreen().catch(() => {});
  };

  const handleFullscreenWarningClose = () => {
    if (fullscreenWarningType === 3) {
      if (document?.fullscreenElement) {
        document
          ?.exitFullscreen()
          ?.catch((err) => console.error("Exit fullscreen error:", err));
      }
      onStateChange("interview-complete");
      onStopCamera();
    }
    setFullscreenWarningType(null);
  };

  // Detect user exiting fullscreen and show escalating warnings in Dialog
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement !== null) return;

      exitFullscreenCountRef.current += 1;
      const count = exitFullscreenCountRef.current;

      if (count === 1) {
        setFullscreenWarningType(1);
      } else if (count === 2) {
        setFullscreenWarningType(2);
      } else {
        setFullscreenWarningType(3);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const showFullscreenWarningDialog = fullscreenWarningType !== null;

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
                    Skills Round
                  </span>
                  <span className="text-xs text-[#737373]">30 min</span>
                </div>
                <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#e5e5e5]">
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
                </div>
                <p className="mt-3 text-sm font-medium text-[#0a0a0a] truncate">
                  {applicantName}
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
                  <CustomVideoConference
                    onEndCall={() => {
                      if (document?.fullscreenElement) {
                        document
                          ?.exitFullscreen()
                          ?.catch((err) =>
                            console.error("Exit fullscreen error:", err)
                          );
                      }
                      onStateChange("interview-complete");
                      onStopCamera();
                    }}
                  />
                </LiveKitRoom>
              ) : (
                <div className="flex-1 flex items-center justify-center px-6 text-sm text-[#737373] text-center">
                  Unable to connect: missing LiveKit token. Please complete the
                  auth step with a valid interview link (applicantId, jobId,
                  roundId, interviewerId in URL).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen exit warning */}
      <Dialog
        open={showFullscreenWarningDialog}
        onOpenChange={(open) => {
          if (!open && fullscreenWarningType === 3) {
            onStateChange("interview-complete");
            onStopCamera();
          }
          if (!open) setFullscreenWarningType(null);
        }}
      >
        <DialogContent
          className="max-w-[400px] p-6 rounded-xl"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-base font-semibold text-[#0a0a0a]">
              {fullscreenWarningType === 1 && "Fullscreen required"}
              {fullscreenWarningType === 2 && "Final warning"}
              {fullscreenWarningType === 3 && "Interview ended"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#737373] leading-relaxed">
            {fullscreenWarningType === 1 &&
              "Please stay in fullscreen during the interview. Return to fullscreen to continue."}
            {fullscreenWarningType === 2 &&
              "You have exited fullscreen again. Stay in fullscreen for the interview. This is a final warning."}
            {fullscreenWarningType === 3 &&
              "Repeatedly exiting fullscreen is not allowed. The interview has been ended and flagged."}
          </p>
          <DialogFooter className="gap-2 pt-4">
            {fullscreenWarningType !== 3 ? (
              <Button
                onClick={handleEnterFullscreen}
                className="h-9 bg-[#02563d] text-white text-sm font-medium hover:bg-[#02563d]/90 rounded-lg"
              >
                Enter fullscreen
              </Button>
            ) : (
              <Button
                onClick={handleFullscreenWarningClose}
                className="h-9 bg-[#02563d] text-white text-sm font-medium hover:bg-[#02563d]/90 rounded-lg"
              >
                OK
              </Button>
            )}
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
