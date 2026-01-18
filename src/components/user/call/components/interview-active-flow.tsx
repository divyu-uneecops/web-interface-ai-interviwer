"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronRight, Check, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { InterviewFlowState } from "../types/flow.types";

import { LiveKitRoom } from "@livekit/components-react";
import { CustomVideoConference } from "./custom-video-conference";

import "@livekit/components-styles";

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

  // Ensure video plays when component mounts and stream is available
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef]);

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
                onLoadedMetadata={(e) => {
                  e.currentTarget.play().catch((error) => {
                    console.error("Error playing video on load:", error);
                  });
                }}
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
          <LiveKitRoom
            token={`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGV2cmlzaGkgQmhhcmR3YWoiLCJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6ImludGVydmlldy02OTYzY2VhNWM5YmE4M2EwNzZhYWM5NDAtNjI2YWZhYWYiLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlfSwic3ViIjoiY2FuZGlkYXRlLTY5NjNjZWE1YzliYTgzYTA3NmFhYzk0MCIsImlzcyI6IkFQSXR5bnp3UmtQZWh1ciIsIm5iZiI6MTc2ODU2NTU2NywiZXhwIjoxNzY4NTY5MTY3fQ.Gn_A9O2Ptk-eou17usoz2Wc7o-esZ23WeRlCoUjAJRQ`}
            serverUrl="wss://voicebot-kj0vxeoj.livekit.cloud"
            connect
            data-lk-theme="default"
            style={{ height: "100vh" }}
          >
            <CustomVideoConference
              onEndCall={() => {
                onStateChange("interview-complete");
                onStopCamera();
              }}
            />
          </LiveKitRoom>
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
