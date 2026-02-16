import {
  JobFormData,
  APIJobItem,
  APIPaginationInfo,
  JobsWithPagination,
  APIJobDetailSection,
  JobDetail,
  ApplicantForm,
  Applicant,
  Round,
} from "../interfaces/job.interface";
import { ApplicantStatus } from "../types/job.types";

export const transformAPIJobItemToJob = (item: APIJobItem): JobDetail => {
  // Create a map of values for easy lookup
  const valuesMap = new Map<string, any>();
  if (Array.isArray(item.values)) {
    item.values.forEach((val) => {
      if (val && val.key) {
        valuesMap.set(val.key, val.value);
      }
    });
  }

  // Extraction with fallback
  const title = valuesMap.get("title") || "";
  const industry = valuesMap.get("industry") || "";
  const jobLevel = valuesMap.get("jobLevel") || "";
  const jobType = valuesMap.get("jobType") || "";
  const minExp = valuesMap.get("minExp") ?? 0;
  const maxExp = valuesMap.get("maxExp") ?? 0;
  const description = valuesMap.get("description") || "";
  const numOfOpenings = valuesMap.get("numOfOpenings") ?? 0;
  const status = valuesMap.get("status") || "Draft";
  const accessibility = valuesMap.get("accessibility") || "";
  // Required skills extraction (expecting nested array of [{ key: 'skill', value: ... }])
  let requiredSkills: string[] = [];
  const skillsValue = valuesMap.get("requiredSkills");
  if (Array.isArray(skillsValue) && skillsValue.length > 0) {
    // The value is an array of arrays, each inner array might have an object with .value or "skill"
    requiredSkills = skillsValue
      .flat()
      .map((sk: any) => {
        if (sk && typeof sk === "object") return sk.value || sk.skill || "";
        return "";
      })
      .filter((v) => !!v);
  }

  // createdOn default
  const createdOnRaw = item.createdOn;

  return {
    id: String(item?.id || ""),
    title: String(title),
    status,
    industry: String(industry),
    jobLevel: String(jobLevel),
    jobType: String(jobType),
    minExp: typeof minExp === "string" ? parseInt(minExp, 10) || 0 : minExp,
    maxExp: typeof maxExp === "string" ? parseInt(maxExp, 10) || 0 : maxExp,
    description: String(description),
    numOfOpenings:
      typeof numOfOpenings === "string"
        ? parseInt(numOfOpenings, 10) || 0
        : numOfOpenings,
    accessibility: String(accessibility),
    applicants: 0,
    interviews: 0,
    requiredSkills,
    createdOn: formatRelativeTime(createdOnRaw),
  };
};

export const transformAPIResponseToJobs = (
  data: APIJobItem[],
  pagination?: APIPaginationInfo
): JobsWithPagination => {
  if (!Array.isArray(data)) {
    return {
      jobs: [],
      pagination: {
        total: [0],
        nextOffset: null,
        previousOffset: null,
        limit: 10,
      },
    };
  }

  const jobs = data.map((item) => transformAPIJobItemToJob(item));

  return {
    jobs,
    pagination: pagination || {
      total: [jobs.length],
      nextOffset: null,
      previousOffset: null,
      limit: 10,
    },
  };
};

