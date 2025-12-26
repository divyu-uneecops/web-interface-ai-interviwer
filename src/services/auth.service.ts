import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "./server-interface.service";

export const authService = {
  login: (user: { name: string; email: string }) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.LOGIN, user),
  register: (payload: { phone: string }) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.REGISTER, payload),
  verifyOtp: (payload: any) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload),
  resendOtp: () => serverInterfaceService.post("/auth/resend-otp"),
  forgotPassword: (payload: any) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.RESEND_OTP, payload),
  verifyForgotPasswordOtp: (payload: any) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload),
  resetPassword: (payload: any) =>
    serverInterfaceService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload),
};
