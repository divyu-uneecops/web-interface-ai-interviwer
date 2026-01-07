import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "../../../../services/server-interface.service";

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
};
