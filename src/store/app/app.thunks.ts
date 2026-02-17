import { API_ENDPOINTS } from "@/lib/constant";
import { buildUrl } from "@/lib/utils";
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

/** Raw view item from API (views[0]) */
export interface AppViewItem {
  _id: string;
  name: string;
  objectId: string;
  [key: string]: unknown;
}

/** Raw object-with-views from API */
export interface AppObjectViewsItem {
  _id: string;
  name: string;
  views: AppViewItem[];
}

/** Refactored: objectId (object _id) + viewId (views[0]._id), keyed by object name */
export type AppViewIds = Record<string, { objectId: string; viewId: string }>;

function transformViewsResponse(items: AppObjectViewsItem[]): AppViewIds {
  const list = Array.isArray(items) ? items : [];
  const result: AppViewIds = {};
  for (const item of list) {
    const view0 = item?.views?.[0];
    if (item?._id && view0?._id && item?.name != null) {
      const key = nameToKey(item?.name);
      if (key) result[key] = { objectId: item?._id, viewId: view0?._id };
    }
  }
  return result;
}

export const fetchForm = createAsyncThunk(
  "app/fetchForm",
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverInterfaceService.get<{
        data: AppFormItem[];
        page: { limit: number; total: number; offset: number };
      }>(
        buildUrl(API_ENDPOINTS.APP.FORM, {
          orgId: process.env.NEXT_PUBLIC_ORGANIZATION_ID || "",
        })
      );
      return transformFormResponse(response?.data ?? []);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch Form Properties"
      );
    }
  }
);

export const fetchViews = createAsyncThunk(
  "app/fetchViews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverInterfaceService.get<AppObjectViewsItem[]>(
        buildUrl(API_ENDPOINTS.APP.VIEWS, {
          appId: process.env.NEXT_PUBLIC_APP_ID || "",
          orgId: process.env.NEXT_PUBLIC_ORGANIZATION_ID || "",
        })
      );
      return transformViewsResponse(response ?? []);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch object views"
      );
    }
  }
);
