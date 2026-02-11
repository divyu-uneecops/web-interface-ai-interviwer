import serverInterfaceService from "@/services/server-interface.service";
import { API_ENDPOINTS } from "@/lib/constant";
import {
  StartInterviewPayload,
  StartInterviewResponse,
} from "../interfaces/applicant-auth.interface";

export interface FeedbackFormInstancePayload {
  values: Array<{ propertyId: string; key: string; value: string | number }>;
  propertyIds: string[];
  flows: Array<{ stageId: string; status: string }>;
  status: string;
  formId: string;
}

export const applicantAuthService = {
  startInterviewAPI: (
    payload: StartInterviewPayload
  ): Promise<StartInterviewResponse> =>
    serverInterfaceService.post<StartInterviewResponse>(
      "http://localhost:8021/api/start-interview",
      {},
      {
        email: payload.email,
        interviewId: payload.interviewId,
      }
    ),
  submitFeedbackFormInstance: (
    payload: FeedbackFormInstancePayload
  ): Promise<{ message?: string }> =>
    serverInterfaceService.post<{ message?: string }>(
      API_ENDPOINTS.FEEDBACK.SAVE,
      {},
      payload
    ),
  /** Submit penalty/event form instance (e.g. exit fullscreen, face validation events) to /api/v2/forminstances */
  submitPenaltyFormInstance: (
    payload: FeedbackFormInstancePayload
  ): Promise<{ message?: string }> =>
    serverInterfaceService.post<{ message?: string }>(
      API_ENDPOINTS.INTERVIEW_PENALTY.CREATE,
      {},
      payload
    ),
};
