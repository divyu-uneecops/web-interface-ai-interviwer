import { ApplicantStatus } from "../types/job.types";

export interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // Callback after successful create/update
  mappingValues: Record<string, Record<string, any[]>>;
  isEditMode?: boolean; // If provided, modal will be in edit mode
  jobDetail?: JobFormData | null;
  jobId?: string;
}

export interface JobFormData {
  title: string;
  industry: string;
  jobLevel: string;
  jobType: string;
  minExperience: number | null;
  maxExperience: number | null;
  description: string;
  noOfOpenings: number | null;
  attachment: File | null;
  status: string;
  skills: string[];
}

export interface JobStat {
  label: string;
  value: string | number;
  icon: "applicants" | "completed" | "hired" | "score";
}

export interface Round {
  id: string;
  name: string;
  type: string;
  objective: string;
  language: string;
  interviewer: string;
  skills: string[];
  questionType: string;
  aiGeneratedQuestions: number;
  customQuestions: number;
  customQuestionTexts: string[];
  interviewInstructions: string;
  allowSkip: boolean;
  sendReminder: boolean;
  reminderTime: string;
  duration: string;
  applicants: number;
  totalQuestions: number;
  interviewerID: string;
  created: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: ApplicantStatus;
  attachment: string;
  appliedDate: string;
}

export interface APIJobValue {
  propertyId: string;
  key: string;
  value: any;
}

export interface APIJobItem {
  values: APIJobValue[];
  createdOn: number;
  updatedOn: number;
  id: string;
}

export interface APIPaginationInfo {
  total: number;
  nextOffset: number | null;
  previousOffset: number | null;
  limit: number;
}

export interface JobsWithPagination {
  jobs: JobDetail[];
  pagination: APIPaginationInfo;
}

export interface APIJobDetailField {
  key: string;
  value: any;
  type: string;
  fields?: APIJobDetailField[];
}

export interface APIJobDetailSection {
  section: string;
  fields: APIJobDetailField[];
}

export interface JobDetail {
  id: string;
  title: string;
  industry: string;
  jobLevel: string;
  jobType: string;
  minExp: number;
  maxExp: number;
  description: string;
  numOfOpenings: number;
  status: "Active" | "Draft" | "Closed";
  accessibility: string;
  applicants: number;
  interviews: number;
  requiredSkills: string[];
  createdOn: string;
}

export interface ApplicantForm {
  name: string;
  email: string;
  contact: string;
  attachment: File | string | null;
}

export interface AddApplicantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobInfo: {
    jobId: string;
    jobTitle: string;
  };
  onSubmit: () => void;
  isEditMode?: boolean;
  applicantDetail?: ApplicantForm | null;
  applicantId?: string;
}