export const transformAPIResponseToJobDetail = (
  data: APIJobDetailSection[],
  id: string
): JobDetail => {
  if (!Array.isArray(data) || data?.length === 0) {
    return {
      id: String(id),
      title: "",
      status: "Draft",
      industry: "",
      createdOn: "",
      description: "",
      requiredSkills: [],
      jobLevel: "",
      jobType: "",
      minExp: 0,
      maxExp: 0,
      numOfOpenings: 0,
      applicants: 0,
      interviews: 0,
      accessibility: "",
    };
  }

  // Create a map of all fields for easy lookup
  const fieldsMap = new Map<string, any>();

  data?.forEach((section) => {
    if (Array.isArray(section?.fields)) {
      section?.fields?.forEach((field) => {
        if (field?.key) {
          fieldsMap.set(field?.key, field?.value);
        }
      });
    }
  });

  // Extraction with fallback
  const title = fieldsMap.get("title") || "";
  const industry = fieldsMap.get("industry") || "";
  const jobLevel = fieldsMap.get("jobLevel") || "";
  const jobType = fieldsMap.get("jobType") || "";
  const minExp = fieldsMap.get("minExp") ?? 0;
  const maxExp = fieldsMap.get("maxExp") ?? 0;
  const description = fieldsMap.get("description") || "";
  const numOfOpenings = fieldsMap.get("numOfOpenings") ?? 0;
  const status = fieldsMap.get("status") || "Draft";
  const accessibility = fieldsMap.get("accessibility") || "";
  // Required skills extraction (expecting nested array of [{ key: 'skill', value: ... }])
  let requiredSkills: string[] = [];
  const skillsValue = fieldsMap.get("requiredSkills");
  if (Array.isArray(skillsValue) && skillsValue.length > 0) {
    // The value is an array of arrays, each inner array might have an object with .value or "skill"
    requiredSkills = skillsValue
      .flat()
      .map((sk: any) => {
        if (sk && typeof sk === "object") return sk.value || sk.skill || "";
        return "";
      })
      .filter((v) => !!v);
  }

  // createdOn default
  const createdOnRaw = 1767074863801;

  return {
    id: String(id || ""),
    title: String(title),
    status,
    industry: String(industry),
    jobLevel: String(jobLevel),
    jobType: String(jobType),
    minExp: typeof minExp === "string" ? parseInt(minExp, 10) || 0 : minExp,
    maxExp: typeof maxExp === "string" ? parseInt(maxExp, 10) || 0 : maxExp,
    description: String(description),
    numOfOpenings:
      typeof numOfOpenings === "string"
        ? parseInt(numOfOpenings, 10) || 0
        : numOfOpenings,
    accessibility: String(accessibility),
    applicants: 0,
    interviews: 0,
    requiredSkills,
    createdOn: formatRelativeTime(createdOnRaw),
  };
};

export const transformToCreateJobPayload = (
  values: JobFormData,
  propertyIds: Record<
    string,
    { id?: string; name?: string; values: any[]; fields?: any[] }
  >
) => {
  // Transform skills to API format (array of arrays)
  const requiredSkills = (values.skills || []).map((skill) => [
    {
      propertyId: propertyIds?.requiredSkills?.fields?.[0]?._id || "",
      key: "skill",
      value: skill,
    },
  ]);

  const valuesArray = [
    {
      propertyId: propertyIds?.title?.id || "",
      key: "title",
      value: values?.title,
    },
    {
      propertyId: propertyIds?.industry?.id || "",
      key: "industry",
      value: values?.industry,
    },
    {
      propertyId: propertyIds?.jobLevel?.id || "",
      key: "jobLevel",
      value: values?.jobLevel,
    },
    {
      propertyId: propertyIds?.jobType?.id || "",
      key: "jobType",
      value: values?.jobType,
    },
    {
      propertyId: propertyIds?.minExp?.id || "",
      key: "minExp",
      value: values?.minExperience,
    },
    {
      propertyId: propertyIds?.maxExp?.id || "",
      key: "maxExp",
      value: values?.maxExperience,
    },
    {
      propertyId: propertyIds?.description?.id || "",
      key: "description",
      value: values?.description,
    },
    {
      propertyId: propertyIds?.numOfOpenings?.id || "",
      key: "numOfOpenings",
      value: values?.noOfOpenings,
    },
    {
      propertyId: propertyIds?.status?.id || "",
      key: "status",
      value: values?.status,
    },
    {
      propertyId: propertyIds?.accessibility?.id || "",
      key: "accessibility",
      value: "Private", // TODO: change in future if needed
    },
    {
      propertyId: propertyIds?.requiredSkills?.id || "",
      key: "requiredSkills",
      value: requiredSkills,
    },
    {
      propertyId: propertyIds?.formUser?.id || "",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"], // TODO: change in future if needed
    },
  ];

  return {
    values: valuesArray,
    propertyIds: [
      propertyIds?.title?.id,
      propertyIds?.industry?.id,
      propertyIds?.jobLevel?.id,
      propertyIds?.jobType?.id,
      propertyIds?.minExp?.id,
      propertyIds?.maxExp?.id,
      propertyIds?.description?.id,
      propertyIds?.numOfOpenings?.id,
      propertyIds?.attachment?.id,
      propertyIds?.status?.id,
      propertyIds?.accessibility?.id,
      propertyIds?.requiredSkills?.id,
      propertyIds?.formUser?.id,
      "695257bfc9ba83a076aac41c",
      "695257f8c9ba83a076aac41f",
      "69525830c9ba83a076aac422",
      "69525880c9ba83a076aac425",
      "69525898c9ba83a076aac427",
      "695258ccc9ba83a076aac42a",
      "695258e5c9ba83a076aac42c",
      "6952591cc9ba83a076aac42e",
      "6952595cc9ba83a076aac431",
      "6952598ec9ba83a076aac432",
      "695259d0c9ba83a076aac435",
      "6957547fc9ba83a076aac57c",
    ],
  };
};

