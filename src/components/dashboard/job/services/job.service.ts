import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "../../../../services/server-interface.service";

export const jobService = {
  createJobOpening: (payload: any) =>
    serverInterfaceService.post(API_ENDPOINTS.JOB_OPENING.CREATE, payload),
};
