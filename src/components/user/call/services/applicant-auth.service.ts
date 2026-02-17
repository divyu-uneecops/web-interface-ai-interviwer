import serverInterfaceService from "@/services/server-interface.service";
import { API_ENDPOINTS } from "@/lib/constant";
import {
  StartInterviewPayload,
  StartInterviewResponse,
} from "../interfaces/applicant-auth.interface";
import { buildUrl } from "@/lib/utils";

export interface FeedbackFormInstancePayload {
  values: Array<{
    propertyId: string;
    key: string;
    value: string | number | any[];
  }>;
  propertyIds: string[];
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
    payload: FeedbackFormInstancePayload,
    urlIds: { objectId: string }
  ): Promise<{ message?: string }> =>
    serverInterfaceService.post<{ message?: string }>(
      buildUrl(API_ENDPOINTS.FEEDBACK.SAVE, urlIds),
      {},
      payload
    ),
  /** Submit penalty/event form instance (e.g. exit fullscreen, face validation events) to /api/v2/forminstances */
  submitPenaltyFormInstance: (
    payload: FeedbackFormInstancePayload,
    urlIds: { objectId: string }
  ): Promise<{ message?: string }> =>
    serverInterfaceService.post<{ message?: string }>(
      buildUrl(API_ENDPOINTS.INTERVIEW_PENALTY.CREATE, urlIds),
      {},
      payload
    ),
  /** Get S3 presigned POST data for penalty screenshot upload (same pattern as applicant attachment) */
  getPenaltyScreenshotUploadUrl: (payload: { name: string; size: number }) =>
    serverInterfaceService.post<{
      url?: string;
      fields?: Record<string, string>;
    }>(API_ENDPOINTS.INTERVIEW_PENALTY.UPLOAD, {}, payload),
  /** Upload penalty screenshot file to S3 using presigned URL */
  uploadPenaltyScreenshotToS3: (
    url: string,
    formData: FormData,
    signal?: AbortSignal
  ) => serverInterfaceService.postFormData(url, formData, true, signal),
};
