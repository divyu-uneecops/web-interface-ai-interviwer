import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "../../../../services/server-interface.service";
import { buildUrl } from "@/lib/utils";

export const interviewerService = {
  createInterviewer: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.INTERVIEWER.CREATE,
      params,
      payload,
      signal
    ),
  getInterviewers: (
    params: Record<string, any>,
    payload: Record<string, any>,
    urlIds: { objectId: string; viewId: string },
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      buildUrl(API_ENDPOINTS.INTERVIEWER.LIST, urlIds),
      params,
      payload,
      signal
    ),
  updateInterviewer: (
    urlIds: { id: string; objectId: string },
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.patch(
      buildUrl(API_ENDPOINTS.INTERVIEWER.UPDATE, urlIds),
      payload
    ),
};
