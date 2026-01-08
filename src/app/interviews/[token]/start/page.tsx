"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";

interface Question {
  id: string;
  text: string;
  type: "text" | "video" | "audio";
  timeLimit?: number;
}

export default function InterviewStartPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [interviewDuration, setInterviewDuration] = useState(0);

  useEffect(() => {
    // TODO: Fetch interview data by token
    setTimeout(() => {
      setQuestions([
        {
          id: "1",
          text: "Tell us about yourself and your experience with frontend development.",
          type: "video",
          timeLimit: 180,
        },
        {
          id: "2",
          text: "What is your approach to handling state management in React applications?",
          type: "video",
          timeLimit: 120,
        },
        {
          id: "3",
          text: "Describe a challenging project you worked on and how you overcame obstacles.",
          type: "video",
          timeLimit: 150,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [token]);

  useEffect(() => {
    if (interviewStarted && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion?.timeLimit) {
        setTimeRemaining(currentQuestion.timeLimit);
      }
    }
  }, [interviewStarted, currentQuestionIndex, questions]);

  useEffect(() => {
    if (timeRemaining > 0 && interviewStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, interviewStarted]);

  useEffect(() => {
    if (interviewStarted) {
      const timer = setInterval(() => {
        setInterviewDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [interviewStarted]);

  useEffect(() => {
    // Request media permissions
    if (interviewStarted) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setVideoEnabled(true);
          setAudioEnabled(true);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [interviewStarted]);

  const handleStartInterview = () => {
    setInterviewStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteInterview();
    }
  };

  const handleSkipQuestion = () => {
    handleNextQuestion();
  };

  const handleCompleteInterview = () => {
    router.push(`/interviews/${token}/complete`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02563d] mx-auto mb-4"></div>
          <p className="text-[#737373]">Loading interview...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <Video className="w-12 h-12 text-[#02563d] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0a0a0a] mb-2">
            Ready to Start?
          </h2>
          <p className="text-[#737373] mb-6">
            Make sure your camera and microphone are ready. You'll have{" "}
            {questions.length} questions to answer.
          </p>
          <Button
            variant="default"
            onClick={handleStartInterview}
            className="bg-[#02563d] hover:bg-[#034d35] w-full"
          >
            Start Interview
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(0,0,0,0.1)] px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#737373]">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(interviewDuration)}</span>
          </div>
          <div className="text-sm text-[#737373]">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)]">
              <div className="aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden mb-4 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                    <VideoOff className="w-12 h-12 text-[#737373]" />
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={videoEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={
                    videoEnabled ? "bg-[#02563d] hover:bg-[#034d35]" : ""
                  }
                >
                  {videoEnabled ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={audioEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={
                    audioEnabled ? "bg-[#02563d] hover:bg-[#034d35]" : ""
                  }
                >
                  {audioEnabled ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Question Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border border-[rgba(0,0,0,0.1)]">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#45556c]">
                    Question
                  </span>
                  {timeRemaining > 0 && (
                    <div className="flex items-center gap-1 text-sm text-[#737373]">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-base font-medium text-[#0a0a0a] leading-relaxed">
                  {currentQuestion?.text}
                </h3>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex gap-1 mb-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded ${
                        index < currentQuestionIndex
                          ? "bg-[#00a63e]"
                          : index === currentQuestionIndex
                          ? "bg-[#02563d]"
                          : "bg-[#e5e5e5]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#737373] text-center">
                  {currentQuestionIndex + 1} of {questions.length} completed
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleSkipQuestion}
                  className="w-full"
                >
                  Skip Question
                </Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    variant="default"
                    onClick={handleNextQuestion}
                    className="w-full bg-[#02563d] hover:bg-[#034d35]"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleCompleteInterview}
                    className="w-full bg-[#02563d] hover:bg-[#034d35]"
                  >
                    Complete Interview
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
