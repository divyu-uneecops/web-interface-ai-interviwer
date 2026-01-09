import { RoundFormData } from "../../create-round-modal";

// Map language code to API format (e.g., "en" -> "en-GB")
const mapLanguageToAPI = (language: string): string => {
  const languageMap: Record<string, string> = {
    en: "en-GB",
    hi: "hi-IN",
    es: "es-ES",
    fr: "fr-FR",
  };
  return languageMap[language] || "en-GB";
};

// Map duration value to API format (e.g., "30" -> "30 min")
const mapDurationToAPI = (duration: string): string => {
  return `${duration} min`;
};

// Map question type to API format
const mapQuestionTypeToAPI = (
  questionType: "ai" | "hybrid" | "custom"
): string => {
  const typeMap: Record<string, string> = {
    ai: "AI Generated",
    hybrid: "Hybrid",
    custom: "Custom",
  };
  return typeMap[questionType] || "AI Generated";
};

// Map reminder time value to readable format
const mapReminderTimeToAPI = (reminderTime: string): string => {
  const timeMap: Record<string, string> = {
    "15": "15 minutes before",
    "30": "30 minutes before",
    "60": "1 hour before",
    "120": "2 hours before",
    "1440": "1 day before",
    "2880": "2 days",
  };
  return timeMap[reminderTime] || "30 minutes before";
};

// Map round type to API format (capitalize first letter)
const mapRoundTypeToAPI = (roundType: string): string => {
  if (!roundType) return "";
  return roundType.charAt(0).toUpperCase() + roundType.slice(1);
};

