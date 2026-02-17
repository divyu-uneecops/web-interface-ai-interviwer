import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";
import { buildUrl } from "@/lib/utils";

const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "";
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "";

export const userService = {
  getUsers: (params?: Record<string, any>, signal?: AbortSignal) =>
    serverInterfaceService.get<{
      data: Array<{
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: { number: string; countryCode: string };
        userId?: string;
        appRoles?: string[];
      }>;
      page: { limit: number; total: number };
    }>(
      buildUrl(API_ENDPOINTS.USER.LIST, { orgId: ORG_ID, appId: APP_ID }),
      params,
      signal
    ),

  inviteUsers: (
    payload: { roleIds: string[]; emails: string[] },
    signal?: AbortSignal
  ) =>
    serverInterfaceService.post<unknown>(
      buildUrl(API_ENDPOINTS.USER.INVITE, { orgId: ORG_ID }),
      {},
      payload,
      signal
    ),
};
