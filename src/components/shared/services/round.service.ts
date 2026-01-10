import { API_ENDPOINTS } from "@/lib/constant";
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
};
