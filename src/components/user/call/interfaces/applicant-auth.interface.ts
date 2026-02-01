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
  onAuthenticated: (
    name: string,
    startInterviewResponse: StartInterviewResponse,
  ) => void;
  interviewId?: string;
}
