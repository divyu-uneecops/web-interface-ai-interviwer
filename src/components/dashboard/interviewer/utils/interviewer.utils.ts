import {
  Interviewer,
  InterviewerFormData,
} from "../interfaces/interviewer.interfaces";

export interface APIInterviewerValue {
  propertyId: string;
  key: string;
  value: any;
}

export interface APIInterviewerItem {
  values: APIInterviewerValue[];
  createdOn: number;
  updatedOn: number;
  id: string;
}

export interface APIPaginationInfo {
  total: number;
  nextOffset: number | null;
  previousOffset: number | null;
  limit: number;
}

export interface InterviewersWithPagination {
  interviewers: Interviewer[];
  pagination: APIPaginationInfo;
}

// Format timestamp to relative time (e.g., "2d ago", "1h ago")
const formatRelativeTime = (timestamp: number): string => {
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

export const transformAPIInterviewerItemToInterviewer = (
  item: APIInterviewerItem
): Interviewer => {
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
  const name = valuesMap.get("name") || "Unnamed Interviewer";
  const description = valuesMap.get("description") || "";
  const roundType = valuesMap.get("roundType") || "Behavioral";
  const voice = valuesMap.get("voice") || "Male";
  const avatar = valuesMap.get("avatar");

  // Determine image URL based on voice or avatar
  let imageUrl = "/interviewer-male.jpg"; // default
  if (voice === "Female") {
    imageUrl = "/interviewer-female.jpg";
  }

  // Format round type for display
  const formattedRoundType =
    roundType === "Behavioral"
      ? "Behavioural round"
      : roundType === "Technical"
      ? "Technical round"
      : roundType === "HR Round"
      ? "HR round"
      : roundType === "Screening"
      ? "Screening round"
      : `${roundType} round`;

  return {
    id: String(item?.id || ""),
    name: String(name),
    description: String(description),
    imageUrl,
    roundType: formattedRoundType,
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

export const transformToAPIPayload = (values: InterviewerFormData) => {
  // Generate interviewerId
  const interviewerId = Math.floor(Math.random() * 10000) + 10000;

  // Transform skills to API format (array of arrays)
  const interviewerSkills = values.skills
    .filter((skill: string) => skill.trim().length > 0)
    .map((skill: string) => [
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

  const valuesArray = [
    {
      propertyId: "69525606c9ba83a076aac411",
      key: "interviewerId",
      value: String(interviewerId),
    },
    {
      propertyId: "6952562ac9ba83a076aac413",
      key: "name",
      value: values.name || "",
    },
    {
      propertyId: "69525663c9ba83a076aac416",
      key: "description",
      value: values.description || "",
    },
    {
      propertyId: "695256aac9ba83a076aac418",
      key: "interviewerSkills",
      value: interviewerSkills || [],
    },
    {
      propertyId: "69525713c9ba83a076aac419",
      key: "roundType",
      value: values.roundType || "",
    },
    {
      propertyId: "6952577bc9ba83a076aac41a",
      key: "language",
      value: values.language || "",
    },
    {
      propertyId: "695257b4c9ba83a076aac41b",
      key: "voice",
      value: values.voice || "",
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