export const transformToAPIPayload = (
  values: RoundFormData,
  jobId?: string
) => {
  // Generate roundId if not provided
  const roundId = Math.floor(Math.random() * 1000) + 100;

  // Transform skills to API format
  const skillsForRound = values.skills.map((skill) => [
    {
      propertyId: "69525c30c9ba83a076aac44b",
      key: "skill",
      value: skill,
    },
  ]);

  // Transform questions array
  const questions: any[] = [];

  // Add AI generated questions
  if (values.questionType === "ai" || values.questionType === "hybrid") {
    for (let i = 0; i < values.aiGeneratedQuestions; i++) {
      questions.push([
        {
          propertyId: "69525d19c9ba83a076aac44f",
          key: "question",
          value: `AI Generated Question ${i + 1}`,
        },
        {
          propertyId: "69525d77c9ba83a076aac450",
          key: "qType",
          value: "ai",
        },
      ]);
    }
  }

  // Add custom questions
  if (values.questionType === "hybrid" || values.questionType === "custom") {
    values.customQuestionTexts.forEach((questionText, index) => {
      if (questionText.trim()) {
        questions.push([
          {
            propertyId: "69525d19c9ba83a076aac44f",
            key: "question",
            value: questionText,
          },
          {
            propertyId: "69525d77c9ba83a076aac450",
            key: "qType",
            value: "custom",
          },
        ]);
      }
    });
  }

  const valuesArray = [
    {
      propertyId: "69525a07c9ba83a076aac437",
      key: "roundId",
      value: String(roundId),
    },
    {
      propertyId: "69525a38c9ba83a076aac439",
      key: "jobId",
      value: jobId || "69536c2fc9ba83a076aac4bf", // TODO: Get from props or context
    },
    {
      propertyId: "69525a60c9ba83a076aac43b",
      key: "interviewerId",
      value: values.interviewer || "",
    },
    {
      propertyId: "69525a92c9ba83a076aac43d",
      key: "roundName",
      value: values.roundName,
    },
    {
      propertyId: "69525ad1c9ba83a076aac43f",
      key: "roundType",
      value: mapRoundTypeToAPI(values.roundType),
    },
    {
      propertyId: "69525aefc9ba83a076aac440",
      key: "roundObjective",
      value: values.roundObjective,
    },
    {
      propertyId: "69525b69c9ba83a076aac443",
      key: "language",
      value: mapLanguageToAPI(values.language),
    },
    {
      propertyId: "69525bb8c9ba83a076aac448",
      key: "duration",
      value: mapDurationToAPI(values.duration),
    },
    {
      propertyId: "69525bf5c9ba83a076aac449",
      key: "accessLink",
      value: "", // TODO: Generate or get from backend
    },
    {
      propertyId: "69525c1cc9ba83a076aac44a",
      key: "accessibility",
      value: "Public", // TODO: Get from form or context
    },
    {
      propertyId: "69525c5ac9ba83a076aac44c",
      key: "skillsForRound",
      value: skillsForRound,
    },
    {
      propertyId: "69525c85c9ba83a076aac44d",
      key: "questionsType",
      value: mapQuestionTypeToAPI(values.questionType),
    },
    {
      propertyId: "69525ca7c9ba83a076aac44e",
      key: "numOfAiQuestions",
      value:
        values.questionType === "ai" || values.questionType === "hybrid"
          ? values.aiGeneratedQuestions
          : 0,
    },
    {
      propertyId: "69525dbbc9ba83a076aac453",
      key: "questions",
      value: questions,
    },
    {
      propertyId: "69525dd4c9ba83a076aac454",
      key: "interviewInstructions",
      value: values.interviewInstructions,
    },
    {
      propertyId: "69525e47c9ba83a076aac457",
      key: "reminderTime",
      value: values.sendReminder
        ? mapReminderTimeToAPI(values.reminderTime)
        : "",
    },
    {
      propertyId: "69525e6bc9ba83a076aac458",
      key: "numOfCustomQuestions",
      value:
        values.questionType === "hybrid" || values.questionType === "custom"
          ? values.customQuestions
          : 0,
    },
    {
      propertyId: "69576660c9ba83a076aac596",
      key: "formUser",
      value: ["6938f9fb2276e3fc3ac7b328"], // TODO: Get from auth context
    },
  ];

  return {
    values: valuesArray,
    propertyIds: [
      "69525a07c9ba83a076aac437",
      "69525a38c9ba83a076aac439",
      "69525a60c9ba83a076aac43b",
      "69525a92c9ba83a076aac43d",
      "69525ad1c9ba83a076aac43f",
      "69525aefc9ba83a076aac440",
      "69525b69c9ba83a076aac443",
      "69525bb8c9ba83a076aac448",
      "69525bf5c9ba83a076aac449",
      "69525c1cc9ba83a076aac44a",
      "69525c5ac9ba83a076aac44c",
      "69525c85c9ba83a076aac44d",
      "69525ca7c9ba83a076aac44e",
      "69525dbbc9ba83a076aac453",
      "69525dd4c9ba83a076aac454",
      "69525decc9ba83a076aac455",
      "69525e05c9ba83a076aac456",
      "69525e47c9ba83a076aac457",
      "69525e6bc9ba83a076aac458",
      "69576660c9ba83a076aac596",
    ],
    flows: [
      {
        stageId: "1",
        status: "PENDING",
      },
    ],
    status: "PENDING",
    formId: "69521d61c9ba83a076aac3c3",
  };
};

