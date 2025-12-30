/**
 * Authentication form validation utilities
 * Production-ready validation functions for login, signup, and verification forms
 */

import { ValidationError } from "../types/auth.types";

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
export const validatePhoneNumber = (phone: string): { isValid: boolean; digits: string; error?: string } => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/[\s\-\(\)\+\.]/g, "");
  
  // Check if it contains only digits and phone-like characters
  if (!/^[\d\s\-\(\)\+\.]+$/.test(phone) && phone.length > 0) {
    return { isValid: false, digits: digitsOnly, error: "Phone number must contain only numbers" };
  }
  
  // Phone number must be exactly 10 digits
  if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
    return { 
      isValid: false, 
      digits: digitsOnly, 
      error: digitsOnly.length > 10 
        ? "Phone number must be exactly 10 digits" 
        : "Phone number must be exactly 10 digits" 
    };
  }
  
  return { isValid: digitsOnly.length === 10, digits: digitsOnly };
};

/**
 * Validates email or phone number
 * Returns error message if invalid, undefined if valid
 */
export const validateEmailOrPhone = (value: string): string | undefined => {
  if (!value || value.trim().length === 0) {
    return "Email or phone number is required";
  }

  const trimmedValue = value.trim();
  
  // First check if it's a valid email - this takes priority
  if (isValidEmail(trimmedValue)) {
    return undefined; // Email is valid, no error
  }
  
  // Check if it's a phone number
  const phoneValidation = validatePhoneNumber(trimmedValue);
  if (phoneValidation.digits.length === 10 && phoneValidation.isValid) {
    return undefined; // Phone is valid
  }
  
  // If it contains @, it's attempting to be an email but is invalid
  if (trimmedValue.includes("@")) {
    const emailParts = trimmedValue.split("@");
    if (emailParts.length === 2) {
      const domainPart = emailParts[1];
      // If domain has a dot, it looks complete but invalid
      if (domainPart.includes(".")) {
        return "Please enter a valid email address";
      }
      // Has @ but no domain or incomplete domain
      return "Please enter a valid email address";
    }
    // Malformed email (multiple @)
    return "Please enter a valid email address";
  }
  
  // Check if it looks like a phone number (has digits)
  if (phoneValidation.digits.length > 0) {
    // If it has digits but not exactly 10, it's invalid
    if (phoneValidation.digits.length !== 10) {
      return phoneValidation.error || "Phone number must be exactly 10 digits";
    }
    // Has 10 digits but validation failed
    return phoneValidation.error || "Please enter a valid phone number";
  }
  
  // Neither email nor phone - show error
  return "Please enter a valid email address or phone number";
};

/**
 * Validates verification code (6 digits)
 */
export const validateVerificationCode = (code: string): string | undefined => {
  if (!code || code.trim().length === 0) {
    return "Verification code is required";
  }
  
  // Remove all non-digit characters
  const digitsOnly = code.replace(/\D/g, "");
  
  if (digitsOnly.length !== 6) {
    return "Verification code must be exactly 6 digits";
  }
  
  // Validate that digitsOnly contains only numbers (should always be true after replace, but double-check)
  if (!/^\d+$/.test(digitsOnly)) {
    return "Verification code must contain only numbers";
  }
  
  return undefined;
};

/**
 * Login form validation
 */
export const validateLoginForm = (values: { emailOrPhone: string; keepSignedIn?: boolean }): ValidationError => {
  const errors: ValidationError = {};
  
  const emailOrPhoneError = validateEmailOrPhone(values.emailOrPhone);
  if (emailOrPhoneError) {
    errors.emailOrPhone = emailOrPhoneError;
  }
  
  return errors;
};

/**
 * Verification form validation
 */
export const validateVerificationForm = (values: { verificationCode: string }): ValidationError => {
  const errors: ValidationError = {};
  
  const codeError = validateVerificationCode(values.verificationCode);
  if (codeError) {
    errors.verificationCode = codeError;
  }
  
  return errors;
};

