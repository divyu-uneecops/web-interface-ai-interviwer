"use client";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { InterviewFlowState } from "../types/flow.types";

interface VerificationReadyFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  applicantName: string;
  companyName: string;
}

export function VerificationReadyFlow({
  onStateChange,
  videoRef,
  applicantName,
  companyName,
}: VerificationReadyFlowProps) {
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
                  <h3 className="font-semibold text-[#0a0a0a] mb-2">
                    Start Recording
                  </h3>
                  <p className="text-sm text-[#717182] mb-4">0% completed</p>
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

            <Button
              onClick={() => {
                onStateChange("verification-recording");
              }}
              className="w-full mt-6 h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
            >
              Start recording
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
