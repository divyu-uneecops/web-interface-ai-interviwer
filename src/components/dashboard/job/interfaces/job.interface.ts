import { ApplicantStatus } from "../types/job.types";

export interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface JobFormData {
  title: string;
  industry: string;
  jobLevel: string;
  jobType: string;
  minExperience: string;
  maxExperience: string;
  description: string;
  noOfOpenings: string;
  attachment: File | null;
  status: string;
  skills: string[];
}

export interface Job {
  id: string;
  position: string;
  status: "active" | "draft" | "closed";
  noOfOpening: number;
  applicants: number;
  interviews: number;
  created: string;
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
  jobs: Job[];
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
  status: "active" | "draft" | "closed";
  department: string;
  type: string;
  postedDate: string;
  description: string;
  skills: string[];
  jobLevel: string;
  userType: string;
  experience: string;
  salaryRange?: string;
  minExp?: number;
  maxExp?: number;
  numOfOpenings?: number;
  industry?: string;
  jobId?: string;
}
