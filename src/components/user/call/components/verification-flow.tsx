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
            <DialogTitle className="text-left text-[18px] font-bold leading-[24px] text-[#0a0a0a]">
              How it works
            </DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col gap-5 py-4">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02563d]/15 text-[14px] font-semibold text-[#02563d]"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <span className="text-[14px] font-semibold leading-[20px] text-[#0a0a0a]">
                    {step.title}
                  </span>
                  <span className="text-[13px] font-normal leading-[18px] text-[#717182]">
                    {step.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <DialogFooter className="flex justify-end border-0 pt-2 sm:justify-end">
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-[10px] mt-[22px]">
              <h1 className="text-[20px] font-bold text-[#0a0a0a] leading-[28px]">
                Voice & video verification
              </h1>
              <p className="text-[14px] font-normal text-[#0a0a0a] leading-[20px]">
                Let's test your microphone and camera before starting the
                interview
              </p>
            </div>

            <Card className="w-full border border-[#e5e5e5] rounded-[14px] p-6 bg-white">
              <div className="flex flex-col gap-6">
                <div className="p-3 flex flex-col gap-5">
                  <div className="text-center">
                    <h3
                      className={`text-[16px] font-medium leading-[20px] mb-1 ${statusColor}`}
                    >
                      {statusText}
                    </h3>
                    <p
                      className={`text-[12px] font-normal leading-[16px] mb-4 ${progressColor}`}
                    >
                      {progressText}
                    </p>
                  </div>

                  <div className="relative w-full aspect-video bg-[#f5f5f5] rounded-lg overflow-hidden">
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

                  {/* Three dots indicator - only shown during recording */}
                  {state === "recording" && (
                    <div className="flex gap-1 justify-center">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#717182]"
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-base font-semibold text-[#0a0a0a] mb-4">
                      {authorizationStatement}
                    </p>
                  </div>
                </div>
                <Card className="border border-[#e5e5e5] rounded-md p-4 bg-[#fafafa]">
                  <p className="text-sm text-[#717182] mb-2">
                    Tap{" "}
                    <span className="font-semibold text-[#0a0a0a]">
                      "Start recording"
                    </span>{" "}
                    to begin, and read the statement shown.
                  </p>
                  <p className="text-sm text-[#717182]">
                    {authorizationStatement}
                  </p>
                </Card>
              </div>
            </Card>

            {/* Button(s) based on state */}
            {state === "ready" && (
              <Button
                onClick={() => {
                  onStateChange("verification-recording");
                }}
                className="w-full mt-6 h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
              >
                Start recording
              </Button>
            )}

            {state === "recording" && (
              <Button
                disabled
                className="w-full mt-6 h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90 opacity-50 cursor-not-allowed"
              >
                Recording...
              </Button>
            )}

            {state === "completed" && (
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="flex-1 h-11 border border-[#e5e5e5] bg-white text-[#0a0a0a] hover:bg-[#fafafa]"
                >
                  Retry
                </Button>
                <Button
                  onClick={onContinue}
                  className="flex-1 h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
