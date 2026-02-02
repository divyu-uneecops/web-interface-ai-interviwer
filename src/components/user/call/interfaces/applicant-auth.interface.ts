import { InterviewFlowState } from "../types/flow.types";

export interface ValidationError {
  [key: string]: string | undefined;
}

export interface ApplicantAuthFormValues {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
}

export interface StartInterviewResponse {
  success: boolean;
  token: string;
  room: string;
  livekitUrl: string;
  identity: string;
  interview_data: any;
  transcriptRecordId?: string;
}

export interface StartInterviewPayload {
  email: string;
  interviewId: string;
}

export interface LiveKitConfig {
  token: string;
  serverUrl: string;
}

export interface CallPageProps {
  interviewId: string;
}

export interface AuthFlowProps {
  onAuthenticated: (startInterviewResponse: StartInterviewResponse) => void;
  interviewId?: string;
}

export interface GuidelinesFlowProps {
  onStateChange: (state: InterviewFlowState) => void;
  interviewDetails: any;
}
