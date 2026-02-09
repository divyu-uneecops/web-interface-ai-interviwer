import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";
import { buildUrl } from "@/lib/utils";

const ORG_ID = "69521ba88ecab90ed22cbcd9";
const APP_ID = "69521cd1c9ba83a076aac3ae";

/** Map form role value to API roleId */
export const ROLE_ID_MAP: Record<string, string> = {
  admin: "69521ba88ecab90ed22cbcda",
  member: "69521ba88ecab90ed22cbcda", // add another id when you have a distinct member role
};

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
      undefined,
      payload,
      signal
    ),
};
