export interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: JobFormData) => void;
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
