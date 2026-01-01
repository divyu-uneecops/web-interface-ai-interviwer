import { JobFormData, Job } from "../interfaces/job.interface";

// API Response Types
interface APIJobValue {
  propertyId: string;
  key: string;
  value: any;
}

interface APIJobItem {
  values: APIJobValue[];
  createdOn: number;
  updatedOn: number;
  id: string;
}

interface APIPaginationInfo {
  total: number;
  nextOffset: number | null;
  previousOffset: number | null;
  limit: number;
}

export interface JobsWithPagination {
  jobs: Job[];
  pagination: APIPaginationInfo;
}

// Transform API response to Job format
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

  const jobs = data.map((item) => {
    // Create a map of values for easy lookup
    const valuesMap = new Map<string, any>();
    if (Array.isArray(item.values)) {
      item.values.forEach((val) => {
        if (val && val.key) {
          valuesMap.set(val.key, val.value);
        }
      });
    }

    // Extract values with fallbacks
    const title = valuesMap.get("title") || "";
    const status = valuesMap.get("status") || "Draft";
    const numOfOpenings = valuesMap.get("numOfOpenings") || 0;
    const createdOn = item.createdOn || Date.now();

    // Normalize status to lowercase
    const statusLower = String(status).toLowerCase();
    const normalizedStatus =
      statusLower === "active"
        ? "active"
        : statusLower === "closed"
        ? "closed"
        : "draft";

    // Parse number of openings
    let noOfOpening = 0;
    if (typeof numOfOpenings === "number") {
      noOfOpening = numOfOpenings;
    } else if (typeof numOfOpenings === "string") {
      noOfOpening = parseInt(numOfOpenings, 10) || 0;
    }

    return {
      id: item.id || `job-${Date.now()}-${Math.random()}`,
      position: String(title),
      status: normalizedStatus as "active" | "draft" | "closed",
      noOfOpening,
      applicants: 0, // Not available in API response
      interviews: 0, // Not available in API response
      created: formatRelativeTime(createdOn),
    };
  });

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

// Mapping functions for API format
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

// Transform form data to API payload format
export const transformToAPIPayload = (values: JobFormData) => {
  // Generate a unique jobId (you might want to get this from the backend)
  const jobId = Math.floor(Math.random() * 1000) + 100;

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

// Formik validation function
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

  console.log(errors);
  return errors;
};
