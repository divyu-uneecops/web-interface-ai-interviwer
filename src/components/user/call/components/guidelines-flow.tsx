"use client";

import { useState } from "react";
import { Monitor, Clock, HelpCircle, ChevronRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { InterviewFlowState } from "../types/flow.types";
import { Header } from "@/components/header";

interface GuidelinesFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
}

export function GuidelinesFlow({ onStateChange }: GuidelinesFlowProps) {
  const [checklistItems, setChecklistItems] = useState({
    camera: false,
    microphone: false,
    connection: false,
    environment: false,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const canContinue =
    checklistItems?.camera &&
    checklistItems?.microphone &&
    checklistItems?.connection &&
    checklistItems?.environment &&
    agreedToTerms;

  return (
    <div className="min-h-screen bg-white">
      <Header isUser={true} />
      <div className="max-w-4xl mx-auto mt-[10px] p-[12px]">
        <div>
          {/* Main Title Section */}
          <div className="w-full text-center mb-[10px]">
            <div className="text-[20px] font-bold text-[#0a0a0a] leading-[28px]">
              Interview guidelines
            </div>
            <p className="text-[14px] font-normal text-[#0a0a0a] leading-[20px]">
              Before we begin, please review these guidelines and complete the
              checklist to ensure the best interview experience.
            </p>
          </div>

          {/* Job Details Card */}
          <Card className="w-full border border-[#e5e5e5] rounded-[14px] p-6 bg-white shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] mb-[20px]">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[18px] font-medium text-[#0a0a0a] leading-7">
                  Senior Product Manager
                </h2>
                <p className="text-[12px] font-normal text-[#737373] leading-4">
                  Product management
                </p>
              </div>

              <div className="flex flex-row flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] leading-5">
                  <Monitor className="w-4 h-4 shrink-0 text-[#737373]" />
                  <span className="text-[#737373]">Type: Behavioral round</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] leading-5">
                  <Clock className="w-4 h-4 shrink-0 text-[#737373]" />
                  <span className="text-[#737373]">Duration: 30 - 40 min.</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-normal text-[#0a0a0a] leading-5">
                  <HelpCircle className="w-4 h-4 shrink-0 text-[#737373]" />
                  <span className="text-[#737373]">Question: 8 - 10</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full border border-[#e5e5e5] rounded-[14px] p-6 bg-white shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] mb-[20px]">
            {/* Pre-interview Checklist Section */}
            <div className="w-full">
              <h3 className="text-[16px] font-medium text-[#0a0a0a] mb-4 leading-[20px]">
                Pre - interview checklist
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    key: "camera",
                    title: "Camera Setup",
                    description:
                      "Ensure your camera is working and you are well-lit",
                  },
                  {
                    key: "microphone",
                    title: "Microphone check",
                    description: "Test your microphone for clear audio",
                  },
                  {
                    key: "connection",
                    title: "Stable Connection",
                    description:
                      "Verify you have a reliable internet connection",
                  },
                  {
                    key: "environment",
                    title: "Quiet Environment",
                    description: "Find a quiet space with minimal distractions",
                  },
                ].map((item) => (
                  <Card
                    key={item.key}
                    className="border border-[#e5e5e5] rounded-[14px] p-3 bg-white shadow-[0_1px_2px_0_rgba(2,86,61,0.12)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5 shrink-0">
                        <Checkbox
                          id={item.key}
                          checked={
                            checklistItems[
                              item.key as keyof typeof checklistItems
                            ]
                          }
                          onCheckedChange={(checked) => {
                            setChecklistItems((prev) => ({
                              ...prev,
                              [item.key]: checked,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={item.key}
                          className="text-sm font-medium text-[#0a0a0a] block mb-1 cursor-pointer leading-5"
                        >
                          {item?.title}
                        </label>
                        <p className="text-sm font-normal text-[#737373] leading-5">
                          {item?.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* Privacy Notice Card */}
          <Card className="w-full border border-[#e5e5e5] rounded-[14px] p-4 bg-white shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] mb-[12px]">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-[#737373]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0a0a0a] mb-1 leading-5">
                  Privacy Notice:
                </p>
                <p className="text-sm font-normal text-[#737373] leading-5">
                  This interview will be recorded and analyzed to provide
                  feedback. Your data is encrypted and handled according to our
                  privacy policy.
                </p>
              </div>
            </div>
          </Card>

          {/* Terms Checkbox */}
          <div className="w-full mb-[16px]">
            <Checkbox
              id="terms"
              className="font-medium"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              label="I have reviewed the guidelines and agree to the terms and conditions of this interview session"
            />
          </div>
          {/* Continue Button */}
          <Button
            onClick={() => onStateChange("verification-ready")}
            disabled={!canContinue}
            className="h-11 bg-[#02563d] text-white font-medium text-base leading-5 rounded-md hover:bg-[#02563d]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] mx-auto"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
