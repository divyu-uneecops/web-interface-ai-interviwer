import { mapInterviewerImage } from "../constants/interviewer.constants";
import {
  APIInterviewerItem,
  APIInterviewerValue,
  APIPaginationInfo,
  Interviewer,
  InterviewerFormData,
  InterviewersWithPagination,
} from "../interfaces/interviewer.interfaces";

export const transformAPIInterviewerItemToInterviewer = (
  item: APIInterviewerItem
): Interviewer => {
  // Create a map of values for easy lookup
  const valuesMap = new Map<string, any>();
  if (Array.isArray(item?.values)) {
    item?.values?.forEach((val: APIInterviewerValue) => {
      if (val && val?.key) {
        valuesMap.set(val?.key, val?.value);
      }
    });
  }

  // Extract values with fallbacks
  const name = valuesMap?.get("name") || "Unnamed Interviewer";
  const description = valuesMap?.get("description") || "";
  const roundType = valuesMap?.get("roundType") || "Behavioral";
  const voice = valuesMap?.get("voice") || "Male";
  const language = valuesMap?.get("language") || "English";

  let requiredSkills: string[] = [];
  const skillsValue = valuesMap?.get("interviewerSkills");
  if (Array.isArray(skillsValue) && skillsValue?.length > 0) {
    // The value is an array of arrays, each inner array might have an object with .value or "skill"
    requiredSkills = skillsValue
      ?.flat()
      ?.map((sk: any) => {
        if (sk && typeof sk === "object") return sk?.value || sk?.skill || "";
        return "";
      })
      ?.filter((v: string) => !!v);
  }

  const personalityTraits = valuesMap.get("personalityTraits") || [];
  const empathy =
    personalityTraits?.find((trait: any) => trait?.key === "empathy")?.value ||
    0;
  const rapport =
    personalityTraits?.find((trait: any) => trait?.key === "rapport")?.value ||
    0;
  const exploration =
    personalityTraits?.find((trait: any) => trait?.key === "exploration")
      ?.value || 0;
  const speed =
    personalityTraits?.find((trait: any) => trait?.key === "speed")?.value || 0;

  // Determine image URL: API avatarUrl first, then fallback from voice/roundType
  const avatarUrl = valuesMap?.get("avatarUrl");

  return {
    id: item?.id || "",
    name: name || "",
    voice: voice || "",
    language: language || "",
    description: description || "",
    avatar: avatarUrl || "",
    roundType: roundType || "",
    interviewerSkills: requiredSkills || [],
    personality: {
      empathy: empathy,
      rapport: rapport,
      exploration: exploration,
      speed: speed,
    },
  };
};

export const transformAPIResponseToInterviewers = (
  data: APIInterviewerItem[],
  pagination?: APIPaginationInfo
): InterviewersWithPagination => {
  if (!Array.isArray(data)) {
    return {
      interviewers: [],
      pagination: {
        total: 0,
        nextOffset: null,
        previousOffset: null,
        limit: 10,
      },
    };
  }

  const interviewers = data.map((item) =>
    transformAPIInterviewerItemToInterviewer(item)
  );

  return {
    interviewers,
    pagination: pagination || {
      total: interviewers.length,
      nextOffset: null,
      previousOffset: null,
      limit: 10,
    },
  };
};

export const transformToInterviewerCreatePayload = (
  values: InterviewerFormData,
  formId: string
) => {
  // Transform skills to API format (array of arrays)
  const interviewerSkills = values?.skills
    ?.filter((skill: string) => skill?.trim()?.length > 0)
    ?.map((skill: string) => [
      {
        propertyId: "69525680c9ba83a076aac417",
        key: "skill",
        value: skill.trim(),
      },
    ]);

  // Transform personality traits to API format
  const personalityTraits = [
    {
      propertyId: "695257cdc9ba83a076aac41d",
      key: "empathy",
      value: values?.personality?.empathy || 0,
    },
    {
      propertyId: "695257e4c9ba83a076aac41e",
      key: "rapport",
      value: values?.personality?.rapport || 0,
    },
    {
      propertyId: "69525807c9ba83a076aac420",
      key: "exploration",
      value: values?.personality?.exploration || 0,
    },
    {
      propertyId: "69525827c9ba83a076aac421",
      key: "speed",
      value: values?.personality?.speed || 0,
    },
  ];

  const valuesArray = [
    {
      propertyId: "6952562ac9ba83a076aac413",
      key: "name",
      value: values?.name || "",
    },
    {
      propertyId: "69525663c9ba83a076aac416",
      key: "description",
      value: values?.description || "",
    },
    {
      propertyId: "695256aac9ba83a076aac418",
      key: "interviewerSkills",
      value: interviewerSkills || [],
    },
    {
      propertyId: "69525713c9ba83a076aac419",
      key: "roundType",
      value: values?.roundType || "",
    },
    {
      propertyId: "6952577bc9ba83a076aac41a",
      key: "language",
      value: values?.language || "",
    },
    {
      propertyId: "695257b4c9ba83a076aac41b",
      key: "voice",
      value: values?.voice || "",
    },
    {
      propertyId: "6985806ca5d62230806a8cee",
      key: "avatarUrl",
      value: values?.avatar,
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
      "6952562ac9ba83a076aac413",
      "6952564bc9ba83a076aac415",
      "69525663c9ba83a076aac416",
      "695256aac9ba83a076aac418",
      "69525713c9ba83a076aac419",
      "6952577bc9ba83a076aac41a",
      "695257b4c9ba83a076aac41b",
      "69525848c9ba83a076aac423",
      "695754a9c9ba83a076aac57d",
      "6985806ca5d62230806a8cee",
    ],
    flows: [
      {
        stageId: "1",
        status: "PENDING",
      },
    ],
    status: "PENDING",
    formId: formId,
  };
};

