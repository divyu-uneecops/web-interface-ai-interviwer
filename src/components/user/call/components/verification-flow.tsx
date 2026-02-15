"use client";

import { useEffect, useState } from "react";
import { ChevronRight, AlertTriangle, ScanFace } from "lucide-react";

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
import { useFaceValidation } from "../hooks/useFaceValidation";

const HOW_IT_WORKS_STEPS = [
  {
    title: "Permission access",
    description: "Give access for microphone, camera, and screen share",
  },
  {
    title: "Stay steady and keep your eye towards camera",
    description: "Face the camera directly with your full face visible",
  },
  {
    title: "Fulfill any warnings",
    description: "If a warning appears, follow the instructions to fix it",
  },
  {
    title: "Continue to interview",
    description:
      "Once your face is detected and screen is shared, tap Continue to start",
  },
] as const;

interface VerificationFlowProps {
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  screenShareActive: boolean;
  screenShareError: string | null;
  onRetryScreenShare: () => void;
}

export function VerificationFlow({
  onContinue,
  videoRef,
  screenShareActive,
  screenShareError,
  onRetryScreenShare,
}: VerificationFlowProps) {
  const [howItWorksOpen, setHowItWorksOpen] = useState(true);

  const { warning, isChecking, warningMessage } = useFaceValidation({
    videoRef,
    active: true,
    includePenaltyInMessage: false,
  });

  const canContinue = !isChecking && !warning && screenShareActive;

  useEffect(() => {
    const video = videoRef?.current;
    if (video?.srcObject) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef]);

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
            {warningMessage && (
              <div
                className="absolute bottom-0 left-0 right-0 flex items-start gap-3 px-4 py-3 rounded-b-xl border-t border-amber-300/80 bg-amber-50/98 backdrop-blur-sm shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
                role="alert"
                aria-live="polite"
                aria-label={`Camera: ${warningMessage}`}
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-amber-100 text-amber-700 border border-amber-200/80"
                  aria-hidden
                >
                  <ScanFace className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700/90 mb-0.5">
                    Camera
                  </p>
                  <p className="text-sm font-medium text-amber-900 leading-snug">
                    {warningMessage}
                  </p>
                </div>
                <AlertTriangle
                  className="w-4 h-4 shrink-0 text-amber-600 mt-1"
                  aria-hidden
                />
              </div>
            )}
          </div>
          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-neutral-700">
              Face the camera directly with your full face visible. Ensure only
              one person is in frame and avoid side angles, masks, or
              obstructions.
            </p>
          </div>
        </Card>

        {screenShareError && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
            <p className="text-xs text-amber-800" role="alert">
              {screenShareError}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetryScreenShare}
              className="text-xs"
            >
              Try again
            </Button>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Button
            onClick={onContinue}
            disabled={!canContinue}
            className="h-11 min-w-[140px] rounded-xl bg-[#02563d] px-6 text-sm font-medium text-white hover:bg-[#02563d]/90 focus-visible:ring-2 focus-visible:ring-[#02563d]/20 disabled:pointer-events-none disabled:opacity-70"
          >
            Continue <ChevronRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
