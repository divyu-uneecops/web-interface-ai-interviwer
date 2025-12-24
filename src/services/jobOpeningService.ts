import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "./serverInterfaceService";

export const jobOpeningService = {
  createJobOpening: (payload: any) =>
    serverInterfaceService.post(API_ENDPOINTS.JOB_OPENING.CREATE, payload),
};
