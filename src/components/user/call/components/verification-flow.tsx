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
  onStartRecording: () => void;
  onRetry: () => void;
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recordingProgress: number;
  applicantName: string;
  companyName: string;
}

export function VerificationFlow({
  state,
  onStartRecording,
  onRetry,
  onContinue,
  videoRef,
  recordingProgress = 0,
  applicantName,
  companyName,
}: VerificationFlowProps) {
  const [howItWorksOpen, setHowItWorksOpen] = useState(true);

  // Ensure video plays when component mounts and stream is available
  useEffect(() => {
    const video = videoRef?.current;
    if (video && video?.srcObject) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef, state]);

  return (
    <div className="min-h-screen bg-neutral-50">
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

      <div className="mx-auto w-full max-w-[680px] px-4 pt-6 pb-10">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Video verification
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600">
            Let&apos;s test your camera before starting the interview
          </p>
        </header>

        <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="relative w-full overflow-hidden bg-neutral-100 aspect-video">
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
          <div className="px-5">
            <p className="text-sm leading-relaxed text-neutral-700">
              Face the camera directly with your full face visible. Ensure only
              one person is in frame and avoid side angles, masks, or
              obstructions. Tap{" "}
              <span className="font-semibold text-[#02563d]">
                &quot;Start&quot;
              </span>{" "}
              to begin.
            </p>
          </div>
        </Card>

        <div className="mt-4 flex justify-center">
          {state === "ready" && (
            <Button
              onClick={onStartRecording}
              className="h-11 min-w-[120px] rounded-xl bg-[#02563d] px-6 text-sm font-medium text-white hover:bg-[#02563d]/90 focus-visible:ring-2 focus-visible:ring-[#02563d]/20"
            >
              Start
            </Button>
          )}

          {state === "recording" && (
            <Button
              disabled
              className="h-11 min-w-[120px] cursor-not-allowed rounded-xl bg-[#02563d]/70 px-6 text-sm font-medium text-white"
            >
              Verifying…
            </Button>
          )}

          {state === "completed" && (
            <div className="flex gap-3">
              <Button
                onClick={onRetry}
                variant="outline"
                className="h-11 rounded-xl border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-200"
              >
                Retry
              </Button>
              <Button
                onClick={onContinue}
                className="h-11 rounded-xl bg-[#02563d] px-5 text-sm font-medium text-white hover:bg-[#02563d]/90 focus-visible:ring-2 focus-visible:ring-[#02563d]/20"
              >
                Continue <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
