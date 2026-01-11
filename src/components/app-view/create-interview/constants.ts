/**
 * Constants for the interview creation flow
 */

import type { Option, Job, Interviewer } from "./types";

export const COPY_FEEDBACK_DURATION_MS = 2000;

export const INTERVIEW_LINK_BASE_URL = "https://yourcompany.com/interview";

export const TOTAL_STEPS = 5;

/**
 * Generate a unique interview link
 */
export const generateInterviewLink = (): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${INTERVIEW_LINK_BASE_URL}/INT-${timestamp}-${randomSuffix}`;
};

// Form option constants
export const DOMAIN_OPTIONS: Option[] = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

export const JOB_LEVEL_OPTIONS: Option[] = [
  { value: "intern", label: "Intern" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

export const USER_TYPE_OPTIONS: Option[] = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export const ROUND_TYPE_OPTIONS: Option[] = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "screening", label: "Screening" },
  { value: "final", label: "Final Round" },
];

export const DURATION_OPTIONS: Option[] = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

export const LANGUAGE_OPTIONS: Option[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

export const REMINDER_TIME_OPTIONS: Option[] = [
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "1440", label: "1 day before" },
  { value: "2880", label: "2 days before" },
];

export const AI_QUESTION_COUNTS: number[] = [3, 5, 7, 10, 15];

export const CUSTOM_QUESTION_COUNTS: number[] = [1, 2, 3, 4, 5];

// Mock data constants
export const MOCK_EXISTING_JOBS: Job[] = [
  { id: "1", title: "Senior Product Manager", domain: "product" },
  { id: "2", title: "Frontend Developer", domain: "engineering" },
  { id: "3", title: "UX Designer", domain: "design" },
  { id: "4", title: "Marketing Manager", domain: "marketing" },
];

export const MOCK_ROUNDS: Option[] = [
  { value: "round1", label: "Technical Round" },
  { value: "round2", label: "Behavioral Round" },
  { value: "round3", label: "Final Round" },
];

export const MOCK_INTERVIEWERS: Interviewer[] = [
  { id: "1", name: "Product Manager", image: "/interviewer-male.jpg" },
  { id: "2", name: "HR Manager", image: "/interviewer-female.jpg" },
  { id: "3", name: "UX Designer", image: "/interviewer-male.jpg" },
  { id: "4", name: "Sales", image: "/interviewer-female.jpg" },
  { id: "5", name: "Marketing", image: "/interviewer-male.jpg" },
  { id: "6", name: "Software Engineer", image: "/interviewer-female.jpg" },
];
