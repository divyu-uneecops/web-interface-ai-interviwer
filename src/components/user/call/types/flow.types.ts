export type InterviewFlowState =
  | "auth"
  | "guidelines"
  | "verification-instructions"
  | "verification-ready"
  | "verification-recording"
  | "verification-completed"
  | "interview-tips"
  | "interview-active"
  | "interview-complete";

export interface ChecklistItems {
  camera: boolean;
  microphone: boolean;
  connection: boolean;
  environment: boolean;
}

export interface FlowStateProps {
  onStateChange: (state: InterviewFlowState) => void;
  applicantName?: string;
  companyName?: string;
}
