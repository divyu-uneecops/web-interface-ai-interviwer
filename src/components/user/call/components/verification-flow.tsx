"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { InterviewFlowState } from "../types/flow.types";

const HOW_IT_WORKS_STEPS = [
  {
    title: "Permission access",
    description: "Give access for microphone and camera",
  },
  {
    title: "Stay steady and keep your eye towards camera",
    description: "We'll play back your recording to verify audio quality",
  },
  {
    title: "Read the phrase aloud",
    description: "Speak clearly when recording the verification phrase",
  },
  {
    title: "Confirm or retry",
    description: "If everything sounds good, proceed to the interview",
  },
] as const;

type VerificationState = "ready" | "recording" | "completed";

interface VerificationFlowProps {
  state: VerificationState;
  onStateChange: (state: InterviewFlowState) => void;
  onRetry?: () => void;
  onContinue?: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recordingProgress?: number;
  applicantName: string;
  companyName: string;
}

export function VerificationFlow({
  state,
  onStateChange,
  onRetry,
  onContinue,
  videoRef,
  recordingProgress = 0,
  applicantName,
  companyName,
}: VerificationFlowProps) {
  const [howItWorksOpen, setHowItWorksOpen] = useState(true);
  const authorizationStatement = `I, ${applicantName}, authorize ${companyName} to record and use my voice for verification, as per the platform's privacy policy.`;

  // Ensure video plays when component mounts and stream is available
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef, state]);

  const statusText =
    state === "ready" ? "Start Recording" : "Recording in progress";
  const progressText =
    state === "ready"
      ? "0% completed"
      : state === "recording"
      ? `${recordingProgress}% completed`
      : "100% completed";
  const statusColor = state === "ready" ? "text-[#0a0a0a]" : "text-[#02563d]";
  const progressColor =
    state === "ready" ? "text-[#717182]" : "text-[#02563d]/70";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-[480px] rounded-[14px] border border-[#e5e5e5] bg-white p-6 shadow-lg sm:max-w-[480px]"
        >
          <DialogHeader>
            <DialogTitle className="text-left text-[16px] font-medium leading-[20px] text-[#0a0a0a]">
              How it works
            </DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col gap-4 py-1">
            {HOW_IT_WORKS_STEPS?.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#F0FDF4] text-[14px] font-semibold text-[#02563D]"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <span className="text-[14px] font-normal leading-[18px] text-[#0a0a0a]">
                    {step?.title}
                  </span>
                  <span className="text-[12px] font-light leading-[12px] text-[#717182]">
                    {step?.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <DialogFooter className="flex justify-end border-0 pt-1 sm:justify-end">
            <Button
              onClick={() => setHowItWorksOpen(false)}
              className="h-10 bg-[#02563d] px-5 text-white font-medium hover:bg-[#02563d]/90"
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Header isUser={true} />

      {/* Main content - pixel-perfect layout (Figma 1293-8524, 1293-8610, 1293-9045) */}
      <div className="mx-auto w-full max-w-[672px] px-6 pb-12 pt-6">
        {/* Title block: 24px top, 8px between title and subtitle */}
        <div className="mb-6 text-center">
          <h1 className="text-[20px] font-bold leading-[28px] text-[#0a0a0a]">
            Voice & video verification
          </h1>
          <p className="mt-2 text-[14px] font-normal leading-[20px] text-[#0a0a0a]">
            Let&apos;s test your microphone and camera before starting the
            interview
          </p>
        </div>

        {/* Card: 14px radius, 1px border, 24px padding */}
        <Card className="w-full rounded-[14px] border border-[#e5e5e5] bg-white p-6 shadow-none">
          <div className="flex flex-col gap-6">
            {/* Status + progress: 16px title, 12px caption, 4px gap */}
            <div className="text-center">
              <h3
                className={`text-[16px] font-medium leading-[20px] ${statusColor}`}
              >
                {statusText}
              </h3>
              <p
                className={`mt-1 text-[12px] font-normal leading-[16px] ${progressColor}`}
              >
                {progressText}
              </p>
            </div>

            {/* Video: 16:9, #f5f5f5, 8px radius */}
            <div className="relative w-full overflow-hidden rounded-lg bg-[#f5f5f5] [aspect-ratio:16/9]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                onLoadedMetadata={(e) => {
                  e.currentTarget.play().catch((error) => {
                    console.error("Error playing video on load:", error);
                  });
                }}
              />
            </div>

            {/* Three dots - recording only: 6px diameter, #02563d */}
            {state === "recording" && (
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#02563d]"
                    aria-hidden
                  />
                ))}
              </div>
            )}

            {/* Authorization: 16px semibold, 24px line-height */}
            <p className="text-center text-[16px] font-semibold leading-[24px] text-[#0a0a0a]">
              {authorizationStatement}
            </p>
          </div>
        </Card>

        {/* Hint card: #fafafa, 14px radius, 16px padding */}
        <div className="mt-6 rounded-[14px] border border-[#e5e5e5] bg-[#fafafa] p-4">
          <p className="text-[12px] font-normal leading-[16px] text-[#717182]">
            Tap{" "}
            <span className="font-semibold text-[#0a0a0a]">
              &quot;Start recording&quot;
            </span>{" "}
            to begin, and read the statement shown.
          </p>
          <p className="mt-2 text-[12px] font-normal leading-[16px] text-[#717182]">
            {authorizationStatement}
          </p>
        </div>

        {/* CTA: 24px mt, 44px height, 14px radius */}
        {state === "ready" && (
          <Button
            onClick={() => onStateChange("verification-recording")}
            className="mt-6 h-11 w-full rounded-[14px] bg-[#02563d] text-[16px] font-medium text-white hover:bg-[#02563d]/90"
          >
            Start recording
          </Button>
        )}

        {state === "recording" && (
          <Button
            disabled
            className="mt-6 h-11 w-full rounded-[14px] bg-[#02563d] text-[16px] font-medium text-white opacity-50"
          >
            Recording...
          </Button>
        )}

        {state === "completed" && (
          <div className="mt-6 flex gap-4">
            <Button
              onClick={onRetry}
              variant="outline"
              className="h-11 flex-1 rounded-[14px] border border-[#e5e5e5] bg-white text-[16px] font-medium text-[#0a0a0a] hover:bg-[#fafafa]"
            >
              Retry
            </Button>
            <Button
              onClick={onContinue}
              className="h-11 flex-1 rounded-[14px] bg-[#02563d] text-[16px] font-medium text-white hover:bg-[#02563d]/90"
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
