"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  FileText,
  Home,
  Download,
  Share2,
} from "lucide-react";
import { Logo } from "@/components/logo";

interface InterviewSummary {
  candidateName: string;
  jobTitle: string;
  roundName: string;
  completedAt: string;
  duration: string;
  totalQuestions: number;
  answeredQuestions: number;
  score?: number;
}

export default function InterviewCompletePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<InterviewSummary | null>(null);

  useEffect(() => {
    // TODO: Fetch interview summary by token
    setTimeout(() => {
      setSummary({
        candidateName: "John Doe",
        jobTitle: "Senior Frontend Developer",
        roundName: "Technical Screening",
        completedAt: new Date().toISOString(),
        duration: "42:15",
        totalQuestions: 5,
        answeredQuestions: 5,
        score: 85,
      });
      setLoading(false);
    }, 500);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02563d] mx-auto mb-4"></div>
          <p className="text-[#737373]">Processing your interview...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(0,0,0,0.1)] px-6 py-4">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[rgba(0,166,62,0.1)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#00a63e]" />
          </div>
          <h1 className="text-3xl font-semibold text-[#0a0a0a] mb-2">
            Interview Completed!
          </h1>
          <p className="text-[#737373]">
            Thank you for completing the interview. We'll review your responses
            and get back to you soon.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="p-8 bg-white border border-[rgba(0,0,0,0.1)] mb-6">
          <h2 className="text-xl font-semibold text-[#0a0a0a] mb-6">
            Interview Summary
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
              <span className="text-sm text-[#737373]">Candidate</span>
              <span className="text-sm font-medium text-[#0a0a0a]">
                {summary.candidateName}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
              <span className="text-sm text-[#737373]">Position</span>
              <span className="text-sm font-medium text-[#0a0a0a]">
                {summary.jobTitle}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
              <span className="text-sm text-[#737373]">Round</span>
              <span className="text-sm font-medium text-[#0a0a0a]">
                {summary.roundName}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
              <span className="text-sm text-[#737373]">Duration</span>
              <span className="text-sm font-medium text-[#0a0a0a] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {summary.duration}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.1)]">
              <span className="text-sm text-[#737373]">Questions Answered</span>
              <span className="text-sm font-medium text-[#0a0a0a]">
                {summary.answeredQuestions} / {summary.totalQuestions}
              </span>
            </div>

            {summary.score !== undefined && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-[#737373]">Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#0a0a0a]">
                    {summary.score}%
                  </span>
                  <div className="w-24 h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00a63e] rounded-full"
                      style={{ width: `${summary.score}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)] mb-6">
          <h3 className="text-lg font-semibold text-[#0a0a0a] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#02563d]" />
            What's Next?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#02563d] shrink-0 mt-2" />
              <span className="text-sm text-[#0a0a0a]">
                Our team will review your interview responses
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#02563d] shrink-0 mt-2" />
              <span className="text-sm text-[#0a0a0a]">
                You'll receive an email update within 2-3 business days
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#02563d] shrink-0 mt-2" />
              <span className="text-sm text-[#0a0a0a]">
                Check your email for further communication
              </span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // TODO: Download interview transcript
              alert("Download feature coming soon");
            }}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Transcript
          </Button>
          <Button
            variant="default"
            onClick={() => {
              // TODO: Share interview results
              if (navigator.share) {
                navigator.share({
                  title: "Interview Completed",
                  text: `I just completed an interview for ${summary.jobTitle}`,
                });
              } else {
                alert("Share feature coming soon");
              }
            }}
            className="w-full sm:w-auto bg-[#02563d] hover:bg-[#034d35]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </main>
    </div>
  );
}