export const transformToInterviewerUpdatePayload = (
  values: InterviewerFormData,
  touched?: any
) => {
  const valuesArray: any[] = [];
  const propertyIds: string[] = [];

  // Helper to check if a field is touched
  const isTouched = (field: string) => {
    if (!touched) return true; // If no touched object provided, include all fields
    return touched[field] === true;
  };

  // Helper to check if any personality trait is touched
  const isPersonalityTouched = () => {
    if (!touched) return true;
    return (
      touched.personality === true ||
      (touched.personality &&
        (touched.personality.empathy ||
          touched.personality.rapport ||
          touched.personality.exploration ||
          touched.personality.speed))
    );
  };

  // Name
  if (isTouched("name")) {
    valuesArray.push({
      propertyId: "6952562ac9ba83a076aac413",
      key: "name",
      value: values.name || "",
    });
    propertyIds.push("6952562ac9ba83a076aac413");
  }

  // Description
  if (isTouched("description")) {
    valuesArray.push({
      propertyId: "69525663c9ba83a076aac416",
      key: "description",
      value: values.description || "",
    });
    propertyIds.push("69525663c9ba83a076aac416");
  }

  // Skills
  if (isTouched("skills")) {
    const interviewerSkills = values.skills
      .filter((skill: string) => skill.trim().length > 0)
      .map((skill: string) => [
        {
          propertyId: "69525680c9ba83a076aac417",
          key: "skill",
          value: skill.trim(),
        },
      ]);
    valuesArray.push({
      propertyId: "695256aac9ba83a076aac418",
      key: "interviewerSkills",
      value: interviewerSkills || [],
    });
    propertyIds.push("695256aac9ba83a076aac418");
  }

  // Round Type
  if (isTouched("roundType")) {
    valuesArray.push({
      propertyId: "69525713c9ba83a076aac419",
      key: "roundType",
      value: values.roundType || "",
    });
    propertyIds.push("69525713c9ba83a076aac419");
  }

  // Language
  if (isTouched("language")) {
    valuesArray.push({
      propertyId: "6952577bc9ba83a076aac41a",
      key: "language",
      value: values.language || "",
    });
    propertyIds.push("6952577bc9ba83a076aac41a");
  }

  // Voice
  if (isTouched("voice")) {
    valuesArray.push({
      propertyId: "695257b4c9ba83a076aac41b",
      key: "voice",
      value: values.voice || "",
    });
    propertyIds.push("695257b4c9ba83a076aac41b");
  }

  // Avatar / avatarUrl
  if (isTouched("avatar") && values.avatar) {
    valuesArray.push({
      propertyId: "6985806ca5d62230806a8cee",
      key: "avatarUrl",
      value: values.avatar,
    });
    propertyIds.push("6985806ca5d62230806a8cee");
  }

  // Personality Traits - if any trait is touched, include all traits
  if (isPersonalityTouched()) {
    const personalityTraits = [
      {
        propertyId: "695257cdc9ba83a076aac41d",
        key: "empathy",
        value: values.personality.empathy,
      },
      {
        propertyId: "695257e4c9ba83a076aac41e",
        key: "rapport",
        value: values.personality.rapport,
      },
      {
        propertyId: "69525807c9ba83a076aac420",
        key: "exploration",
        value: values.personality.exploration,
      },
      {
        propertyId: "69525827c9ba83a076aac421",
        key: "speed",
        value: values.personality.speed,
      },
    ];

    valuesArray.push({
      propertyId: "69525848c9ba83a076aac423",
      key: "personalityTraits",
      value: personalityTraits,
    });
    propertyIds.push("69525848c9ba83a076aac423");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};
