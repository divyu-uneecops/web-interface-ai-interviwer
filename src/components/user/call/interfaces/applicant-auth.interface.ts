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
