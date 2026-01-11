import { RoundFormData } from "../interfaces/shared.interface";

export const transformToCreateRoundPayload = (
  values: RoundFormData,
  jobId: string
) => {
  // Skills for round (each as its own array of one object)
  const skillsForRound = (values?.skills || []).map((skill) => [
    {
      propertyId: "69627d06c9ba83a076aac8f8",
      key: "_skill_",
      value: skill,
    },
  ]);

  // Questions (each as its own array of two objects)
  const questions: any[] =
    values?.customQuestionTexts && Array.isArray(values?.customQuestionTexts)
      ? values?.customQuestionTexts
          .map((questionText, idx) => {
            if (
              values?.questionType === "hybrid" &&
              typeof questionText === "string" &&
              questionText.trim() !== ""
            ) {
              return [
                {
                  propertyId: "69627d97c9ba83a076aac8fa",
                  key: "_question",
                  value: questionText,
                },
                {
                  propertyId: "69627dcdc9ba83a076aac8fb",
                  key: "_qType",
                  value: "hybrid",
                },
              ];
            }
            return null;
          })
          .filter(Boolean)
      : [];

  // Main values array (follows order and structure from example JSON)
  const valuesArray = [
    {
      propertyId: "69525a92c9ba83a076aac43d",
      key: "roundName",
      value: values?.roundName || "",
    },
    {
      propertyId: "69525ad1c9ba83a076aac43f",
      key: "roundType",
      value: values?.roundType || "",
    },
    {
      propertyId: "69525aefc9ba83a076aac440",
      key: "roundObjective",
      value: values?.roundObjective || "",
    },
    {
      propertyId: "69525b69c9ba83a076aac443",
      key: "language",
      value: values?.language || "",
    },
    {
      propertyId: "69525bb8c9ba83a076aac448",
      key: "duration",
      value: values?.duration || "",
    },
    {
      propertyId: "69525c1cc9ba83a076aac44a",
      key: "accessibility",
      value: "Private", // TODO: Needs to Change in future
    },
    {
      propertyId: "69525c85c9ba83a076aac44d",
      key: "questionsType",
      value: values?.questionType || "",
    },
    {
      propertyId: "69525ca7c9ba83a076aac44e",
      key: "numOfAiQuestions",
      value: values?.aiGeneratedQuestions,
    },
    {
      propertyId: "69525dd4c9ba83a076aac454",
      key: "interviewInstructions",
      value: values?.interviewInstructions || "",
    },
    {
      propertyId: "69525decc9ba83a076aac455",
      key: "allowSkip",
      value: values?.allowSkip,
    },
    {
      propertyId: "69525e05c9ba83a076aac456",
      key: "sendReminder",
      value: values?.sendReminder,
    },
    {
      propertyId: "69576660c9ba83a076aac596",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"], // Replace with actual user id if needed
    },
    {
      propertyId: "6960b827c9ba83a076aac89b",
      key: "jobName",
      value: jobId || "",
    },
    {
      propertyId: "6960b94ec9ba83a076aac89c",
      key: "interviewerName",
      value: "695f4c61c9ba83a076aac7de", // Replace with actual interviewer name if needed
    },
    {
      propertyId: "69626f4dc9ba83a076aac8f2",
      key: "jobID",
      value: jobId || "",
    },
    {
      propertyId: "69626f8fc9ba83a076aac8f3",
      key: "interviewerID",
      value: "695f4c61c9ba83a076aac7de", // Replace as needed
    },
    {
      propertyId: "69627d2ec9ba83a076aac8f9",
      key: "_skillForRound",
      value: skillsForRound,
    },
    {
      propertyId: "69627df8c9ba83a076aac8fc",
      key: "_questions",
      value: questions,
    },
  ];

  const propertyIds = [
    "69525a07c9ba83a076aac437",
    "69525a92c9ba83a076aac43d",
    "69525ad1c9ba83a076aac43f",
    "69525aefc9ba83a076aac440",
    "69525b69c9ba83a076aac443",
    "69525bb8c9ba83a076aac448",
    "69525bf5c9ba83a076aac449",
    "69525c1cc9ba83a076aac44a",
    "69525c85c9ba83a076aac44d",
    "69525ca7c9ba83a076aac44e",
    "69525dd4c9ba83a076aac454",
    "69525decc9ba83a076aac455",
    "69525e05c9ba83a076aac456",
    "69576660c9ba83a076aac596",
    "6960b827c9ba83a076aac89b",
    "6960b94ec9ba83a076aac89c",
    "69626f4dc9ba83a076aac8f2",
    "69626f8fc9ba83a076aac8f3",
    "69627d2ec9ba83a076aac8f9",
    "69627df8c9ba83a076aac8fc",
    "69525e6bc9ba83a076aac458",
    "69525e47c9ba83a076aac457",
  ];

  if (values?.sendReminder) {
    valuesArray.push({
      propertyId: "69525e47c9ba83a076aac457",
      key: "reminderTime",
      value: values?.reminderTime,
    });
  }

  if (values?.questionType === "hybrid") {
    valuesArray.push({
      propertyId: "69525e6bc9ba83a076aac458",
      key: "numOfCustomQuestions",
      value: values?.customQuestions,
    });
  }

  return {
    values: valuesArray,
    propertyIds,
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

export const transformToUpdateRoundPayload = (
  values: RoundFormData,
  touched?: any
) => {
  // Skills for round (each as its own array of one object)
  const skillsForRound = (values?.skills || []).map((skill) => [
    {
      propertyId: "69627d06c9ba83a076aac8f8",
      key: "_skill_",
      value: skill,
    },
  ]);

  // Questions (each as its own array of two objects)
  const questions: any[] =
    values?.customQuestionTexts && Array.isArray(values?.customQuestionTexts)
      ? values?.customQuestionTexts
          .map((questionText, idx) => {
            if (
              values?.questionType === "hybrid" &&
              typeof questionText === "string" &&
              questionText.trim() !== ""
            ) {
              return [
                {
                  propertyId: "69627d97c9ba83a076aac8fa",
                  key: "_question",
                  value: questionText,
                },
                {
                  propertyId: "69627dcdc9ba83a076aac8fb",
                  key: "_qType",
                  value: "hybrid",
                },
              ];
            }
            return null;
          })
          .filter(Boolean)
      : [];

  // Helper to check if a field is touched
  const isTouched = (field: string) => {
    if (!touched) return true; // If no touched object provided, include all fields
    return touched[field] === true;
  };

  const valuesArray: any[] = [];
  const propertyIds: string[] = [];

  // Round name
  if (isTouched("roundName")) {
    valuesArray.push({
      propertyId: "69525a92c9ba83a076aac43d",
      key: "roundName",
      value: values?.roundName || "",
    });
    propertyIds.push("69525a92c9ba83a076aac43d");
  }

  // Round type
  if (isTouched("roundType")) {
    valuesArray.push({
      propertyId: "69525ad1c9ba83a076aac43f",
      key: "roundType",
      value: values?.roundType || "",
    });
    propertyIds.push("69525ad1c9ba83a076aac43f");
  }

  // Round objective
  if (isTouched("roundObjective")) {
    valuesArray.push({
      propertyId: "69525aefc9ba83a076aac440",
      key: "roundObjective",
      value: values?.roundObjective || "",
    });
    propertyIds.push("69525aefc9ba83a076aac440");
  }

  // Language
  if (isTouched("language")) {
    valuesArray.push({
      propertyId: "69525b69c9ba83a076aac443",
      key: "language",
      value: values?.language || "",
    });
    propertyIds.push("69525b69c9ba83a076aac443");
  }

  // Duration
  if (isTouched("duration")) {
    valuesArray.push({
      propertyId: "69525bb8c9ba83a076aac448",
      key: "duration",
      value: values?.duration || "",
    });
    propertyIds.push("69525bb8c9ba83a076aac448");
  }

  // Question type
  if (isTouched("questionType")) {
    valuesArray.push({
      propertyId: "69525c85c9ba83a076aac44d",
      key: "questionsType",
      value: values?.questionType || "",
    });
    propertyIds.push("69525c85c9ba83a076aac44d");
  }

  // Number of AI questions
  if (isTouched("aiGeneratedQuestions")) {
    valuesArray.push({
      propertyId: "69525ca7c9ba83a076aac44e",
      key: "numOfAiQuestions",
      value: values?.aiGeneratedQuestions,
    });
    propertyIds.push("69525ca7c9ba83a076aac44e");
  }

  // Interview instructions
  if (isTouched("interviewInstructions")) {
    valuesArray.push({
      propertyId: "69525dd4c9ba83a076aac454",
      key: "interviewInstructions",
      value: values?.interviewInstructions || "",
    });
    propertyIds.push("69525dd4c9ba83a076aac454");
  }

  // Allow skip
  if (isTouched("allowSkip")) {
    valuesArray.push({
      propertyId: "69525decc9ba83a076aac455",
      key: "allowSkip",
      value: values?.allowSkip,
    });
    propertyIds.push("69525decc9ba83a076aac455");
  }

  // Send reminder
  if (isTouched("sendReminder")) {
    valuesArray.push({
      propertyId: "69525e05c9ba83a076aac456",
      key: "sendReminder",
      value: values?.sendReminder,
    });
    propertyIds.push("69525e05c9ba83a076aac456");
  }

  // Reminder time (if sendReminder is true)
  if (isTouched("sendReminder") && values?.sendReminder) {
    if (isTouched("reminderTime")) {
      valuesArray.push({
        propertyId: "69525e47c9ba83a076aac457",
        key: "reminderTime",
        value: values?.reminderTime,
      });
      propertyIds.push("69525e47c9ba83a076aac457");
    }
  }

  // Custom questions (if hybrid mode)
  if (isTouched("questionType") && values?.questionType === "hybrid") {
    if (isTouched("customQuestions")) {
      valuesArray.push({
        propertyId: "69525e6bc9ba83a076aac458",
        key: "numOfCustomQuestions",
        value: values?.customQuestions,
      });
      propertyIds.push("69525e6bc9ba83a076aac458");
    }
  }

  // Skills for round
  if (isTouched("skills")) {
    valuesArray.push({
      propertyId: "69627d2ec9ba83a076aac8f9",
      key: "_skillForRound",
      value: skillsForRound,
    });
    propertyIds.push("69627d2ec9ba83a076aac8f9");
  }

  // Questions
  if (isTouched("customQuestionTexts") || isTouched("questionType")) {
    valuesArray.push({
      propertyId: "69627df8c9ba83a076aac8fc",
      key: "_questions",
      value: questions,
    });
    propertyIds.push("69627df8c9ba83a076aac8fc");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};

// Helper function to convert Round interface to RoundFormData
export const transformRoundToRoundFormData = (
  round: any
): RoundFormData => {
  return {
    roundName: round?.name || "",
    roundType: round?.type || "",
    roundObjective: round?.objective || "",
    duration: round?.duration || "",
    language: round?.language || "",
    interviewer: round?.interviewer || "",
    skills: round?.skills || [],
    questionType: (round?.questionType as "ai" | "hybrid") || "ai",
    aiGeneratedQuestions: round?.aiGeneratedQuestions || 0,
    customQuestions: round?.customQuestions || 0,
    customQuestionTexts: round?.customQuestionTexts || [],
    interviewInstructions: round?.interviewInstructions || "",
    allowSkip: round?.allowSkip || false,
    sendReminder: round?.sendReminder || false,
    reminderTime: round?.reminderTime || "3 days",
  };
};