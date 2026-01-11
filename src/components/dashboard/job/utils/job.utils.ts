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
  const jobId = valuesMap.get("jobId") || "";
  const title = valuesMap.get("title") || "";
  const industry = valuesMap.get("industry") || "";
  const jobLevel = valuesMap.get("jobLevel") || "";
  const jobType = valuesMap.get("jobType") || "";
  const minExp = valuesMap.get("minExp") ?? 0;
  const maxExp = valuesMap.get("maxExp") ?? 0;
  const description = valuesMap.get("description") || "";
  const numOfOpenings = valuesMap.get("numOfOpenings") ?? 0;
  const status = valuesMap.get("status") || "draft";
  const accessibility = valuesMap.get("accessibility") || "";
  const formUser = valuesMap.get("formUser") || "";
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

  let normalizedStatus: "active" | "draft" | "closed" =
    typeof status === "string"
      ? status.toLowerCase() === "active"
        ? "active"
        : status.toLowerCase() === "closed"
        ? "closed"
        : "draft"
      : "draft";

  // createdOn default
  const createdOnRaw = item.createdOn;

  return {
    id: String(item?.id || ""),
    jobId: String(jobId),
    title: String(title),
    status: normalizedStatus,
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
    formUser: formUser[0] || "",
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
        total: 0,
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
      total: jobs.length,
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
      jobId: "",
      title: "",
      status: "draft",
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
      formUser: "",
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
  const jobId = fieldsMap.get("jobId") || "";
  const title = fieldsMap.get("title") || "";
  const industry = fieldsMap.get("industry") || "";
  const jobLevel = fieldsMap.get("jobLevel") || "";
  const jobType = fieldsMap.get("jobType") || "";
  const minExp = fieldsMap.get("minExp") ?? 0;
  const maxExp = fieldsMap.get("maxExp") ?? 0;
  const description = fieldsMap.get("description") || "";
  const numOfOpenings = fieldsMap.get("numOfOpenings") ?? 0;
  const status = fieldsMap.get("status") || "draft";
  const accessibility = fieldsMap.get("accessibility") || "";
  const formUser = fieldsMap.get("formUser") || "";
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

  let normalizedStatus: "active" | "draft" | "closed" =
    typeof status === "string"
      ? status.toLowerCase() === "active"
        ? "active"
        : status.toLowerCase() === "closed"
        ? "closed"
        : "draft"
      : "draft";

  // createdOn default
  const createdOnRaw = 1767074863801;

  return {
    id: String(id || ""),
    jobId: String(jobId),
    title: String(title),
    status: normalizedStatus,
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
    formUser: formUser[0] || "",
    requiredSkills,
    createdOn: formatRelativeTime(createdOnRaw),
  };
};

