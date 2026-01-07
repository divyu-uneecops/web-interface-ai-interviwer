import { InterviewerFormData } from "../components/create-interviewer-modal";

export const transformToAPIPayload = (values: InterviewerFormData) => {
  // Generate interviewerId
  const interviewerId = Math.floor(Math.random() * 10000) + 10000;

  // Transform skills to API format (array of arrays)
  const interviewerSkills = values.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
    .map((skill) => [
      {
        propertyId: "69525680c9ba83a076aac417",
        key: "skill",
        value: skill,
      },
    ]);

  // Transform personality traits to API format
  const personalityTraits = [
    {
      propertyId: "695257cdc9ba83a076aac41d",
      key: "empathy",
      value: Math.round(values.personality.empathy / 50), // Convert 0-100 to 0-2 scale
    },
    {
      propertyId: "695257e4c9ba83a076aac41e",
      key: "rapport",
      value: Math.round(values.personality.rapport / 50),
    },
    {
      propertyId: "69525807c9ba83a076aac420",
      key: "exploration",
      value: Math.round(values.personality.exploration / 50),
    },
    {
      propertyId: "69525827c9ba83a076aac421",
      key: "speed",
      value: Math.round(values.personality.speed / 50),
    },
  ];

  // Map language to API format (e.g., "English" -> "en-US")
  const languageMap: Record<string, string> = {
    English: "en-US",
  };
  const languageValue =
    values.language && languageMap[values.language]
      ? languageMap[values.language]
      : values.language || "en-US";

  const valuesArray = [
    {
      propertyId: "69525606c9ba83a076aac411",
      key: "interviewerId",
      value: String(interviewerId),
    },
    {
      propertyId: "6952562ac9ba83a076aac413",
      key: "name",
      value: values.name,
    },
    {
      propertyId: "69525663c9ba83a076aac416",
      key: "description",
      value: values.description || "",
    },
    {
      propertyId: "695256aac9ba83a076aac418",
      key: "interviewerSkills",
      value: interviewerSkills,
    },
    {
      propertyId: "69525713c9ba83a076aac419",
      key: "roundType",
      value: values.roundType,
    },
    {
      propertyId: "6952577bc9ba83a076aac41a",
      key: "language",
      value: languageValue,
    },
    {
      propertyId: "695257b4c9ba83a076aac41b",
      key: "voice",
      value: values.voice,
    },
    {
      propertyId: "69525848c9ba83a076aac423",
      key: "personalityTraits",
      value: personalityTraits,
    },
    {
      propertyId: "695754a9c9ba83a076aac57d",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"],
      //TODO: Needs to Change in future
    },
  ];

  // Add avatar field (empty array for now, can be updated when file upload is implemented)
  valuesArray.push({
    propertyId: "6952564bc9ba83a076aac415",
    key: "avatar",
    value: [],
  });

  return {
    values: valuesArray,
    propertyIds: [
      "69525606c9ba83a076aac411",
      "6952562ac9ba83a076aac413",
      "6952564bc9ba83a076aac415",
      "69525663c9ba83a076aac416",
      "695256aac9ba83a076aac418",
      "69525713c9ba83a076aac419",
      "6952577bc9ba83a076aac41a",
      "695257b4c9ba83a076aac41b",
      "69525848c9ba83a076aac423",
      "695754a9c9ba83a076aac57d",
    ],
    flows: [
      {
        stageId: "1",
        status: "PENDING",
      },
    ],
    status: "PENDING",
    formId: "69521d56c9ba83a076aac3bf",
  };
};
