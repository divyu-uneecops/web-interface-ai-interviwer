"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { AuthFlow } from "./components/auth-flow";
import { GuidelinesFlow } from "./components/guidelines-flow";
import { VerificationFlow } from "./components/verification-flow";
import { InterviewActiveFlow } from "./components/interview-active-flow";
import { InterviewCompleteFlow } from "./components/interview-complete-flow";
import { InterviewFlowState } from "./types/flow.types";
import {
  CallPageProps,
  LiveKitConfig,
  StartInterviewResponse,
} from "./interfaces/applicant-auth.interface";

export default function CallPage({ interviewId }: CallPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [flowState, setFlowState] = useState<InterviewFlowState>("auth");
  const [companyName, setCompanyName] = useState("[company name]");
  const [interviewDetails, setInterviewDetails] = useState<any>(null);
  const [liveKitConfig, setLiveKitConfig] = useState<LiveKitConfig | null>(
    null
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [screenShareError, setScreenShareError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    // if (typeof window !== "undefined") {
    const token = localStorage.getItem("applicantAuthToken");
    if (token) {
      setIsAuthenticated(true);
      setFlowState("guidelines");
    }
    // }
  }, []);

  // Start camera and screen share when entering verification flow
  useEffect(() => {
    if (flowState === "verification") {
      if (!streamRef.current) startCamera();
      if (!screenShareStreamRef.current) startScreenShare();
    }
  }, [flowState]);

  // Attach video stream when verification or interview is active
  useEffect(() => {
    const needsStream =
      flowState === "verification" || flowState === "interview-active";
    if (needsStream && streamRef?.current && videoRef?.current) {
      if (videoRef?.current?.srcObject !== streamRef?.current) {
        videoRef.current.srcObject = streamRef?.current;
        videoRef?.current?.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [flowState]);

  // Get camera access
  const startCamera = async () => {
    try {
      const stream = await navigator?.mediaDevices?.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error(
        "Failed to access camera/microphone. Please check permissions."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef?.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef?.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startScreenShare = async () => {
    setScreenShareError(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      screenShareStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenShareStreamRef.current = stream;
      setScreenShareActive(true);
      if (screenShareVideoRef?.current) {
        screenShareVideoRef.current.srcObject = stream;
        screenShareVideoRef.current.play().catch((err) => {
          console.error("Screen share video play:", err);
        });
      }
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      setScreenShareError(
        err instanceof Error ? err.message : "Failed to share screen"
      );
    }
  };

  const stopScreenShare = () => {
    if (screenShareStreamRef?.current) {
      screenShareStreamRef.current.getTracks().forEach((t) => t.stop());
      screenShareStreamRef.current = null;
    }
    if (screenShareVideoRef?.current) {
      screenShareVideoRef.current.srcObject = null;
    }
    setScreenShareActive(false);
    setScreenShareError(null);
  };

  // Stop screen share when interview ends
  useEffect(() => {
    if (flowState === "interview-complete") {
      if (document?.fullscreenElement) {
        document
          ?.exitFullscreen()
          ?.catch((err) => console.error("Exit fullscreen error:", err));
      }
      stopScreenShare();
      stopCamera();
    }
  }, [flowState]);

  const handleAuthenticated = (
    startInterviewResponse: StartInterviewResponse
  ) => {
    setLiveKitConfig({
      token: startInterviewResponse?.token,
      serverUrl: startInterviewResponse?.livekitUrl,
    });
    setInterviewDetails(startInterviewResponse?.interview_data);
    setIsAuthenticated(true);
    setFlowState("guidelines");
  };

  const handleVerificationContinue = () => {
    if (!document.fullscreenElement) {
      document?.documentElement
        ?.requestFullscreen()
        ?.catch((err) => console.error("Auto fullscreen error:", err));
    }

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
    return (
      <GuidelinesFlow
        onStateChange={setFlowState}
        interviewDetails={interviewDetails}
      />
    );
  }

  // Render Voice & Video Verification (VerificationFlow)
  if (flowState === "verification") {
    return (
      <VerificationFlow
        onContinue={handleVerificationContinue}
        videoRef={videoRef}
        screenShareActive={screenShareActive}
        screenShareError={screenShareError}
        onRetryScreenShare={startScreenShare}
      />
    );
  }

  // Render Active Interview Screen
  if (flowState === "interview-active") {
    return (
      <InterviewActiveFlow
        onStateChange={setFlowState}
        videoRef={videoRef}
        interviewDetails={interviewDetails}
        interviewId={interviewId}
        token={liveKitConfig?.token}
        serverUrl={liveKitConfig?.serverUrl}
        screenShareVideoRef={screenShareVideoRef}
        screenShareStreamRef={screenShareStreamRef}
      />
    );
  }

  // Render Interview Complete Screen
  if (flowState === "interview-complete") {
    return <InterviewCompleteFlow interviewId={interviewId} />;
  }

  return null;
}
