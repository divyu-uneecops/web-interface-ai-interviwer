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
      "/objects/6960b980c9ba83a076aac89d/views/6960b980c9ba83a076aac89e/records",
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
