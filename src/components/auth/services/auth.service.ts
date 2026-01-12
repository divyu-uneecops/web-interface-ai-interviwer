import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";

export const authService = {
  verifyEmail: (parmas: Record<string, any>) =>
    serverInterfaceService.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL, parmas),
};
