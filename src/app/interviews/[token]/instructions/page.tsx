"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  FileText,
  Video,
  Mic,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import { Logo } from "@/components/logo";

interface InterviewInstructions {
  candidateName: string;
  jobTitle: string;
  roundName: string;
  duration: number;
  interviewerName: string;
  scheduledDate: string;
  scheduledTime: string;
  instructions: string[];
  requirements: string[];
  allowVideo: boolean;
  allowAudio: boolean;
}

export default function InterviewInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [interviewData, setInterviewData] =
    useState<InterviewInstructions | null>(null);

  useEffect(() => {
    // TODO: Fetch interview data by token
    // For now, using mock data
    setTimeout(() => {
      setInterviewData({
        candidateName: "John Doe",
        jobTitle: "Senior Frontend Developer",
        roundName: "Technical Screening",
        duration: 45,
        interviewerName: "AI Interviewer",
        scheduledDate: "2024-01-15",
        scheduledTime: "14:00",
        instructions: [
          "Ensure you have a stable internet connection",
          "Find a quiet, well-lit environment",
          "Have your camera and microphone ready",
          "Close unnecessary applications and browser tabs",
          "Have a glass of water nearby",
        ],
        requirements: [
          "Laptop or desktop computer",
          "Webcam (built-in or external)",
          "Microphone (built-in or external)",
          "Modern web browser (Chrome, Firefox, or Edge)",
          "Stable internet connection (minimum 1 Mbps)",
        ],
        allowVideo: true,
        allowAudio: true,
      });
      setLoading(false);
    }, 500);
  }, [token]);

  const handleStartInterview = () => {
    router.push(`/interviews/${token}/start`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02563d] mx-auto mb-4"></div>
          <p className="text-[#737373]">Loading interview instructions...</p>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-[#d92d20] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0a0a0a] mb-2">
            Interview Not Found
          </h2>
          <p className="text-[#737373]">
            The interview link is invalid or has expired.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(0,0,0,0.1)] px-6 py-4">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Interview Overview Card */}
          <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)]">
            <h1 className="text-2xl font-semibold text-[#0a0a0a] mb-6">
              Interview Instructions
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[rgba(2,86,61,0.1)] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <p className="text-xs font-normal text-[#45556c] mb-1">
                    Candidate
                  </p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {interviewData.candidateName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[rgba(2,86,61,0.1)] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <p className="text-xs font-normal text-[#45556c] mb-1">
                    Position
                  </p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {interviewData.jobTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[rgba(2,86,61,0.1)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <p className="text-xs font-normal text-[#45556c] mb-1">
                    Round
                  </p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {interviewData.roundName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[rgba(2,86,61,0.1)] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <p className="text-xs font-normal text-[#45556c] mb-1">
                    Duration
                  </p>
                  <p className="text-sm font-medium text-[#0a0a0a]">
                    {interviewData.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Instructions Card */}
          <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#02563d]" />
              Before You Begin
            </h2>
            <ul className="space-y-3">
              {interviewData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00a63e] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#0a0a0a]">{instruction}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Requirements Card */}
          <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#02563d]" />
              Technical Requirements
            </h2>
            <ul className="space-y-3">
              {interviewData.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#02563d] shrink-0 mt-2" />
                  <span className="text-sm text-[#0a0a0a]">{requirement}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Media Permissions Card */}
          <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-4">
              Media Permissions
            </h2>
            <div className="flex flex-wrap gap-4">
              {interviewData.allowVideo && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(2,86,61,0.1)] rounded-md">
                  <Video className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-[#0a0a0a]">Video Required</span>
                </div>
              )}
              {interviewData.allowAudio && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(2,86,61,0.1)] rounded-md">
                  <Mic className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-[#0a0a0a]">Audio Required</span>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button
              variant="default"
              onClick={handleStartInterview}
              className="bg-[#02563d] hover:bg-[#034d35]"
            >
              Start Interview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
