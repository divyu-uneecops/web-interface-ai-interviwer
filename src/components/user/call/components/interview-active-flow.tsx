"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronRight, Check, Video, Mic2 } from "lucide-react";

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
    <>
      <Header isUser={true} />
      <div className="flex">
        {/* Left Panel - Professional Video-Focused Design */}
        <div className="w-1/2 border-r border-gray-200/50 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 overflow-hidden">
          <div className="flex flex-col items-center justify-center p-4 gap-10">
            {/* Minimal Header - Top Left */}
            <div className="flex justify-between w-full animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-sm border border-[#02563d]/20 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-[#02563d] rounded-full animate-pulse shadow-[0_0_6px_rgba(2,86,61,0.5)]" />
                <span className="text-xs font-semibold text-[#02563d] tracking-wide">
                  Skills Round
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">30 min duration</p>
            </div>

            {/* Hero Video Container - Center Focused */}
            <div className="w-full aspect-video group">
              {/* Professional Video Frame */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] border border-gray-200/80 bg-white">
                {/* Video Element */}
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

                {/* Subtle Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Top Status Indicators - Minimal & Professional */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  {/* Live Indicator */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-xl rounded-lg border border-gray-200/60 shadow-lg">
                    <div className="relative">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 tracking-wide">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Name - Bottom Center */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-lg border border-gray-200/60 shadow-lg">
                <p className="text-sm font-semibold text-gray-800">{applicantName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-6 flex flex-col bg-white">
          <LiveKitRoom
            token={`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGV2cmlzaGkgQmhhcmR3YWoiLCJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6ImludGVydmlldy02OTYzY2VhNWM5YmE4M2EwNzZhYWM5NDAtNjk1ZWY4YTciLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlfSwic3ViIjoiY2FuZGlkYXRlLTY5NjNjZWE1YzliYTgzYTA3NmFhYzk0MCIsImlzcyI6IkFQSXR5bnp3UmtQZWh1ciIsIm5iZiI6MTc2OTUzMDUwNiwiZXhwIjoxNzY5NTM0MTA2fQ.g5_kL41MaPfkcJsQBhlxbnqbyLjxQp9e7Agy7oqn-lA`}
            serverUrl="wss://voicebot-kj0vxeoj.livekit.cloud"
            connect
            data-lk-theme="default"
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
    </>
  );
}
