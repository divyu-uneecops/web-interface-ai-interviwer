"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { InterviewFlowState } from "../types/flow.types";

interface VerificationInstructionsFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  onStartCamera: () => Promise<void>;
}

export function VerificationInstructionsFlow({
  onStateChange,
  onStartCamera,
}: VerificationInstructionsFlowProps) {
  const handleContinue = async () => {
    await onStartCamera();
    onStateChange("verification-ready");
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="pt-8 pb-8">
          <Logo />
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-2xl border border-[#e5e5e5] rounded-[14px] p-8 bg-white">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#0a0a0a] mb-2">
                  Voice & video verification
                </h1>
                <p className="text-base text-[#717182]">
                  Let's test your microphone and camera before starting the
                  interview
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
                  How it works
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      step: 1,
                      title: "Permission access",
                      description: "Give access for microphone and camera",
                    },
                    {
                      step: 2,
                      title: "Stay steady and keep you eye towards camera",
                      description:
                        "We'll play back your recording to verify audio quality",
                    },
                    {
                      step: 3,
                      title: "Read the phrase aloud",
                      description:
                        "Speak clearly when recording the verification phrase",
                    },
                    {
                      step: 4,
                      title: "Confirm or retry",
                      description:
                        "If everything sounds good, proceed to the interview",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#02563d]/10 text-[#02563d] font-semibold text-sm shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#0a0a0a] mb-1">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#717182]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
