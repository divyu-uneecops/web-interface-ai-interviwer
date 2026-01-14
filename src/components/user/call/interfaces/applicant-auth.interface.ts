/**
 * Applicant authentication interfaces
 */

export interface ValidationError {
  [key: string]: string | undefined;
}

export interface ApplicantAuthFormValues {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
}

export interface ApplicantAuthRequest {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface ApplicantAuthResponse {
  success?: boolean;
  authenticated?: boolean;
  message?: string;
  token?: string;
  data?: {
    token?: string;
    interviewId?: string;
    applicantId?: string;
  };
}
