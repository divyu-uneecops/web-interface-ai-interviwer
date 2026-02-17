import { API_ENDPOINTS } from "@/lib/constant";
import { buildUrl } from "@/lib/utils";
import serverInterfaceService from "@/services/server-interface.service";
import type { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFormProperties = createAsyncThunk(
  "call/fetchFormProperties",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { form, views } = state.appState;
      const interviewsPenaltyObjectId =
        views?.interviewproctoringevents?.objectId;
      const interviewsPenaltyFormId = form?.createInterviewproctoringevents;
      const feedbackObjectId = views?.["feedback"]?.objectId;
      const feedbackFormId = form?.createFeedback;

      if (
        !interviewsPenaltyObjectId ||
        !interviewsPenaltyFormId ||
        !feedbackObjectId ||
        !feedbackFormId
      ) {
        return rejectWithValue(
          "Job opening form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
        );
      }

      const response = await Promise.allSettled([
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.INTERVIEW_PENALTY.FROM_PROPERTIES, {
            objectId: interviewsPenaltyObjectId,
            formId: interviewsPenaltyFormId,
          })
        ),
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.FEEDBACK.FORM_PROPERTIES, {
            objectId: feedbackObjectId,
            formId: feedbackFormId,
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
          result[index === 0 ? "interviewProctoringPenalty" : "feedback"] =
            extractFormProperties(item.value);
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
