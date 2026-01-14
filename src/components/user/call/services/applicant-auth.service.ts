/**
 * Applicant authentication service
 */

import serverInterfaceService from "@/services/server-interface.service";
import { API_ENDPOINTS } from "@/lib/constant";
import {
  ApplicantAuthRequest,
  ApplicantAuthResponse,
} from "../interfaces/applicant-auth.interface";

export const applicantAuthService = {
  /**
   * Verify if applicant is authenticated for the interview
   */
  verifyApplicantForInterview: async (
    interviewId: string,
    applicantData: ApplicantAuthRequest
  ): Promise<ApplicantAuthResponse> => {
    const endpoint = API_ENDPOINTS.INTERVIEW.VERIFY_APPLICANT.replace(
      "{id}",
      interviewId
    );

    try {
      const response = await serverInterfaceService.post<ApplicantAuthResponse>(
        endpoint,
        undefined,
        applicantData
      );

      return response;
    } catch (error: any) {
      // Re-throw the error to be handled by the component
      throw error;
    }
  },
};
