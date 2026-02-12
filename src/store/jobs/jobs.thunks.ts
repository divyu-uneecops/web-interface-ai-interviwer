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
      const jobOpeningObjectId = views?.jobs?.objectId;
      const jobOpeningFormId = form.createJobs;
      const createRoundObjectId = views?.rounds?.objectId;
      const createRoundFormId = form.createRounds;

      if (!jobOpeningObjectId || !jobOpeningFormId) {
        return rejectWithValue(
          "Job opening form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
        );
      }
      if (!createRoundObjectId || !createRoundFormId) {
        return rejectWithValue(
          "Create round form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
        );
      }

      const response = await Promise.allSettled([
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.JOB_OPENING.FORM_PROPERTIES, {
            objectId: jobOpeningObjectId,
            formId: jobOpeningFormId,
          })
        ),
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.CREATE_ROUND.FORM_PROPERTIES, {
            objectId: createRoundObjectId,
            formId: createRoundFormId,
          })
        ),
      ]);

      // Extract options for jobLevel, industry, and jobType fields

      const result: Record<string, Record<string, any[]>> = {};
      response.forEach((item, index) => {
        if (item.status === "fulfilled") {
          result[index === 0 ? "jobOpening" : "createRound"] =
            extractFormProperties(
              item.value,
              index === 0
                ? ["jobLevel", "industry", "jobType", "status"]
                : ["roundType", "language", "duration", "reminderTime"]
            );
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

const extractFormProperties = (formProperties: any[], targets: string[]) => {
  if (!Array.isArray(formProperties)) {
    return {};
  }
  const result: Record<string, any[]> = {};

  for (const section of formProperties) {
    if (Array.isArray(section?.fields || [])) {
      for (const field of section?.fields || []) {
        if (targets.includes(field?.key || "")) {
          result[field?.key || ""] = Array.isArray(
            field?.optionsConfig?.values || []
          )
            ? field?.optionsConfig?.values
            : [];
        }
      }
    }
  }

  return result;
};
