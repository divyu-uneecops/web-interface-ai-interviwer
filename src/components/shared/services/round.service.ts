import { API_ENDPOINTS } from "@/lib/constant";
import { buildUrl } from "@/lib/utils";
import serverInterfaceService from "../../../services/server-interface.service";

export const roundService = {
  createRound: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.CREATE_ROUND.CREATE,
      params,
      payload,
      signal
    ),
  updateRound: (
    urlIds: { id: string; objectId: string },
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.patch(
      buildUrl(API_ENDPOINTS.CREATE_ROUND.UPDATE, urlIds),
      payload
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
};
