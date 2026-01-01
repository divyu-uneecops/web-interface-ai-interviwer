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
