import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "../../../../services/server-interface.service";
import { buildUrl } from "@/lib/utils";

export const interviewService = {
  createInterview: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.INTERVIEW?.CREATE || "/objects/interviews/records",
      params,
      payload,
      signal
    ),
  getInterviews: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.INTERVIEW?.LIST || "/objects/interviews/records/list",
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
  updateInterview: (
    id: string,
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.put(
      buildUrl(
        API_ENDPOINTS.INTERVIEW?.UPDATE || "/objects/interviews/records/{id}",
        { id }
      ),
      { ...payload, ...params }
    ),
  deleteInterview: (id: string) =>
    serverInterfaceService.delete(
      buildUrl(
        API_ENDPOINTS.INTERVIEW?.DELETE || "/objects/interviews/records/{id}",
        { id }
      )
    ),
  cancelInterview: (
    id: string,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.patch(
      buildUrl(
        API_ENDPOINTS.INTERVIEW?.CANCEL ||
          "/objects/interviews/records/{id}/cancel",
        { id }
      ),
      payload,
      signal
    ),
};
