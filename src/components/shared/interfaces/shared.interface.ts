export interface FilterGroup {
  id: string;
  label: string;
  /** When type is 'text', renders a text search input; otherwise renders option checkboxes. */
  type?: "select" | "text";
  /** For type 'text', placeholder for the input. */
  placeholder?: string;
  options: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  [key: string]: string[] | string;
}

export interface FilterDropdownProps {
  filterGroups: FilterGroup[];
  onApplyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
  buttonLabel?: string;
  buttonClassName?: string;
  contentClassName?: string;
}

export interface CreateRoundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  mappingValues: Record<string, Record<string, any[]>>;
  jobId: string;
  isEditMode?: boolean;
  roundDetail?: RoundFormData | null;
  roundId?: string;
  form: Record<string, any>;
  views: Record<string, any>;
}

export interface RoundFormData {
  roundName: string;
  roundType: string;
  roundObjective: string;
  duration: string;
  language: string;
  interviewer: string;
  skills: string[];
  questionType: "ai" | "hybrid";
  aiGeneratedQuestions: number;
  customQuestions: number;
  customQuestionTexts: string[];
  interviewInstructions: string;
  allowSkip: boolean;
  sendReminder: boolean;
  reminderTime: string;
}