export const transformToAPIPayload = (values: JobFormData) => {
  // Transform skills to API format (array of arrays)
  const requiredSkills = (values.skills || []).map((skill) => [
    {
      propertyId: "695259b2c9ba83a076aac434",
      key: "skill",
      value: skill,
    },
  ]);

  const valuesArray = [
    {
      propertyId: "69525644c9ba83a076aac414",
      key: "title",
      value: values?.title,
    },
    {
      propertyId: "695257bfc9ba83a076aac41c",
      key: "industry",
      value: values?.industry,
    },
    {
      propertyId: "695257f8c9ba83a076aac41f",
      key: "jobLevel",
      value: values?.jobLevel,
    },
    {
      propertyId: "69525830c9ba83a076aac422",
      key: "jobType",
      value: values?.jobType,
    },
    {
      propertyId: "69525880c9ba83a076aac425",
      key: "minExp",
      value: values?.minExperience,
    },
    {
      propertyId: "69525898c9ba83a076aac427",
      key: "maxExp",
      value: values?.maxExperience,
    },
    {
      propertyId: "695258ccc9ba83a076aac42a",
      key: "description",
      value: values?.description,
    },
    {
      propertyId: "695258e5c9ba83a076aac42c",
      key: "numOfOpenings",
      value: values?.noOfOpenings,
    },
    {
      propertyId: "6952595cc9ba83a076aac431",
      key: "status",
      value: values?.status,
    },
    {
      propertyId: "6952598ec9ba83a076aac432",
      key: "accessibility",
      value: "Private", // TODO: change in future if needed
    },
    {
      propertyId: "695259d0c9ba83a076aac435",
      key: "requiredSkills",
      value: requiredSkills,
    },
    {
      propertyId: "6957547fc9ba83a076aac57c",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"], // TODO: change in future if needed
    },
  ];

  return {
    values: valuesArray,
    propertyIds: [
      "69525644c9ba83a076aac414",
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
    flows: [
      {
        stageId: "1",
        status: "PENDING",
      },
    ],
    status: "PENDING",
    formId: "69521d4cc9ba83a076aac3bb",
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

export const validate = (values: JobFormData) => {
  const errors: Partial<Record<keyof JobFormData, string>> = {};

  if (!values.title || values.title.trim() === "") {
    errors.title = "Job title is required";
  }

  if (!values.minExperience) {
    errors.minExperience = "Min experience is required";
  }

  if (!values.maxExperience) {
    errors.maxExperience = "Max experience is required";
  }

  if (values.minExperience && values.maxExperience) {
    const minExp = values.minExperience;
    const maxExp = values.maxExperience;
    if (minExp > maxExp) {
      errors.maxExperience =
        "Max experience must be greater than or equal to min experience";
    }
  }

  if (!values.description || values.description.trim() === "") {
    errors.description = "Job description is required";
  }

  if (!values.status) {
    errors.status = "Job status is required";
  }

  if (!values.skills || values.skills.length === 0) {
    errors.skills = "At least one skill is required";
  }

  return errors;
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
  const createdOnRaw = item.createdOn;

  // Normalize status
  let normalizedStatus: ApplicantStatus = "Applied";
  if (typeof status === "string") {
    const statusLower = status.toLowerCase();
    if (statusLower === "interviewed") {
      normalizedStatus = "Interviewed";
    } else if (statusLower === "rejected") {
      normalizedStatus = "Rejected";
    } else {
      normalizedStatus = "Applied";
    }
  }

  return {
    id: String(item?.id || ""),
    name: String(name),
    email: String(email),
    contact: String(contact),
    status: normalizedStatus,
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
        total: 0,
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
      total: applicants.length,
      nextOffset: null,
      previousOffset: null,
      limit: 10,
    },
  };
};

export const transformApplicantToAPIPayload = (
  values: ApplicantForm,
  jobId: string,
  attachmentPath?: string
) => {
  // Generate applicantId (you may want to use a proper ID generation method)
  const applicantId = Math.floor(Math.random() * 1000) + 1;

  const valuesArray = [
    {
      propertyId: "69525912c9ba83a076aac42d",
      key: "applicantId",
      value: String(applicantId),
    },
    {
      propertyId: "69525952c9ba83a076aac430",
      key: "jobId",
      value: jobId,
    },
    {
      propertyId: "695259a6c9ba83a076aac433",
      key: "status",
      value: "Applied",
    },
    {
      propertyId: "695766c0c9ba83a076aac598",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"],
      //TODO: Needs to Change in future
    },
    {
      propertyId: "695c91fec9ba83a076aac6c8",
      key: "name",
      value: values.name,
    },
    {
      propertyId: "695c9244c9ba83a076aac6c9",
      key: "email",
      value: values.email,
    },
    {
      propertyId: "695c9276c9ba83a076aac6ca",
      key: "phone",
      value: values.contact,
    },
  ];

  // Add attachment if provided
  if (attachmentPath) {
    valuesArray.push({
      propertyId: "695c928dc9ba83a076aac6cd",
      key: "attachment",
      value: [`695c928dc9ba83a076aac6cd//${attachmentPath}`],
    });
  }

  const propertyIds = [
    "69525912c9ba83a076aac42d",
    "69525952c9ba83a076aac430",
    "695259a6c9ba83a076aac433",
    "695259a6c9ba83a076aac433",
    "695766c0c9ba83a076aac598",
    "695c91fec9ba83a076aac6c8",
    "695c9244c9ba83a076aac6c9",
    "695c9276c9ba83a076aac6ca",
  ];

  return {
    values: valuesArray,
    propertyIds: propertyIds,
    flows: [
      {
        stageId: "1",
        status: "PENDING",
      },
    ],
    status: "PENDING",
    formId: "69521d7dc9ba83a076aac3cb",
  };
};

export const transformApplicantToUpdatePayload = (
  values: ApplicantForm,
  touched?: any,
  attachmentPath?: string,
  status?: string
) => {
  const valuesArray: any[] = [];
  const propertyIds: string[] = [];

  // Helper to check if a field is touched
  const isTouched = (field: string) => {
    if (!touched) return true; // If no touched object provided, include all fields
    return touched[field] === true;
  };

  // Status (if provided)
  if (status) {
    valuesArray.push({
      propertyId: "695259a6c9ba83a076aac433",
      key: "status",
      value: status,
    });
    propertyIds.push("695259a6c9ba83a076aac433");
  }

  // Name
  if (isTouched("name")) {
    valuesArray.push({
      propertyId: "695c91fec9ba83a076aac6c8",
      key: "name",
      value: values.name || "",
    });
    propertyIds.push("695c91fec9ba83a076aac6c8");
  }

  // Email
  if (isTouched("email")) {
    valuesArray.push({
      propertyId: "695c9244c9ba83a076aac6c9",
      key: "email",
      value: values.email || "",
    });
    propertyIds.push("695c9244c9ba83a076aac6c9");
  }

  // Contact/Phone
  if (isTouched("contact")) {
    valuesArray.push({
      propertyId: "695c9276c9ba83a076aac6ca",
      key: "phone",
      value: values.contact || "",
    });
    propertyIds.push("695c9276c9ba83a076aac6ca");
  }

  // Attachment
  if (isTouched("attachment") && attachmentPath) {
    valuesArray.push({
      propertyId: "695c928dc9ba83a076aac6cd",
      key: "attachment",
      value: [`attachment//${attachmentPath}`],
    });
    propertyIds.push("695c928dc9ba83a076aac6cd");
  }

  return {
    values: valuesArray,
    propertyIds,
  };
};

export const transformAPIRoundItemToRound = (item: APIJobItem): Round => {
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
  const roundName = valuesMap.get("roundName") || "";
  const duration = valuesMap.get("duration") || "";
  const numOfAiQuestions = valuesMap.get("numOfAiQuestions") || 0;
  const numOfCustomQuestions = valuesMap.get("numOfCustomQuestions") || 0;
  const questions = numOfAiQuestions + numOfCustomQuestions;
  const applicants = 0; // TODO: Get from API if available
  const createdOnRaw = item.createdOn;

  return {
    id: String(item?.id || ""),
    name: String(roundName),
    duration: String(duration),
    questions: Number(questions),
    applicants: Number(applicants),
    created: formatRelativeTime(createdOnRaw),
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
        total: 0,
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
      total: rounds.length,
      nextOffset: null,
      previousOffset: null,
      limit: 10,
    },
  };
};
