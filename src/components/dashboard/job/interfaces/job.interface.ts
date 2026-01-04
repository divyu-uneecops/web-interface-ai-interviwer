import { ApplicantStatus } from "../types/job.types";

export interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // Callback after successful create/update
  mappingValues: Record<string, any[]>;
  isEditMode?: boolean; // If provided, modal will be in edit mode
  jobDetail?: JobFormData | null;
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
  duration: string;
  questions: number;
  applicants: number;
  created: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: ApplicantStatus;
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
  jobId: string;
  title: string;
  industry: string;
  jobLevel: string;
  jobType: string;
  minExp: number;
  maxExp: number;
  description: string;
  numOfOpenings: number;
  status: "active" | "draft" | "closed";
  accessibility: string;
  applicants: number;
  interviews: number;
  formUser: string;
  requiredSkills: string[];
  createdOn: string;
}
