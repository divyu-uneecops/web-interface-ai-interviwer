/**
 * Authentication types and interfaces
 */

export interface ValidationError {
  [key: string]: string | undefined;
}

export interface LoginFormValues {
  emailOrPhone: string;
  keepSignedIn: boolean;
}

export interface VerificationFormValues {
  verificationCode: string;
}




