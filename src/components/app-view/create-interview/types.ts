export type InterviewSource = "existing" | "new";
export type QuestionsType = "ai" | "hybrid";

export interface InterviewFormData {
  // Step 1: Interview source
  interviewSource: InterviewSource;
  selectedJobId?: string;
  selectedRoundId?: string;

  // Step 2: New job details (if creating new job)
  jobTitle: string;
  domain: string;
  jobLevel: string;
  userType: string;
  minExperience: string;
  maxExperience: string;
  description: string;
  noOfOpenings: string;
  skills: string[];

  // Step 3: Round details
  roundName: string;
  roundType: string;
  objective: string;
  duration: string;
  language: string;
  interviewer: string;
  interviewerId?: string;
  roundSkills: string[];

  // Step 4: Questions type
  questionsType: QuestionsType;
  aiGeneratedQuestions: number;
  customQuestionsCount: number;

  // Step 5: Custom questions (if hybrid)
  customQuestions: string[];

  // Step 6: Instructions & settings
  instructions: string;
  allowSkip: boolean;
  sendReminder: boolean;
  reminderTime: string;
  enableRecording: boolean;
  enableTranscription: boolean;
  enableFeedback: boolean;

  // Generated interview link (created when interview is successfully created)
  interviewLink?: string;
}

export interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface Option {
  value: string;
  label: string;
}

export interface Job {
  id: string;
  title: string;
  domain: string;
}

export interface Interviewer {
  id: string;
  name: string;
  image: string;
}
