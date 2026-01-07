export interface CreateInterviewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: InterviewerFormData) => void;
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
