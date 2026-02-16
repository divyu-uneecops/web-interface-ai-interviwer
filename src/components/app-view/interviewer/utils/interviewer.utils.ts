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
  mappingValues: Record<
    string,
    { id?: string; name?: string; values: any[]; fields?: any[] }
  >
) => {
  // Transform skills to API format (array of arrays)
  const interviewerSkills = values?.skills
    ?.filter((skill: string) => skill?.trim()?.length > 0)
    ?.map((skill: string) => [
      {
        propertyId: mappingValues?.interviewerSkills?.fields?.[0]?._id || "",
        key: "skill",
        value: skill.trim(),
      },
    ]);

  // Transform personality traits to API format
  const personalityTraits = [
    {
      propertyId: mappingValues?.empathy?.fields?.[0]?._id || "",
      key: "empathy",
      value: values?.personality?.empathy || 0,
    },
    {
      propertyId: mappingValues?.rapport?.fields?.[1]?._id || "",
      key: "rapport",
      value: values?.personality?.rapport || 0,
    },
    {
      propertyId: mappingValues?.exploration?.fields?.[2]?._id || "",
      key: "exploration",
      value: values?.personality?.exploration || 0,
    },
    {
      propertyId: mappingValues?.speed?.fields?.[3]?._id || "",
      key: "speed",
      value: values?.personality?.speed || 0,
    },
  ];

  const valuesArray = [
    {
      propertyId: mappingValues?.name?.id || "",
      key: "name",
      value: values?.name || "",
    },
    {
      propertyId: mappingValues?.description?.id || "",
      key: "description",
      value: values?.description || "",
    },
    {
      propertyId: mappingValues?.interviewerSkills?.id || "",
      key: "interviewerSkills",
      value: interviewerSkills || [],
    },
    {
      propertyId: mappingValues?.roundType?.id || "",
      key: "roundType",
      value: values?.roundType || "",
    },
    {
      propertyId: mappingValues?.language?.id || "",
      key: "language",
      value: values?.language || "",
    },
    {
      propertyId: mappingValues?.voice?.id || "",
      key: "voice",
      value: values?.voice || "",
    },
    {
      propertyId: mappingValues?.avatarUrl?.id || "",
      key: "avatarUrl",
      value: values?.avatar,
    },
    {
      propertyId: mappingValues?.personalityTraits?.id || "",
      key: "personalityTraits",
      value: personalityTraits,
    },
    {
      propertyId: mappingValues?.formUser?.id || "",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"],
      //TODO: Needs to Change in future
    },
    {
      propertyId: mappingValues?.avatar?.id || "",
      key: "avatar",
      value: [],
    },
  ];

  return {
    values: valuesArray,
    propertyIds: [
      mappingValues?.name?.id,
      mappingValues?.description?.id,
      mappingValues?.interviewerSkills?.id,
      mappingValues?.roundType?.id,
      mappingValues?.language?.id,
      mappingValues?.voice?.id,
      mappingValues?.avatarUrl?.id,
      mappingValues?.personalityTraits?.id,
      mappingValues?.formUser?.id,
      mappingValues?.avatar?.id,
    ],
  };
};

export const transformToInterviewerUpdatePayload = (
  values: InterviewerFormData,
  touched: any,
  mappingValues: Record<
    string,
    { id?: string; name?: string; values: any[]; fields?: any[] }
  >
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
      propertyId: mappingValues?.name?.id || "",
      key: "name",
      value: values.name || "",
    });
    propertyIds.push(mappingValues?.name?.id || "");
  }

  // Description
  if (isTouched("description")) {
    valuesArray.push({
      propertyId: mappingValues?.description?.id || "",
      key: "description",
      value: values.description || "",
    });
    propertyIds.push(mappingValues?.description?.id || "");
  }

  // Skills
  if (isTouched("skills")) {
    const interviewerSkills = values.skills
      .filter((skill: string) => skill.trim().length > 0)
      .map((skill: string) => [
        {
          propertyId: mappingValues?.interviewerSkills?.fields?.[0]?._id || "",
          key: "skill",
          value: skill.trim(),
        },
      ]);
    valuesArray.push({
      propertyId: mappingValues?.interviewerSkills?.id || "",
      key: "interviewerSkills",
      value: interviewerSkills || [],
    });
    propertyIds.push(mappingValues?.interviewerSkills?.id || "");
  }

  // Round Type
  if (isTouched("roundType")) {
    valuesArray.push({
      propertyId: mappingValues?.roundType?.id || "",
      key: "roundType",
      value: values.roundType || "",
    });
    propertyIds.push(mappingValues?.roundType?.id || "");
  }

  // Language
  if (isTouched("language")) {
    valuesArray.push({
      propertyId: mappingValues?.language?.id || "",
      key: "language",
      value: values.language || "",
    });
    propertyIds.push(mappingValues?.language?.id || "");
  }

  // Voice
  if (isTouched("voice")) {
    valuesArray.push({
      propertyId: mappingValues?.voice?.id || "",
      key: "voice",
      value: values.voice || "",
    });
    propertyIds.push(mappingValues?.voice?.id || "");
  }

  // Avatar / avatarUrl
  if (isTouched("avatar") && values.avatar) {
    valuesArray.push({
      propertyId: mappingValues?.avatarUrl?.id || "",
      key: "avatarUrl",
      value: values.avatar,
    });
    propertyIds.push(mappingValues?.avatarUrl?.id || "");
  }

  // Personality Traits - if any trait is touched, include all traits
  if (isPersonalityTouched()) {
    const personalityTraits = [
      {
        propertyId: mappingValues?.empathy?.fields?.[0]?._id || "",
        key: "empathy",
        value: values.personality.empathy,
      },
      {
        propertyId: mappingValues?.rapport?.fields?.[1]?._id || "",
        key: "rapport",
        value: values.personality.rapport,
      },
      {
        propertyId: mappingValues?.exploration?.fields?.[2]?._id || "",
        key: "exploration",
        value: values.personality.exploration,
      },
      {
        propertyId: mappingValues?.speed?.fields?.[3]?._id || "",
        key: "speed",
        value: values.personality.speed,
      },
    ];

    valuesArray.push({
      propertyId: mappingValues?.personalityTraits?.id || "",
      key: "personalityTraits",
      value: personalityTraits,
    });
    propertyIds.push(mappingValues?.personalityTraits?.id || "");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};