export const transformToUpdateJobPayload = (
  values: JobFormData,
  dirtyFields: Partial<Record<keyof JobFormData, boolean | any>>,
  mappingValues: Record<
    string,
    { id?: string; name?: string; values: any[]; fields?: any[] }
  >
) => {
  const valuesArray: any[] = [];
  const propertyIds: string[] = [];

  // Helper to check if a field is dirty
  const isDirty = (field: keyof JobFormData) => {
    return dirtyFields[field] === true;
  };

  // Title
  if (isDirty("title")) {
    valuesArray.push({
      propertyId: mappingValues?.title?.id || "",
      key: "title",
      value: values?.title || "",
    });
    propertyIds.push(mappingValues?.title?.id || "");
  }

  // Industry
  if (isDirty("industry")) {
    valuesArray.push({
      propertyId: mappingValues?.industry?.id || "",
      key: "industry",
      value: values?.industry || "",
    });
    propertyIds.push(mappingValues?.industry?.id || "");
  }

  // Job Level
  if (isDirty("jobLevel")) {
    valuesArray.push({
      propertyId: mappingValues?.jobLevel?.id || "",
      key: "jobLevel",
      value: values?.jobLevel || "",
    });
    propertyIds.push(mappingValues?.jobLevel?.id || "");
  }

  // Job Type
  if (isDirty("jobType")) {
    valuesArray.push({
      propertyId: mappingValues?.jobType?.id || "",
      key: "jobType",
      value: values?.jobType || "",
    });
    propertyIds.push(mappingValues?.jobType?.id || "");
  }

  // Min Experience
  if (isDirty("minExperience")) {
    valuesArray.push({
      propertyId: mappingValues?.minExp?.id || "",
      key: "minExp",
      value: values?.minExperience,
    });
    propertyIds.push(mappingValues?.minExp?.id || "");
  }

  // Max Experience
  if (isDirty("maxExperience")) {
    valuesArray.push({
      propertyId: mappingValues?.maxExp?.id || "",
      key: "maxExp",
      value: values?.maxExperience,
    });
    propertyIds.push(mappingValues?.maxExp?.id || "");
  }

  // Description
  if (isDirty("description")) {
    valuesArray.push({
      propertyId: mappingValues?.description?.id || "",
      key: "description",
      value: values?.description || "",
    });
    propertyIds.push(mappingValues?.description?.id || "");
  }

  // No. of Openings
  if (isDirty("noOfOpenings")) {
    valuesArray.push({
      propertyId: mappingValues?.numOfOpenings?.id || "",
      key: "numOfOpenings",
      value: values?.noOfOpenings,
    });
    propertyIds.push(mappingValues?.numOfOpenings?.id || "");
  }

  // Status
  if (isDirty("status")) {
    valuesArray.push({
      propertyId: mappingValues?.status?.id || "",
      key: "status",
      value: values?.status || "",
    });
    propertyIds.push(mappingValues?.status?.id || "");
  }

  // Required Skills
  if (isDirty("skills")) {
    const requiredSkills = (values.skills || []).map((skill) => [
      {
        propertyId: mappingValues?.requiredSkills?.fields?.[0]?._id || "",
        key: "skill",
        value: skill,
      },
    ]);
    valuesArray.push({
      propertyId: mappingValues?.requiredSkills?.id || "",
      key: "requiredSkills",
      value: requiredSkills,
    });
    propertyIds.push(mappingValues?.requiredSkills?.id || "");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};

// Format timestamp to relative time (e.g., "2d ago", "1h ago")
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

export const transformAPIApplicantItemToApplicant = (
  item: APIJobItem
): Applicant => {
  // Create a map of values for easy lookup
  const valuesMap = new Map<string, any>();
  if (Array.isArray(item.values)) {
    item.values.forEach((val) => {
      if (val && val.key) {
        valuesMap.set(val.key, val.value);
      }
    });
  }

  // Extraction with fallback
  const name = valuesMap.get("name") || "";
  const email = valuesMap.get("email") || "";
  const contact = valuesMap.get("phone") || "";
  const status = valuesMap.get("status") || "Applied";
  const attachment = valuesMap.get("attachment")?.[0] || "";
  const createdOnRaw = item.createdOn;

  return {
    id: String(item?.id || ""),
    name: String(name),
    email: String(email),
    contact: String(contact),
    status: status as ApplicantStatus,
    attachment: attachment,
    appliedDate: formatRelativeTime(createdOnRaw),
  };
};

export const transformAPIResponseToApplicants = (
  data: APIJobItem[],
  pagination?: APIPaginationInfo
): { applicants: Applicant[]; pagination: APIPaginationInfo } => {
  if (!Array.isArray(data)) {
    return {
      applicants: [],
      pagination: {
        total: [0],
        nextOffset: null,
        previousOffset: null,
        limit: 10,
      },
    };
  }

  const applicants = data.map((item) =>
    transformAPIApplicantItemToApplicant(item)
  );

  return {
    applicants,
    pagination: pagination || {
      total: [applicants.length],
      nextOffset: null,
      previousOffset: null,
      limit: 10,
    },
  };
};

export const transformApplicantToCreatePayload = (
  values: ApplicantForm,
  jobId: string,
  attachmentPath: string,
  formId: string
) => {
  const valuesArray: any[] = [];

  // Status
  valuesArray.push({
    propertyId: "695259a6c9ba83a076aac433",
    key: "status",
    value: "Applied",
  });

  // Form User
  valuesArray.push({
    propertyId: "695766c0c9ba83a076aac598",
    key: "formUser",
    value: ["6936a4d92276e3fc3ac7b13b"], // TODO: Needs to Change in future
  });

  // Name
  valuesArray.push({
    propertyId: "695c91fec9ba83a076aac6c8",
    key: "name",
    value: values?.name,
  });

  // Email
  valuesArray.push({
    propertyId: "695c9244c9ba83a076aac6c9",
    key: "email",
    value: values?.email,
  });

  // Phone
  valuesArray.push({
    propertyId: "695c9276c9ba83a076aac6ca",
    key: "phone",
    value: values?.contact,
  });

  // Attachment (if provided)
  if (attachmentPath) {
    valuesArray.push({
      propertyId: "695c928dc9ba83a076aac6cd",
      key: "attachment",
      value: [attachmentPath],
    });
  }

  // jobTitle - value assumed from caller or fixed, change as needed
  valuesArray.push({
    propertyId: "6960ab8ec9ba83a076aac883",
    key: "jobTitle",
    value: jobId ?? "", // This should be the jobTitle propertyId or value, update as needed
  });

  // jobID
  valuesArray.push({
    propertyId: "69632938c9ba83a076aac901",
    key: "jobID",
    value: jobId,
  });

  // Build propertyIds array (order must match the values doc in prompt, attachments/jobTitle might be missing if not provided)
  const propertyIds = [
    "695259a6c9ba83a076aac433",
    "695766c0c9ba83a076aac598",
    "695c91fec9ba83a076aac6c8",
    "695c9244c9ba83a076aac6c9",
    "695c9276c9ba83a076aac6ca",
    "695c928dc9ba83a076aac6cd",
    "6960ab8ec9ba83a076aac883",
    "69632938c9ba83a076aac901",
  ];

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
    formId: formId,
  };
};

