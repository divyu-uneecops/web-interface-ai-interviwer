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
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.JOB_OPENING.LIST,
      params,
      payload,
      signal
    ),
  deleteJobOpening: (id: string) =>
    serverInterfaceService.delete(
      buildUrl(API_ENDPOINTS.JOB_OPENING.DELETE, { id })
    ),
  getJobDetail: (
    id: string,
    params?: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.get(
      buildUrl(API_ENDPOINTS.JOB_OPENING.DETAIL, { id }),
      params,
      signal
    ),
  updateJobOpening: (
    id: string,
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.put(
      buildUrl(API_ENDPOINTS.JOB_OPENING.UPDATE, { id }),
      { ...payload, ...params }
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
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      API_ENDPOINTS.APPLICANT.LIST,
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
      buildUrl("/objects/69521d7dc9ba83a076aac3c8/records/{id}", { id }),
      payload
    ),
  getRounds: (
    params: Record<string, any>,
    payload: Record<string, any>,
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post(
      "/objects/69521d61c9ba83a076aac3c0/views/69521d61c9ba83a076aac3c1/records",
      params,
      payload,
      signal
    ),
};
