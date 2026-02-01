import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true; // null or undefined

  if (typeof value === "string") return value.trim().length === 0;

  if (Array.isArray(value)) return value.length === 0;

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value as object).length === 0;
  }

  return false;
}

export function buildUrl(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`Missing URL param: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (
  phone: string,
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
