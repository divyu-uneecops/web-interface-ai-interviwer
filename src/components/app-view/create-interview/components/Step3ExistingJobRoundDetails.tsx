import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Users } from "lucide-react";
import type { InterviewFormData } from "../types";
import { useState, useEffect, useCallback } from "react";
import { ShareInterviewLinkModal } from "./ShareInterviewLinkModal";
import { generateInterviewLink } from "../constants";
import { COPY_FEEDBACK_DURATION_MS } from "../constants";

interface Step3ExistingJobRoundDetailsProps {
  formData: InterviewFormData;
  onFieldChange: <K extends keyof InterviewFormData>(
    field: K,
    value: InterviewFormData[K]
  ) => void;
}

export const Step3ExistingJobRoundDetails = ({
  formData,
  onFieldChange,
}: Step3ExistingJobRoundDetailsProps) => {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Generate interview link once when component mounts if not already set
  useEffect(() => {
    if (!formData.interviewLink) {
      const link = generateInterviewLink();
      onFieldChange("interviewLink", link);
    }
  }, [formData.interviewLink, onFieldChange]);

  // Get actual data from formData - no fallbacks, use actual values
  const interviewLink = formData.interviewLink || "";
  const roundType = formData.roundType || "";
  const jobTitle = formData.jobTitle || "";
  const duration = formData.duration || "";

  const handleCopyLink = useCallback(async () => {
    if (!interviewLink) return;

    try {
      await navigator.clipboard.writeText(interviewLink);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy interview link:", err);
      // In a production app, you might want to show a toast notification here
    }
  }, [interviewLink]);

  // Cleanup copied state after timeout
  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, COPY_FEEDBACK_DURATION_MS);

      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  return (
    <>
      <div className="flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#e0f2f1] shrink-0 mb-6">
          <CheckCircle2
            className="w-10 h-10 text-[#267e6b]"
            strokeWidth={2.5}
          />
        </div>

        {/* Main Heading */}
        <div className="mb-4">
          <h2 className="text-[24px] font-bold text-[#0a0a0a] leading-[1.2]">
            Success! Your AI interview has been created.
          </h2>
        </div>

        {/* Descriptive Text */}
        {roundType && jobTitle && duration && (
          <p className="text-sm text-[#737373] leading-5 max-w-md mb-6">
            We've prepared the{" "}
            <span className="font-bold text-[#0a0a0a]">{roundType}</span> round
            for <span className="font-bold text-[#0a0a0a]">{jobTitle}</span>,
            estimated to take{" "}
            <span className="font-bold text-[#0a0a0a]">{duration}</span>{" "}
            minutes.
          </p>
        )}

        {/* Interview Link Container */}
        {interviewLink && (
          <div className="w-full mb-6">
            <div className="bg-[#f5f5f5] border border-[#dcdcdc] rounded-[10px] p-4 space-y-3">
              <label
                htmlFor="interview-link"
                className="text-sm font-normal text-[#0a0a0a] block text-left leading-5"
              >
                Interview Link
              </label>
              <div className="flex items-center gap-3">
                <p
                  id="interview-link"
                  className="flex-1 text-sm text-[#0a0a0a] truncate text-left font-normal"
                  aria-label={`Interview link: ${interviewLink}`}
                >
                  {interviewLink}
                </p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label={copied ? "Link copied" : "Copy interview link"}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0a0a0a] bg-[#e5e5e5] hover:bg-[#d5d5d5] border border-[#e5e5e5] rounded-md transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#02563d] focus:ring-offset-2"
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>{copied ? "Copied!" : "Copy link"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Button */}
        <Button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          disabled={!interviewLink}
          className="w-full h-11 px-4 bg-[#02563d] hover:bg-[#02563d]/90 text-white font-semibold rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Share interview link with applicants"
        >
          <Users className="w-5 h-5" aria-hidden="true" />
          <span>Share with Applicants</span>
        </Button>
      </div>

      {interviewLink && (
        <ShareInterviewLinkModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          interviewLink={interviewLink}
        />
      )}
    </>
  );
};