export const transformApplicantToUpdatePayload = (
  values: ApplicantForm,
  dirtyFields: Partial<Record<keyof ApplicantForm, boolean | any>>,
  attachmentPath?: string
) => {
  const valuesArray: any[] = [];
  const propertyIds: string[] = [];

  // Helper to check if a field is touched
  const isDirty = (field: keyof ApplicantForm) => {
    return dirtyFields[field] === true;
  };

  // Name
  if (isDirty("name")) {
    valuesArray.push({
      propertyId: "695c91fec9ba83a076aac6c8",
      key: "name",
      value: values.name || "",
    });
    propertyIds.push("695c91fec9ba83a076aac6c8");
  }

  // Email
  if (isDirty("email")) {
    valuesArray.push({
      propertyId: "695c9244c9ba83a076aac6c9",
      key: "email",
      value: values.email || "",
    });
    propertyIds.push("695c9244c9ba83a076aac6c9");
  }

  // Contact/Phone
  if (isDirty("contact")) {
    valuesArray.push({
      propertyId: "695c9276c9ba83a076aac6ca",
      key: "phone",
      value: values.contact || "",
    });
    propertyIds.push("695c9276c9ba83a076aac6ca");
  }

  // Attachment
  if (isDirty("attachment") && attachmentPath) {
    valuesArray.push({
      propertyId: "695c928dc9ba83a076aac6cd",
      key: "attachment",
      value: [attachmentPath],
    });
    propertyIds.push("695c928dc9ba83a076aac6cd");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};

export const transformAPIRoundItemToRound = (item: APIJobItem): Round => {
  // Map all values for fast-access
  const valuesMap = new Map<string, any>();
  if (Array.isArray(item?.values)) {
    item?.values?.forEach((val) => {
      if (val && val.key !== undefined) {
        valuesMap.set(val.key, val.value);
      }
    });
  }

  // Get skills from nested array if present
  let skills: string[] = [];
  const skillsRaw = valuesMap.get("_skillForRound") ?? [];
  if (Array.isArray(skillsRaw) && skillsRaw.length > 0) {
    // skillsRaw is a nested array [[{key:"_skill_", value:"foo"}]]
    skills = skillsRaw
      .flat()
      .filter(
        (s: any) => s && s.key === "_skill_" && typeof s.value === "string"
      )
      .map((s: any) => s.value);
  }

  // Compose customQuestionTexts from _questions key, if array
  let customQuestionTexts: string[] = [];
  const questionsRaw = valuesMap.get("_questions");
  if (Array.isArray(questionsRaw)) {
    // Each is an array of question objects
    customQuestionTexts = questionsRaw
      .map((qArr: any[]) =>
        Array.isArray(qArr)
          ? qArr.find((q) => q && q.key === "_question")?.value
          : undefined
      )
      .filter((text) => typeof text === "string");
  }

  // Compose interviewInstructions, handle fallback to ""
  const interviewInstructions = valuesMap.get("interviewInstructions") ?? "";

  // Compose applicants, fallback to 0
  const applicants = 0; // Replace with data if available

  const numOfAiQuestions = valuesMap.get("numOfAiQuestions") ?? 0;
  const numOfCustomQuestions = valuesMap.get("numOfCustomQuestions") ?? 0;
  const totalQuestions =
    Number(numOfAiQuestions) + Number(numOfCustomQuestions);
  const interviewerID = valuesMap.get(" interviewerID") ?? "";

  // Returned object conforms to the Round interface in job.interface.ts
  return {
    id: String(item?.id || ""),
    name: String(valuesMap.get("roundName") || ""),
    type: String(valuesMap.get("roundType") || ""),
    objective: String(valuesMap.get("roundObjective") || ""),
    language: String(valuesMap.get("language") || ""),
    interviewer: String(valuesMap.get("interviewerName") || ""),
    skills: skills,
    questionType: String(valuesMap.get("questionsType") || ""),
    aiGeneratedQuestions: Number(numOfAiQuestions),
    customQuestions: Number(numOfCustomQuestions),
    customQuestionTexts,
    interviewInstructions: String(interviewInstructions),
    allowSkip: Boolean(valuesMap.get("allowSkip")),
    sendReminder: Boolean(valuesMap.get("sendReminder")),
    reminderTime: String(valuesMap.get("reminderTime") || ""),
    duration: String(valuesMap.get("duration") || ""),
    applicants: Number(applicants),
    totalQuestions: Number(totalQuestions),
    interviewerID: String(interviewerID),
    created: formatRelativeTime(item.createdOn),
  };
};

export const transformAPIResponseToRounds = (
  data: APIJobItem[],
  pagination?: APIPaginationInfo
): { rounds: Round[]; pagination: APIPaginationInfo } => {
  if (!Array.isArray(data)) {
    return {
      rounds: [],
      pagination: {
        total: [0],
        nextOffset: null,
        previousOffset: null,
        limit: 10,
      },
    };
  }

  const rounds = data.map((item) => transformAPIRoundItemToRound(item));

  return {
    rounds,
    pagination: pagination || {
      total: [rounds.length],
      nextOffset: null,
      previousOffset: null,
      limit: 10,
    },
  };
};
