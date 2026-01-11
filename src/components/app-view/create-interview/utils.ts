import type { InterviewFormData } from "./types";
import { generateInterviewLink } from "./constants";

export const createInitialFormData = (): InterviewFormData => ({
  interviewSource: "existing",
  selectedJobId: undefined,
  selectedRoundId: undefined,
  jobTitle: "",
  domain: "",
  jobLevel: "",
  userType: "",
  minExperience: "",
  maxExperience: "",
  description: "",
  noOfOpenings: "",
  skills: [],
  roundName: "",
  roundType: "",
  objective: "",
  duration: "",
  language: "",
  interviewer: "",
  interviewerId: "",
  roundSkills: [],
  questionsType: "ai",
  aiGeneratedQuestions: 5,
  customQuestionsCount: 0,
  customQuestions: [],
  instructions: "",
  allowSkip: false,
  sendReminder: false,
  reminderTime: "15",
  enableRecording: true,
  enableTranscription: true,
  enableFeedback: true,
  interviewLink: undefined,
});

export const validateStep = (
  step: number,
  formData: InterviewFormData
): boolean => {
  switch (step) {
    case 1:
      return true;

    case 2:
      if (formData.interviewSource === "existing") {
        return !!(formData.selectedJobId && formData.selectedRoundId);
      }
      return !!(
        formData.jobTitle &&
        formData.domain &&
        formData.jobLevel &&
        formData.userType &&
        formData.minExperience &&
        formData.maxExperience &&
        formData.description &&
        formData.noOfOpenings &&
        formData.skills.length > 0
      );

    case 3:
      if (formData.interviewSource === "existing") {
        return !!(
          formData.duration &&
          formData.language &&
          formData.interviewerId
        );
      }
      return !!(
        formData.roundName &&
        formData.roundType &&
        formData.objective &&
        formData.duration &&
        formData.language &&
        formData.interviewerId &&
        formData.roundSkills.length > 0
      );

    case 4:
      if (formData.questionsType === "ai") {
        return formData.aiGeneratedQuestions > 0;
      }
      if (formData.questionsType === "hybrid") {
        return (
          formData.aiGeneratedQuestions > 0 &&
          formData.customQuestionsCount > 0 &&
          formData.customQuestions.every((q) => q.trim().length > 0)
        );
      }
      return false;

    case 5:
      return !!(
        formData.instructions &&
        (!formData.sendReminder || formData.reminderTime)
      );

    default:
      return false;
  }
};

export const getStepTitle = (
  step: number,
  interviewSource: InterviewFormData["interviewSource"]
): string => {
  switch (step) {
    case 1:
      return "Create interview";
    case 2:
      return interviewSource === "existing"
        ? "Create interview"
        : "Create new job opening";
    case 3:
      return interviewSource === "existing"
        ? "Create interview"
        : "Create new round";
    case 4:
      return interviewSource === "existing"
        ? "Create interview"
        : "Create new round";
    case 5:
      return "Create new round";
    default:
      return "Create interview";
  }
};

export const getStepDescription = (
  step: number,
  interviewSource: InterviewFormData["interviewSource"]
): string => {
  switch (step) {
    case 1:
      return "";
    case 2:
      return interviewSource === "existing" ? "" : "Add job details";
    case 3:
      return interviewSource === "existing"
        ? "Configure interview settings"
        : "Add round details";
    case 4:
      return "Select questions type";
    case 5:
      return "Add instructions and settings";
    default:
      return "";
  }
};

export const calculateNextStep = (
  currentStep: number,
  interviewSource: InterviewFormData["interviewSource"]
): number => {
  return currentStep + 1;
};

export const calculatePreviousStep = (
  currentStep: number,
  interviewSource: InterviewFormData["interviewSource"]
): number => {
  return currentStep - 1;
};
