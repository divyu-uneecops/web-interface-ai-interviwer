import { API_ENDPOINTS } from "@/lib/constant";
import { buildUrl } from "@/lib/utils";
import serverInterfaceService from "@/services/server-interface.service";
import type { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFormProperties = createAsyncThunk(
  "jobs/fetchFormProperties",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { form, views } = state.appState;
      const interviewsObjectId = views?.interviews?.objectId;
      const interviewsFormId = form.createInterviews;

      if (!interviewsObjectId || !interviewsFormId) {
        return rejectWithValue(
          "Job opening form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
        );
      }

      const response = await Promise.allSettled([
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.INTERVIEW.FORM_PROPERTIES, {
            objectId: interviewsObjectId,
            formId: interviewsFormId,
          })
        ),
      ]);

      // Extract options for jobLevel, industry, and jobType fields

      const result: Record<
        string,
        Record<
          string,
          { id: string; name: string; values: any[]; fields: any[] }
        >
      > = {};
      response.forEach((item, index) => {
        if (item.status === "fulfilled") {
          result["interviews"] = extractFormProperties(item.value);
        }
      });

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch Form Properties"
      );
    }
  }
);

const extractFormProperties = (formProperties: any[]) => {
  if (!Array.isArray(formProperties)) {
    return {};
  }
  const result: Record<
    string,
    { id: string; name: string; values: any[]; fields: any[] }
  > = {};

  for (const section of formProperties) {
    if (Array.isArray(section?.fields || [])) {
      for (const field of section?.fields || []) {
        result[field?.key || ""] = {
          id: field?._id,
          name: field?.name,
          values: Array.isArray(field?.optionsConfig?.values || [])
            ? field?.optionsConfig?.values
            : [],
          fields: field?.fields || [],
        };
      }
    }
  }

  return result;
};
