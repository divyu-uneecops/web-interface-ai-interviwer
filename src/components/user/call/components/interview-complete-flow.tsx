"use client";

import { useState } from "react";
import { CircleCheckBig } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";

export function InterviewCompleteFlow() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    toast.success("Feedback submitted successfully!");
    // Could navigate away or show confirmation
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header isUser={true} />
      <div className="max-w-[738px] mx-auto mt-[20px] px-[12px]">
        <div className="flex flex-col items-center gap-[12px]">
          <div>
            <CircleCheckBig className="w-20 h-20" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold leading-[28px] text-[#0a0a0a]">
              Interview Complete!
            </h1>
          </div>
          {/* Success card - pixel-perfect with guidelines-flow card style */}
          <Card className="w-full border border-[#e5e5e5] rounded-[14px] px-[12px] py-[16px] bg-white shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <p className="text-[14px] font-medium leading-[20px] text-[#0a0a0a]">
                  We appreciate your time!
                </p>
                <p className="text-[14px] font-normal leading-[20px] text-[#717182]">
                  Your responses have been successfully submitted.
                </p>
                <p className="text-[14px] font-normal leading-[20px] text-[#717182]">
                  Our team will review your interview and share next steps with
                  you soon.
                </p>
              </div>
            </div>
          </Card>

          {/* Feedback card - matches guidelines-flow card + auth-flow inputs */}
          <Card className="w-full border border-[#e5e5e5] rounded-[14px] px-[24px] py-[20px] bg-white shadow-[0_1px_2px_0_rgba(2,86,61,0.12)]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
                  How was your experience with AI interviewer?
                </label>
                <Textarea
                  placeholder="Write text here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e?.target?.value)}
                  className="min-h-[120px] rounded-md border border-[#e5e5e5] bg-white px-3 py-2 text-[14px] leading-5 text-[#0a0a0a] placeholder:text-[#737373] shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] focus-visible:border-[#A3A3A3] focus-visible:ring-[#02563d]/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium leading-[14px] text-[#0a0a0a]">
                  Rate AI interviewer
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="w-8 h-8 flex items-center justify-center rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#02563d]/30 focus-visible:ring-offset-1"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <svg
                        className={`w-6 h-6 transition-colors ${
                          star <= rating
                            ? "fill-[#02563d] text-[#02563d]"
                            : "fill-none stroke-[#e5e5e5] text-[#e5e5e5]"
                        }`}
                        viewBox="0 0 24 24"
                        aria-hidden
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
                className="self-end h-11 bg-[#02563d] text-white text-base font-medium leading-5 rounded-md shadow-[0_1px_2px_0_rgba(2,86,61,0.12)] hover:bg-[#02563d]/90"
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
