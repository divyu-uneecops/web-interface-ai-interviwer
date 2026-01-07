export interface CreateInterviewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: InterviewerFormData) => void;
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
  imageUrl: string;
  roundType: string;
}

export interface InterviewerCardProps {
  interviewer: Interviewer;
  onEdit?: (id: string) => void;
}