export const validate = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (!values.roundName || values.roundName.trim() === "") {
    errors.roundName = "Round name is required";
  }

  if (!values.roundType) {
    errors.roundType = "Round type is required";
  }

  if (!values.roundObjective || values.roundObjective.trim() === "") {
    errors.roundObjective = "Round objective is required";
  }

  if (!values.duration) {
    errors.duration = "Duration is required";
  }

  if (!values.language) {
    errors.language = "Language is required";
  }

  if (values.skills.length === 0) {
    errors.skills = "At least one skill is required";
  }

  if (
    !values.interviewInstructions ||
    values.interviewInstructions.trim() === ""
  ) {
    errors.interviewInstructions = "Interview instructions are required";
  }

  if (
    values.questionType === "ai" &&
    (!values.aiGeneratedQuestions || values.aiGeneratedQuestions < 1)
  ) {
    errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
  }

  if (values.questionType === "hybrid") {
    if (!values.aiGeneratedQuestions || values.aiGeneratedQuestions < 1) {
      errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
    }
    if (!values.customQuestions || values.customQuestions < 1) {
      errors.customQuestions = "Number of custom questions must be at least 1";
    }
    // Validate custom question texts
    const emptyQuestions = values.customQuestionTexts.filter(
      (q) => !q || q.trim() === ""
    );
    if (emptyQuestions.length > 0) {
      errors.customQuestionTexts = "All custom questions must be filled";
    }
  }

  if (values.questionType === "custom") {
    if (!values.customQuestions || values.customQuestions < 1) {
      errors.customQuestions = "Number of custom questions must be at least 1";
    }
    // Validate custom question texts
    const emptyQuestions = values.customQuestionTexts.filter(
      (q) => !q || q.trim() === ""
    );
    if (emptyQuestions.length > 0) {
      errors.customQuestionTexts = "All custom questions must be filled";
    }
  }

  return errors;
};

// Validate step 1 fields
export const validateStep1 = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (!values.roundName || values.roundName.trim() === "") {
    errors.roundName = "Round name is required";
  }

  if (!values.roundType) {
    errors.roundType = "Round type is required";
  }

  if (!values.roundObjective || values.roundObjective.trim() === "") {
    errors.roundObjective = "Round objective is required";
  }

  if (!values.duration) {
    errors.duration = "Duration is required";
  }

  if (!values.language) {
    errors.language = "Language is required";
  }

  if (values.skills.length === 0) {
    errors.skills = "At least one skill is required";
  }

  return errors;
};

// Validate step 2 fields
export const validateStep2 = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (
    values.questionType === "ai" &&
    (!values.aiGeneratedQuestions || values.aiGeneratedQuestions < 1)
  ) {
    errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
  }

  if (values.questionType === "hybrid") {
    if (!values.aiGeneratedQuestions || values.aiGeneratedQuestions < 1) {
      errors.aiGeneratedQuestions = "Number of AI questions must be at least 1";
    }
    if (!values.customQuestions || values.customQuestions < 1) {
      errors.customQuestions = "Number of custom questions must be at least 1";
    }
    // Validate custom question texts
    const emptyQuestions = values.customQuestionTexts.filter(
      (q) => !q || q.trim() === ""
    );
    if (emptyQuestions.length > 0) {
      errors.customQuestionTexts = "All custom questions must be filled";
    }
  }

  if (values.questionType === "custom") {
    if (!values.customQuestions || values.customQuestions < 1) {
      errors.customQuestions = "Number of custom questions must be at least 1";
    }
    // Validate custom question texts
    const emptyQuestions = values.customQuestionTexts.filter(
      (q) => !q || q.trim() === ""
    );
    if (emptyQuestions.length > 0) {
      errors.customQuestionTexts = "All custom questions must be filled";
    }
  }

  return errors;
};

// Validate step 3 fields
export const validateStep3 = (values: RoundFormData) => {
  const errors: Partial<Record<keyof RoundFormData, string>> = {};

  if (
    !values.interviewInstructions ||
    values.interviewInstructions.trim() === ""
  ) {
    errors.interviewInstructions = "Interview instructions are required";
  }

  return errors;
};

// Check if a specific step is valid
export const isStepValid = (
  step: 1 | 2 | 3,
  values: RoundFormData
): boolean => {
  let stepErrors: Partial<Record<keyof RoundFormData, string>> = {};

  switch (step) {
    case 1:
      stepErrors = validateStep1(values);
      break;
    case 2:
      stepErrors = validateStep2(values);
      break;
    case 3:
      stepErrors = validateStep3(values);
      break;
  }

  return Object.keys(stepErrors).length === 0;
};
