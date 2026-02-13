import { API_ENDPOINTS } from "@/lib/constant";
import serverInterfaceService from "@/services/server-interface.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { buildUrl } from "@/lib/utils";

export const fetchFormProperties = createAsyncThunk(
  "interviewers/fetchFormProperties",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { form, views } = state.appState;
      const createRoundObjectId = views?.rounds?.objectId;
      const createRoundFormId = form.createRounds;
      const interviewersObjectId = views?.interviewers?.objectId;
      const interviewersFormId = form.createInterviewers;

      if (!createRoundObjectId || !createRoundFormId) {
        return rejectWithValue(
          "Create round form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
        );
      }

      if (!interviewersObjectId || !interviewersFormId) {
        return rejectWithValue(
          "Interviewers form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
        );
      }

      const response = await Promise.allSettled([
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.CREATE_ROUND.FORM_PROPERTIES, {
            objectId: createRoundObjectId,
            formId: createRoundFormId,
          })
        ),
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.INTERVIEWER.FROM_PROPERTIES, {
            objectId: interviewersObjectId,
            formId: interviewersFormId,
          })
        ),
      ]);

      // Extract options for jobLevel, industry, and jobType fields

      const result: Record<string, Record<string, any[]>> = {};
      response.forEach((item, index) => {
        if (item.status === "fulfilled") {
          result[index === 0 ? "createRound" : "interviewers"] =
            extractFormProperties(
              item.value,
              index === 0 ? ["roundType", "language", "voice"] : ["voice"]
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
