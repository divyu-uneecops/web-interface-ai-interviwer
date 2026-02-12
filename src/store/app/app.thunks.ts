import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AppFormItem {
  name: string;
  appId: string;
  id: string;
}

/** e.g. { createRole: "69521d2fc9ba83a076aac3b3", createUser: "...", ... } */
export type AppFormIds = Record<string, string>;

function nameToKey(name: string): string {
  return (name || "")
    .trim()
    .split(/\s+/)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

function transformFormResponse(forms: AppFormItem[]): AppFormIds {
  const list = Array.isArray(forms) ? forms : [];
  const result: AppFormIds = {};
  for (const form of list) {
    if (form?.name != null && form?.id) {
      const key = nameToKey(form.name);
      if (key) result[key] = form.id;
    }
  }
  return result;
}

export const fetchForm = createAsyncThunk(
  "app/fetchForm",
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverInterfaceService.get<AppFormItem[]>(
        API_ENDPOINTS.APP.FORM
      );
      return transformFormResponse(response ?? []);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch Form Properties"
      );
    }
  }
);
