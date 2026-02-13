import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";

export const authService = {
  verifyEmail: (parmas: Record<string, any>) =>
    serverInterfaceService.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL, parmas),
  login: (payload: any) =>
    serverInterfaceService.postFormData(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
      false
    ),
  register: (payload: FormData) =>
    serverInterfaceService.postFormData(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
      false
    ),
  verifyOtp: (payload: { identifier: string; otp: string }) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.VERIFY_OTP, undefined, payload),
  resendOtp: (payload: { identifier: string }) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.RESEND_OTP, undefined, payload),
};
