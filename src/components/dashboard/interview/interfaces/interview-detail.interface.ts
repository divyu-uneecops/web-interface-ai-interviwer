export interface CriteriaScore {
  name: string;
  score: number;
  description: string;
  industryAverage: number;
}

export interface InterviewFeedback {
  strengths: string[];
  areasForGrowth: string[];
}

export interface TranscriptItem {
  question: string;
  response: string;
  duration: string; // Format: "00:02:35"
  status?: "completed" | "skipped" | "timeout";
}

export interface InterviewDetailData {
  overallScore: number;
  grade: string;
  recommendation: string;
  percentile: string;
  criteriaScores: CriteriaScore[];
  feedback: InterviewFeedback;
  transcript: TranscriptItem[];
}
