import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { buildUrl } from "@/lib/utils";

const ORG_ID = "69521ba88ecab90ed22cbcd9";

export const fetchRoles = createAsyncThunk(
  "userManagement/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverInterfaceService.get(
        buildUrl(API_ENDPOINTS.USER.ROLES_LIST, {
          orgId: ORG_ID,
        }),
        {
          limit: 100000,
          offset: 0,
        }
      );
      // Extract options for jobLevel, industry, and jobType fields

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch Form Properties"
      );
    }
  }
);
