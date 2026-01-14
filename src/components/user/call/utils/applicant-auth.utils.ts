/**
 * Applicant authentication form validation utilities
 */

import { ValidationError } from "../interfaces/applicant-auth.interface";

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format and extracts digits
 */
export const validatePhoneNumber = (
  phone: string
): { isValid: boolean; digits: string; error?: string } => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/[\s\-\(\)\+\.]/g, "");

  // Check if it contains only digits and phone-like characters
  if (!/^[\d\s\-\(\)\+\.]+$/.test(phone) && phone.length > 0) {
    return {
      isValid: false,
      digits: digitsOnly,
      error: "Phone number must contain only numbers",
    };
  }

  // Phone number must be exactly 10 digits
  if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
    return {
      isValid: false,
      digits: digitsOnly,
      error:
        digitsOnly.length > 10
          ? "Phone number must be exactly 10 digits"
          : "Phone number must be exactly 10 digits",
    };
  }

  return { isValid: digitsOnly.length === 10, digits: digitsOnly };
};

/**
 * Applicant authentication form validation
 */
export const validateApplicantAuthForm = (values: {
  fullName: string;
  email: string;
  phone: string;
}): ValidationError => {
  const errors: ValidationError = {};

  // Full name validation
  if (!values.fullName || values.fullName.trim().length === 0) {
    errors.fullName = "Full name is required";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  // Email validation
  if (!values.email || values.email.trim().length === 0) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  // Phone validation
  if (!values.phone || values.phone.trim().length === 0) {
    errors.phone = "Phone number is required";
  } else {
    const phoneValidation = validatePhoneNumber(values.phone);
    if (!phoneValidation.isValid) {
      errors.phone =
        phoneValidation.error || "Phone number must be exactly 10 digits";
    }
  }

  return errors;
};
