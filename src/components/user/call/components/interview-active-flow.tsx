"use client";

import { useState } from "react";
import { Clock, ChevronRight, Check, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { InterviewFlowState } from "../types/flow.types";

interface InterviewActiveFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  onStopCamera: () => void;
  onInterviewStart: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  applicantName: string;
  interviewTimer: number;
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  formatTime: (seconds: number) => string;
}

export function InterviewActiveFlow({
  onStateChange,
  onStopCamera,
  onInterviewStart,
  videoRef,
  applicantName,
  interviewTimer,
  currentQuestion,
  totalQuestions,
  onNextQuestion,
  formatTime,
}: InterviewActiveFlowProps) {
  const [showTipsModal, setShowTipsModal] = useState(true);
  const isLastQuestion = currentQuestion === totalQuestions;

  const handleStartInterview = () => {
    setShowTipsModal(false);
    onInterviewStart();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      onNextQuestion();
    } else {
      onStateChange("interview-complete");
      onStopCamera();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isUser={true} />
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className="w-1/2 border-r border-[#e5e5e5] p-6 flex flex-col bg-[#fafafa]">
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#0a0a0a] mb-2">
                Skills round
              </h2>
              <p className="text-sm text-[#717182]">
                Duration of this round: 30 min.
              </p>
            </div>

            <div className="relative w-full max-w-md aspect-video bg-[#f5f5f5] rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Timer overlay on video - positioned at bottom center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {formatTime(interviewTimer)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-6 flex flex-col bg-white">
          {/* Question Progress Bar - Full width light gray bar */}
          <div className="mb-6">
            <div className="w-full bg-[#f5f5f5] rounded-md px-4 py-2">
              <span className="text-sm font-medium text-[#717182] block text-center">
                Question {currentQuestion}/{totalQuestions}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {/* AI Question Message Bubble */}
            <div className="flex items-start gap-3">
              {/* Avatar - slightly indented from left */}
              <div className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#717182]" />
              </div>
              {/* Message Bubble - light grey background */}
              <div className="flex-1 bg-[#fafafa] border border-[#e5e5e5] rounded-lg px-4 py-3">
                <p className="text-base text-[#0a0a0a] leading-normal font-normal">
                  Hey {applicantName.split(" ")[0]}, give a brief introduction
                  about yourself.
                </p>
              </div>
            </div>

            {/* Recording Response Card */}
            <Card className="border border-[#e5e5e5] rounded-lg p-4 bg-white flex-1 flex flex-col min-h-0">
              <p className="text-sm font-medium text-[#717182] mb-2">
                Recording your response...
              </p>
              <div className="flex-1 border-b-2 border-dashed border-[#e5e5e5]"></div>
            </Card>

            {/* Action Button */}
            <Button
              onClick={handleNextQuestion}
              className="self-end h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90 px-4"
            >
              {isLastQuestion ? "Finish" : "Go to next question"}{" "}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Interview Tips Modal */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent className="max-w-md p-6" showCloseButton={false}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold text-[#0a0a0a] text-left">
              Interview tips
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mb-6">
            {[
              "Speak clearly and at a moderate pace",
              "Look at the camera when responding",
              "Don't switch tabs while interview is in progress",
              "Take a moment to think before answering",
              "Be authentic and honest in your responses",
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#02563d] shrink-0 mt-0.5" />
                <p className="text-sm text-[#0a0a0a] leading-normal">{tip}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={handleStartInterview}
            className="w-full h-11 bg-[#02563d] text-white font-medium rounded-md hover:bg-[#02563d]/90"
          >
            Start interview <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
