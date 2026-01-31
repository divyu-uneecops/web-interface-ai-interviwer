"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";

export function InterviewCompleteFlow() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    toast.success("Feedback submitted successfully!");
    // Could navigate away or show confirmation
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="pt-8 pb-8">
          <Logo />
        </div>

        <div className="flex flex-col items-center gap-8">
          <Card className="w-full max-w-2xl border border-[#e5e5e5] rounded-[14px] p-12 bg-white text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0a0a0a] mb-3">
                  Interview Complete!
                </h1>
                <p className="font-semibold text-[#0a0a0a] mb-2">
                  We appreciate your time!
                </p>
                <p className="text-sm text-[#717182] mb-1">
                  Your responses have been successfully submitted.
                </p>
                <p className="text-sm text-[#717182]">
                  Our team will review your interview and share next steps with
                  you soon.
                </p>
              </div>
            </div>
          </Card>

          <Card className="w-full max-w-2xl border border-[#e5e5e5] rounded-[14px] p-6 bg-white">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0a0a0a]">
                  How was your experience with AI interviewer?
                </label>
                <Textarea
                  placeholder="Write text here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0a0a0a]">
                  Rate AI interviewer
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <svg
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "fill-[#02563d] text-[#02563d]"
                            : "fill-none stroke-[#e5e5e5] text-[#e5e5e5]"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="self-end h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
              >
                Submit
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
