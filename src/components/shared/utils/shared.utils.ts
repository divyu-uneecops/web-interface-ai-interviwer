import { RoundFormData } from "../interfaces/shared.interface";

export const transformToCreateRoundPayload = (
  values: RoundFormData,
  jobId: string,
  mappingValues: Record<
    string,
    { id?: string; name?: string; values: any[]; fields?: any[] }
  >
) => {
  // Skills for round (each as its own array of one object)
  const skillsForRound = (values?.skills || []).map((skill) => [
    {
      propertyId: mappingValues?.v2_skillForRound?.fields?.[0]?._id || "",
      key: "v2_skill_",
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
                  propertyId:
                    mappingValues?.v2_questions?.fields?.[0]?._id || "",
                  key: "v2_question",
                  value: questionText,
                },
                {
                  propertyId:
                    mappingValues?.v2_questions?.fields?.[1]?._id || "",
                  key: "v2_qType",
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
      propertyId: mappingValues?.roundName?.id || "",
      key: "roundName",
      value: values?.roundName || "",
    },
    {
      propertyId: mappingValues?.roundType?.id || "",
      key: "roundType",
      value: values?.roundType || "",
    },
    {
      propertyId: mappingValues?.roundObjective?.id || "",
      key: "roundObjective",
      value: values?.roundObjective || "",
    },
    {
      propertyId: mappingValues?.language?.id || "",
      key: "language",
      value: values?.language || "",
    },
    {
      propertyId: mappingValues?.duration?.id || "",
      key: "duration",
      value: values?.duration || "",
    },
    {
      propertyId: mappingValues?.accessibility?.id || "",
      key: "accessibility",
      value: "Private", // TODO: Needs to Change in future
    },
    {
      propertyId: mappingValues?.questionType?.id || "",
      key: "questionsType",
      value: values?.questionType || "",
    },
    {
      propertyId: mappingValues?.numOfAiQuestions?.id || "",
      key: "numOfAiQuestions",
      value: values?.aiGeneratedQuestions,
    },
    {
      propertyId: mappingValues?.interviewInstructions?.id || "",
      key: "interviewInstructions",
      value: values?.interviewInstructions || "",
    },
    {
      propertyId: mappingValues?.allowSkip?.id || "",
      key: "allowSkip",
      value: values?.allowSkip,
    },
    {
      propertyId: mappingValues?.sendReminder?.id || "",
      key: "sendReminder",
      value: values?.sendReminder,
    },
    {
      propertyId: mappingValues?.formUser?.id || "",
      key: "formUser",
      value: ["6981a2106586fca18fe59852"], // Replace with actual user id if needed
    },
    {
      propertyId: mappingValues?.jobName?.id || "",
      key: "jobName",
      value: jobId || "",
    },
    {
      propertyId: mappingValues?.interviewerName?.id || "",
      key: "interviewerName",
      value: values?.interviewer || "",
    },
    {
      propertyId: mappingValues?.jobID?.id || "",
      key: "jobID",
      value: jobId || "",
    },
    {
      propertyId: mappingValues?.interviewerID?.id || "",
      key: "interviewerID",
      value: values?.interviewer || "",
    },
    {
      //TODO: Change in future
      propertyId: "69833ad78e11e2580092cd40",
      key: "v2_skillForRound",
      value: skillsForRound,
    },
    {
      propertyId: mappingValues?.v2_questions?.id || "",
      key: "v2_questions",
      value: questions,
    },
  ];

  const propertyIds = [
    mappingValues?.roundId?.id || "",
    mappingValues?.roundName?.id || "",
    mappingValues?.roundType?.id || "",
    mappingValues?.roundObjective?.id || "",
    mappingValues?.language?.id || "",
    mappingValues?.duration?.id || "",
    mappingValues?.accessibility?.id || "",
    mappingValues?.questionsType?.id || "",
    mappingValues?.numOfAiQuestions?.id || "",
    mappingValues?.interviewInstructions?.id || "",
    mappingValues?.allowSkip?.id || "",
    mappingValues?.sendReminder?.id || "",
    mappingValues?.formUser?.id || "",
    mappingValues?.accessLink?.id || "",
    mappingValues?.jobName?.id || "",
    mappingValues?.interviewerName?.id || "",
    mappingValues?.jobID?.id || "",
    mappingValues?.interviewerID?.id || "",
    //TODO: Change in future
    "69833ad78e11e2580092cd40",
    mappingValues?.v2_questions?.id || "",
    mappingValues?.reminderTime?.id || "",
    mappingValues?.numOfCustomQuestions?.id || "",
  ];

  if (values?.sendReminder) {
    valuesArray.push({
      propertyId: mappingValues?.reminderTime?.id || "",
      key: "reminderTime",
      value: values?.reminderTime,
    });
  }

  if (values?.questionType === "hybrid") {
    valuesArray.push({
      propertyId: mappingValues?.numOfCustomQuestions?.id || "",
      key: "numOfCustomQuestions",
      value: values?.customQuestions,
    });
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};

export const transformToUpdateRoundPayload = (
  values: RoundFormData,
  touched: any,
  mappingValues: Record<
    string,
    { id?: string; name?: string; values: any[]; fields?: any[] }
  >
) => {
  // Skills for round (each as its own array of one object)
  const skillsForRound = (values?.skills || []).map((skill) => [
    {
      propertyId: mappingValues?._skillForRound?.fields?.[0]?._id || "",
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
                  propertyId: mappingValues?._questions?.fields?.[0]?._id || "",
                  key: "_question",
                  value: questionText,
                },
                {
                  propertyId: mappingValues?._questions?.fields?.[1]?._id || "",
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
      propertyId: mappingValues?.roundName?.id || "",
      key: "roundName",
      value: values?.roundName || "",
    });
    propertyIds.push(mappingValues?.roundName?.id || "");
  }

  // Round type
  if (isTouched("roundType")) {
    valuesArray.push({
      propertyId: mappingValues?.roundType?.id || "",
      key: "roundType",
      value: values?.roundType || "",
    });
    propertyIds.push(mappingValues?.roundType?.id || "");
  }

  // Round objective
  if (isTouched("roundObjective")) {
    valuesArray.push({
      propertyId: mappingValues?.roundObjective?.id || "",
      key: "roundObjective",
      value: values?.roundObjective || "",
    });
    propertyIds.push(mappingValues?.roundObjective?.id || "");
  }

  // Language
  if (isTouched("language")) {
    valuesArray.push({
      propertyId: mappingValues?.language?.id || "",
      key: "language",
      value: values?.language || "",
    });
    propertyIds.push(mappingValues?.language?.id || "");
  }

  // Duration
  if (isTouched("duration")) {
    valuesArray.push({
      propertyId: mappingValues?.duration?.id || "",
      key: "duration",
      value: values?.duration || "",
    });
    propertyIds.push(mappingValues?.duration?.id || "");
  }

  // Question type
  if (isTouched("questionType")) {
    valuesArray.push({
      propertyId: mappingValues?.questionsType?.id || "",
      key: "questionsType",
      value: values?.questionType || "",
    });
    propertyIds.push(mappingValues?.questionsType?.id || "");
  }

  // Number of AI questions
  if (isTouched("aiGeneratedQuestions")) {
    valuesArray.push({
      propertyId: mappingValues?.numOfAiQuestions?.id || "",
      key: "numOfAiQuestions",
      value: values?.aiGeneratedQuestions,
    });
    propertyIds.push(mappingValues?.numOfAiQuestions?.id || "");
  }

  // Interview instructions
  if (isTouched("interviewInstructions")) {
    valuesArray.push({
      propertyId: mappingValues?.interviewInstructions?.id || "",
      key: "interviewInstructions",
      value: values?.interviewInstructions || "",
    });
    propertyIds.push(mappingValues?.interviewInstructions?.id || "");
  }

  // Allow skip
  if (isTouched("allowSkip")) {
    valuesArray.push({
      propertyId: mappingValues?.allowSkip?.id || "",
      key: "allowSkip",
      value: values?.allowSkip,
    });
    propertyIds.push(mappingValues?.allowSkip?.id || "");
  }

  // Send reminder
  if (isTouched("sendReminder")) {
    valuesArray.push({
      propertyId: mappingValues?.sendReminder?.id || "",
      key: "sendReminder",
      value: values?.sendReminder,
    });
    propertyIds.push(mappingValues?.sendReminder?.id || "");
  }

  // Reminder time (if sendReminder is true)
  if (isTouched("sendReminder") && values?.sendReminder) {
    if (isTouched("reminderTime")) {
      valuesArray.push({
        propertyId: mappingValues?.reminderTime?.id || "",
        key: "reminderTime",
        value: values?.reminderTime,
      });
      propertyIds.push(mappingValues?.reminderTime?.id || "");
    }
  }

  // Custom questions (if hybrid mode)
  if (isTouched("questionType") && values?.questionType === "hybrid") {
    if (isTouched("customQuestions")) {
      valuesArray.push({
        propertyId: mappingValues?.numOfCustomQuestions?.id || "",
        key: "numOfCustomQuestions",
        value: values?.customQuestions,
      });
      propertyIds.push(mappingValues?.numOfCustomQuestions?.id || "");
    }
  }

  // Skills for round
  if (isTouched("skills")) {
    valuesArray.push({
      propertyId: mappingValues?._skillForRound?.id || "",
      key: "_skillForRound",
      value: skillsForRound,
    });
    propertyIds.push(mappingValues?._skillForRound?.id || "");
  }

  // Questions
  if (isTouched("customQuestionTexts") || isTouched("questionType")) {
    valuesArray.push({
      propertyId: mappingValues?._questions?.id || "",
      key: "_questions",
      value: questions,
    });
    propertyIds.push(mappingValues?._questions?.id || "");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};
