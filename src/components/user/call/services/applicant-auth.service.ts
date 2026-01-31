import serverInterfaceService from "@/services/server-interface.service";
import {
  StartInterviewPayload,
  StartInterviewResponse,
} from "../interfaces/applicant-auth.interface";

export const applicantAuthService = {
  startInterviewAPI: (
    payload: StartInterviewPayload,
  ): Promise<StartInterviewResponse> =>
    serverInterfaceService.post<StartInterviewResponse>(
      "http://localhost:8021/api/start-interview",
      {},
      {
        email: payload.email,
        interviewId: payload.interviewId,
      },
    ),
};
