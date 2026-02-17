export interface CreateInterviewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  mappingValues: Record<
    string,
    Record<
      string,
      { id?: string; name?: string; values: any[]; fields?: any[] }
    >
  >;
  views: Record<string, any>;
  form: Record<string, any>;
  isEditMode?: boolean;
  interviewerDetail?: InterviewerFormData | null;
  interviewerId?: string;
}

export interface InterviewerFormData {
  name: string;
  voice: string;
  description: string;
  skills: string[];
  roundType: string;
  language: string;
  avatar: string;
  personality: {
    empathy: number;
    rapport: number;
    exploration: number;
    speed: number;
  };
}

export interface Interviewer {
  id: string;
  name: string;
  description: string;
  avatar: string;
  roundType: string;
  interviewerSkills: string[];
  voice: string;
  language: string;
  personality: {
    empathy: number;
    rapport: number;
    exploration: number;
    speed: number;
  };
}

export interface InterviewerCardProps {
  interviewer: Interviewer;
  onEdit: () => void;
}

export interface APIInterviewerValue {
  propertyId: string;
  key: string;
  value: any;
}

export interface APIInterviewerItem {
  values: APIInterviewerValue[];
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

export interface InterviewersWithPagination {
  interviewers: Interviewer[];
  pagination: APIPaginationInfo;
}
