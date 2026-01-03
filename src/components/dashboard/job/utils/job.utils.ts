import {
  JobFormData,
  Job,
  APIJobItem,
  APIPaginationInfo,
  JobsWithPagination,
  APIJobDetailSection,
  JobDetail,
} from "../interfaces/job.interface";

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

export const mapIndustryToAPI = (industry: string): string => {
  const industryMap: Record<string, string> = {
    engineering: "IT/Software",
    technical: "IT/Software",
    product: "Product",
    design: "Design",
    marketing: "Marketing",
    sales: "Sales",
    hr: "Human Resources",
  };
  return industryMap[industry] || "IT/Software";
};

export const mapJobLevelToAPI = (jobLevel: string): string => {
  const levelMap: Record<string, string> = {
    junior: "Entry",
    mid: "Mid",
    senior: "Senior",
    lead: "Lead",
    manager: "Manager",
    director: "Director",
  };
  return levelMap[jobLevel] || "Mid";
};

export const mapJobTypeToAPI = (jobType: string): string => {
  const typeMap: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    intern: "Intern",
  };
  return typeMap[jobType] || "Full-time";
};

export const mapStatusToAPI = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const transformToAPIPayload = (
  values: JobFormData,
  existingJobId?: string
) => {
  // Use existing jobId if provided (for edit), otherwise generate a new one
  const jobId = existingJobId || Math.floor(Math.random() * 1000) + 100;

  // Transform skills to API format
  const requiredSkills = values.skills.map((skill) => [
    {
      propertyId: "695259b2c9ba83a076aac434",
      key: "skill",
      value: skill,
    },
  ]);

  const valuesArray = [
    {
      propertyId: "69525619c9ba83a076aac412",
      key: "jobId",
      value: String(jobId),
    },
    {
      propertyId: "69525644c9ba83a076aac414",
      key: "title",
      value: values.title,
    },
    ...(values.industry
      ? [
          {
            propertyId: "695257bfc9ba83a076aac41c",
            key: "industry",
            value: mapIndustryToAPI(values.industry),
          },
        ]
      : []),
    ...(values.jobLevel
      ? [
          {
            propertyId: "695257f8c9ba83a076aac41f",
            key: "jobLevel",
            value: mapJobLevelToAPI(values.jobLevel),
          },
        ]
      : []),
    ...(values.jobType
      ? [
          {
            propertyId: "69525830c9ba83a076aac422",
            key: "jobType",
            value: mapJobTypeToAPI(values.jobType),
          },
        ]
      : []),
    {
      propertyId: "69525880c9ba83a076aac425",
      key: "minExp",
      value: parseFloat(values.minExperience) || 0,
    },
    {
      propertyId: "69525898c9ba83a076aac427",
      key: "maxExp",
      value: parseFloat(values.maxExperience) || 0,
    },
    {
      propertyId: "695258ccc9ba83a076aac42a",
      key: "description",
      value: values.description,
    },
    ...(values.noOfOpenings
      ? [
          {
            propertyId: "695258e5c9ba83a076aac42c",
            key: "numOfOpenings",
            value: parseInt(values.noOfOpenings) || 1,
          },
        ]
      : []),
    {
      propertyId: "6952595cc9ba83a076aac431",
      key: "status",
      value: mapStatusToAPI(values.status),
    },
    {
      propertyId: "6952598ec9ba83a076aac432",
      key: "accessibility",
      value: "Private",
    },
    {
      propertyId: "6957547fc9ba83a076aac57c",
      key: "formUser",
      value: ["6936a4d92276e3fc3ac7b13b"],
    },
    ...(values.skills.length > 0
      ? [
          {
            propertyId: "695259d0c9ba83a076aac435",
            key: "requiredSkills",
            value: requiredSkills,
          },
        ]
      : []),
  ];

  return {
    values: valuesArray,
    propertyIds: [
      "69525619c9ba83a076aac412",
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
    const minExp = parseInt(values.minExperience);
    const maxExp = parseInt(values.maxExperience);
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

// Reverse mapping functions for API to form data
export const mapIndustryFromAPI = (industry: string): string => {
  const industryMap: Record<string, string> = {
    "IT/Software": "technical",
    "it/software": "technical",
    Engineering: "engineering",
    engineering: "engineering",
    Product: "product",
    product: "product",
    Design: "design",
    design: "design",
    Marketing: "marketing",
    marketing: "marketing",
    Sales: "sales",
    sales: "sales",
    "Human Resources": "hr",
    "human resources": "hr",
    HR: "hr",
    hr: "hr",
  };
  return industryMap[industry] || "technical";
};

export const mapJobLevelFromAPI = (jobLevel: string): string => {
  const levelMap: Record<string, string> = {
    Entry: "junior",
    entry: "junior",
    Mid: "mid",
    mid: "mid",
    Senior: "senior",
    senior: "senior",
    Lead: "lead",
    lead: "lead",
    Manager: "manager",
    manager: "manager",
    Director: "director",
    director: "director",
  };
  return levelMap[jobLevel] || "mid";
};

export const mapJobTypeFromAPI = (jobType: string): string => {
  const typeMap: Record<string, string> = {
    "Full-time": "full-time",
    "full-time": "full-time",
    "Part-time": "part-time",
    "part-time": "part-time",
    Contract: "contract",
    contract: "contract",
    Intern: "intern",
    intern: "intern",
  };
  return typeMap[jobType] || "full-time";
};

export const mapStatusFromAPI = (status: string): string => {
  return status.toLowerCase();
};

// Transform JobDetail to JobFormData for edit mode
export const transformJobDetailToFormData = (
  jobDetail: JobDetail
): JobFormData => {
  return {
    title: jobDetail.title || "",
    industry: jobDetail.industry ? mapIndustryFromAPI(jobDetail.industry) : "",
    jobLevel: jobDetail.jobLevel ? mapJobLevelFromAPI(jobDetail.jobLevel) : "",
    jobType: jobDetail.type ? mapJobTypeFromAPI(jobDetail.type) : "",
    minExperience: jobDetail.minExp ? String(jobDetail.minExp) : "",
    maxExperience: jobDetail.maxExp ? String(jobDetail.maxExp) : "",
    description: jobDetail.description || "",
    noOfOpenings: jobDetail.numOfOpenings
      ? String(jobDetail.numOfOpenings)
      : "",
    attachment: null,
    status: jobDetail.status ? mapStatusFromAPI(jobDetail.status) : "",
    skills: jobDetail.skills || [],
  };
};
