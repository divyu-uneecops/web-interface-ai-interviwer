"use client";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { InterviewFlowState } from "../types/flow.types";

interface VerificationCompletedFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  onRetry: () => void;
  onContinue: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  applicantName: string;
  companyName: string;
}

export function VerificationCompletedFlow({
  onStateChange,
  onRetry,
  onContinue,
  videoRef,
  applicantName,
  companyName,
}: VerificationCompletedFlowProps) {
  const authorizationStatement = `I, ${applicantName}, authorize ${companyName} to record and use my voice for verification, as per the platform's privacy policy.`;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="pt-8 pb-8">
          <Logo />
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#0a0a0a] mb-2">
                Voice & video verification
              </h1>
              <p className="text-base text-[#717182]">
                Let's test your microphone and camera before starting the
                interview
              </p>
            </div>

            <Card className="w-full border border-[#e5e5e5] rounded-[14px] p-6 bg-white">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[#02563d] font-semibold mb-1">
                    Recording in progress
                  </p>
                  <p className="text-sm text-[#02563d]/70">100% completed</p>
                </div>

                <div className="relative w-full aspect-video bg-[#f5f5f5] rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-1 justify-center">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#717182]"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-base font-semibold text-[#0a0a0a] mb-4">
                    {authorizationStatement}
                  </p>
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

            <div className="flex gap-4 mt-6">
              <Button
                onClick={onRetry}
                variant="outline"
                className="flex-1 h-11"
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
          </div>
        </div>
      </div>
    </div>
  );
}
