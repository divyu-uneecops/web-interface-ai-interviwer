import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "../../../../services/server-interface.service";
import { buildUrl } from "@/lib/utils";

export const jobService = {
  createJobOpening: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.JOB_OPENING.CREATE,
      params,
      payload,
      signal
    ),
  getJobOpenings: (
    params: Record<string, any>,
    payload: Record<string, any>,
    urlIds: { objectId: string; viewId: string },
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      buildUrl(API_ENDPOINTS.JOB_OPENING.LIST, urlIds),
      params,
      payload,
      signal
    ),
  deleteJobOpening: (urlIds: { id: string; objectId: string }) =>
    serverInterfaceService.delete(
      buildUrl(API_ENDPOINTS.JOB_OPENING.DELETE, urlIds)
    ),
  getJobDetail: (
    urlIds: { id: string; objectId: string },
    params?: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.get(
      buildUrl(API_ENDPOINTS.JOB_OPENING.DETAIL, urlIds),
      params,
      signal
    ),
  updateJobOpening: (
    urlIds: { id: string; objectId: string },
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.patch(
      buildUrl(API_ENDPOINTS.JOB_OPENING.UPDATE, urlIds),
      payload
    ),
  createApplicant: (payload: Record<string, any>, signal?: AbortSignal) =>
    serverInterfaceService.post(
      API_ENDPOINTS.APPLICANT.CREATE,
      {},
      payload,
      signal
    ),
  getApplicants: (
    params: Record<string, any>,
    payload: Record<string, any>,
    urlIds: { objectId: string; viewId: string },
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      buildUrl(API_ENDPOINTS.APPLICANT.LIST, urlIds),
      params,
      payload,
      signal
    ),
  deleteApplicant: (id: string) =>
    serverInterfaceService.delete(
      buildUrl(API_ENDPOINTS.APPLICANT.DELETE, { id })
    ),
  updateApplicant: (
    id: string,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.patch(
      buildUrl(API_ENDPOINTS.APPLICANT.UPDATE, { id }),
      payload
    ),
  createInterviewFormInstance: (
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.INTERVIEW.CREATE,
      {},
      payload,
      signal
    ),
  getInterviews: (
    params: Record<string, any>,
    payload: Record<string, any>,
    urlIds: { objectId: string; viewId: string },
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      buildUrl(API_ENDPOINTS.INTERVIEW.LIST, urlIds),
      params,
      payload,
      signal
    ),
  getRounds: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.CREATE_ROUND.LIST,
      params,
      payload,
      signal
    ),
  deleteRound: (id: string) =>
    serverInterfaceService.delete(
      buildUrl(API_ENDPOINTS.CREATE_ROUND.DELETE, { id })
    ),
  uploadApplicantAttachment: (
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.APPLICANT.UPLOAD_ATTACHMENT,
      {},
      payload,
      signal
    ),
  downloadApplicantAttachment: (name: string) =>
    serverInterfaceService.get(API_ENDPOINTS.APPLICANT.DOWNLOAD_ATTACHMENT, {
      name: name,
    }),
  uploadApplicantAttachmentToS3: (
    url: string,
    formData: FormData,
    signal?: AbortSignal
  ) => serverInterfaceService.postFormData(url, formData, true, signal),
};
