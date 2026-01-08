export type InterviewStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "pending";

export interface InterviewDetail {
  id: string;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  jobId: string;
  interviewerName: string;
  interviewerId: string;
  status: InterviewStatus;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  roundName: string;
  roundId: string;
  score?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  interviewLink?: string;
  token?: string;
}

export interface InterviewStat {
  label: string;
  value: string | number;
  icon: "total" | "scheduled" | "completed" | "score";
}

export interface APIInterviewValue {
  propertyId: string;
  key: string;
  value: any;
}

export interface APIInterviewItem {
  values: APIInterviewValue[];
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

export interface InterviewsWithPagination {
  interviews: InterviewDetail[];
  pagination: APIPaginationInfo;
}

export interface InterviewFormData {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  roundId: string;
  interviewerId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  instructions?: string;
}
