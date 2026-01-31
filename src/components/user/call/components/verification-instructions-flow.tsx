"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InterviewFlowState } from "../types/flow.types";
import { Header } from "@/components/header";

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
      <Header isUser={true} />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-[10px] items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h1 className="text-[20px] font-bold text-[#0a0a0a] line-height-[28px]">
              Voice & video verification
            </h1>
            <p className="text-[14px] font-normal text-[#0a0a0a] line-height-[20px]">
              Let's test your microphone and camera before starting the
              interview
            </p>
          </div>

          <Card className="w-full border border-[#e5e5e5] rounded-[14px] p-8 bg-white">
            <div className="flex flex-col gap-5">
              <h2 className="text-[16px] font-medium text-[#0a0a0a] line-height-[20px]">
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
                  <div key={item.step} className="flex items-start gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#F0FDF4] text-[#02563d] font-semibold text-sm shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="font-normal font-size-[14px] text-[#0a0a0a]">
                        {item.title}
                      </p>
                      <p className="font-normal font-size-[12px] text-[#717182]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Button
            onClick={handleContinue}
            className="h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
