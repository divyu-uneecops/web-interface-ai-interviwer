import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "../../../../services/server-interface.service";
import { buildUrl } from "@/lib/utils";

export const interviewService = {
  getInterviewsFromView: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.INTERVIEW.LIST,
      params,
      payload,
      signal
    ),
  getInterviewDetail: (
    id: string,
    params?: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.get(
      buildUrl(
        API_ENDPOINTS.INTERVIEW?.DETAIL || "/objects/interviews/records/{id}",
        { id }
      ),
      params,
      signal
    ),
};
