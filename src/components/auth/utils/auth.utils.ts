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

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim().length === 0) {
    return true; // URL is optional
  }
  
  try {
    // Add protocol if missing
    let urlToTest = url.trim();
    if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
      urlToTest = `https://${urlToTest}`;
    }
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
};

/**
 * Signup form validation
 */
export const validateSignupForm = (values: {
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
}): ValidationError => {
  const errors: ValidationError = {};
  
  // First name validation
  if (!values.firstName || values.firstName.trim().length === 0) {
    errors.firstName = "First name is required";
  } else if (values.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }
  
  // Last name validation (optional)
  if (values.lastName && values.lastName.trim().length > 0 && values.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
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
      errors.phone = phoneValidation.error || "Phone number must be exactly 10 digits";
    }
  }
  
  // Designation validation
  if (!values.designation || values.designation.trim().length === 0) {
    errors.designation = "Designation is required";
  }
  
  // Company name validation
  if (!values.companyName || values.companyName.trim().length === 0) {
    errors.companyName = "Organisation name is required";
  } else if (values.companyName.trim().length < 2) {
    errors.companyName = "Organisation name must be at least 2 characters";
  }
  
  // Website validation (required)
  if (!values.website || values.website.trim().length === 0) {
    errors.website = "Organisation website is required";
  } else if (!isValidUrl(values.website.trim())) {
    errors.website = "Please enter a valid website URL";
  }
  
  // Industry validation
  if (!values.industry || values.industry.trim().length === 0) {
    errors.industry = "Industry is required";
  }
  
  // Company size validation
  if (!values.companySize || values.companySize.trim().length === 0) {
    errors.companySize = "Organisation size is required";
  }
  
  return errors;
};

