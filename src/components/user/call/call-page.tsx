"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { AuthFlow } from "./components/auth-flow";
import { GuidelinesFlow } from "./components/guidelines-flow";
import { VerificationFlow } from "./components/verification-flow";
import { InterviewActiveFlow } from "./components/interview-active-flow";
import { InterviewCompleteFlow } from "./components/interview-complete-flow";
import { InterviewFlowState } from "./types/flow.types";
import { StartInterviewResponse } from "./interfaces/applicant-auth.interface";

export interface LiveKitConfig {
  token: string;
  serverUrl: string;
}

interface CallPageProps {
  interviewId: string;
}

export default function CallPage({ interviewId }: CallPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [flowState, setFlowState] = useState<InterviewFlowState>("auth");
  const [applicantName, setApplicantName] = useState("");
  const [companyName, setCompanyName] = useState("[company name]");
  const [liveKitConfig, setLiveKitConfig] = useState<LiveKitConfig | null>(
    null,
  );

  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("applicantAuthToken");
      if (token) {
        setIsAuthenticated(true);
        setFlowState("guidelines");
      }
    }
  }, []);

  // Start camera when entering verification flow
  useEffect(() => {
    const inVerification =
      flowState === "verification-ready" ||
      flowState === "verification-recording" ||
      flowState === "verification-completed";
    if (inVerification && !streamRef.current) {
      startCamera();
    }
  }, [flowState]);

  // Attach video stream when verification or interview is active
  useEffect(() => {
    const needsStream =
      flowState === "verification-ready" ||
      flowState === "verification-recording" ||
      flowState === "verification-completed" ||
      flowState === "interview-active";
    if (needsStream && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [flowState]);

  // Start recording when state changes to verification-recording
  useEffect(() => {
    if (flowState === "verification-recording" && !isRecording) {
      setIsRecording(true);
      setRecordingProgress(0);
    }
  }, [flowState, isRecording]);

  // Recording progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && flowState === "verification-recording") {
      interval = setInterval(() => {
        setRecordingProgress((prev) => {
          if (prev >= 100) {
            setIsRecording(false);
            setFlowState("verification-completed");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, flowState]);

  // Get camera access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error(
        "Failed to access camera/microphone. Please check permissions.",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleAuthenticated = (
    name: string,
    startInterviewResponse: StartInterviewResponse,
  ) => {
    setApplicantName(name);
    setLiveKitConfig({
      token: startInterviewResponse.token,
      serverUrl: startInterviewResponse.livekitUrl,
    });
    setIsAuthenticated(true);
    setFlowState("guidelines");
  };

  const handleVerificationRetry = () => {
    setRecordingProgress(0);
    setIsRecording(false);
    setFlowState("verification-ready");
  };

  const handleVerificationContinue = () => {
    setFlowState("interview-active");
  };

  // Render Authentication Screen
  if (!isAuthenticated && flowState === "auth") {
    return (
      <AuthFlow
        onAuthenticated={handleAuthenticated}
        interviewId={interviewId}
      />
    );
  }

  // Render Interview Guidelines Screen
  if (flowState === "guidelines") {
    return <GuidelinesFlow onStateChange={setFlowState} />;
  }

  // Render Voice & Video Verification (VerificationFlow)
  if (
    flowState === "verification-ready" ||
    flowState === "verification-recording" ||
    flowState === "verification-completed"
  ) {
    const verificationState =
      flowState === "verification-ready"
        ? "ready"
        : flowState === "verification-recording"
          ? "recording"
          : "completed";

    return (
      <VerificationFlow
        state={verificationState}
        onStateChange={setFlowState}
        onRetry={handleVerificationRetry}
        onContinue={handleVerificationContinue}
        videoRef={videoRef}
        recordingProgress={recordingProgress}
        applicantName={applicantName}
        companyName={companyName}
      />
    );
  }

  // Render Active Interview Screen
  if (flowState === "interview-active") {
    return (
      <InterviewActiveFlow
        onStateChange={setFlowState}
        onStopCamera={stopCamera}
        videoRef={videoRef}
        applicantName={applicantName}
        token={liveKitConfig?.token}
        serverUrl={liveKitConfig?.serverUrl}
      />
    );
  }

  // Render Interview Complete Screen
  if (flowState === "interview-complete") {
    return <InterviewCompleteFlow />;
  }

  return null;
}
