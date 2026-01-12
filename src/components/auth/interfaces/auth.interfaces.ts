/**
 * Authentication types and interfaces
 */

export interface ValidationError {
  [key: string]: string | undefined;
}

export interface LoginFormValues {
  emailOrPhone: string;
}

export interface VerificationFormValues {
  verificationCode: string;
}

export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  designation: string;
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
}
