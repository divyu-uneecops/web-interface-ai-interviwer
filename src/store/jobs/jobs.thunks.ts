import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFormProperties = createAsyncThunk(
  "jobs/fetchFormProperties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await serverInterfaceService.get(
        API_ENDPOINTS.JOB_OPENING.FORM_PROPERTIES
      );
      // Extract options for jobLevel, industry, and jobType fields
      if (!Array.isArray(res)) {
        throw new Error("Invalid form properties data format");
      }

      const targets = ["jobLevel", "industry", "jobType", "status"];
      const result: Record<string, any[]> = {};

      for (const section of res) {
        if (Array.isArray(section?.fields || [])) {
          for (const field of section?.fields || []) {
            if (targets.includes(field?.key || "")) {
              result[field?.key || ""] = Array.isArray(field?.options || [])
                ? field?.options
                : [];
            }
          }
        }
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch Form Properties"
      );
    }
  }
);
