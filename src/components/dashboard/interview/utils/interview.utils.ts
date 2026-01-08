import {
  InterviewDetail,
  APIInterviewItem,
  APIPaginationInfo,
  InterviewsWithPagination,
} from "../interfaces/interview.interface";

/**
 * Transform API response to InterviewDetail format
 */
export function transformAPIResponseToInterviews(
  data: APIInterviewItem[],
  pageInfo: APIPaginationInfo
): InterviewsWithPagination {
  const interviews: InterviewDetail[] = data.map((item) => {
    const valuesMap: Record<string, any> = {};
    item.values.forEach((val) => {
      valuesMap[val.key] = val.value;
    });

    return {
      id: item.id,
      interviewId: valuesMap.interviewId || item.id,
      candidateName: valuesMap.candidateName || valuesMap.name || "N/A",
      candidateEmail: valuesMap.candidateEmail || valuesMap.email || "N/A",
      jobTitle: valuesMap.jobTitle || valuesMap.job?.title || "N/A",
      jobId: valuesMap.jobId || valuesMap.job?.id || "",
      interviewerName:
        valuesMap.interviewerName || valuesMap.interviewer?.name || "N/A",
      interviewerId: valuesMap.interviewerId || valuesMap.interviewer?.id || "",
      status: valuesMap.status || "pending",
      scheduledDate: valuesMap.scheduledDate || valuesMap.date || "",
      scheduledTime: valuesMap.scheduledTime || valuesMap.time || "",
      duration: valuesMap.duration || 30,
      roundName: valuesMap.roundName || valuesMap.round?.name || "N/A",
      roundId: valuesMap.roundId || valuesMap.round?.id || "",
      score: valuesMap.score,
      completedAt: valuesMap.completedAt,
      createdAt: formatDate(item.createdOn),
      updatedAt: formatDate(item.updatedOn),
      interviewLink: valuesMap.interviewLink,
      token: valuesMap.token,
    };
  });

  return {
    interviews,
    pagination: pageInfo,
  };
}

/**
 * Format timestamp to readable date string
 */
function formatDate(timestamp: number): string {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: string, time: string): string {
  if (!date || !time) return "N/A";
  try {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return `${date} ${time}`;
  }
}

/**
 * Get status badge text
 */
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    scheduled: "Scheduled",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    pending: "Pending",
  };
  return statusMap[status] || status;
}

/**
 * Format date as MM/DD/YYYY
 */
export function formatInterviewDate(date: string): string {
  if (!date) return "-";
  try {
    const dateObj = new Date(date);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return date;
  }
}
