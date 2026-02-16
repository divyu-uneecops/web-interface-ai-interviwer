import {
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
  const interviews = data.map((item) => {
    const valuesMap: Record<string, any> = {};
    item.values.forEach((val) => {
      valuesMap[val.key] = val.value;
    });

    const formUser = valuesMap.formUser?.[0]?.name || "N/A";

    // Normalize status
    const statusValue = valuesMap.status;

    return {
      id: item.id,
      candidateName: formUser,
      candidateEmail: valuesMap.applicantEmail || "N/A",
      jobTitle: valuesMap.jobTitle || "N/A",
      interviewerName: valuesMap.interviewerName || "N/A",
      status: statusValue,
      interviewDate: "",
      roundName: valuesMap.roundName || "N/A",
      score:
        valuesMap.score !== undefined && valuesMap.score !== null
          ? valuesMap.score
          : undefined,
    };
  });

  return {
    interviews,
    pagination: pageInfo,
  };
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
