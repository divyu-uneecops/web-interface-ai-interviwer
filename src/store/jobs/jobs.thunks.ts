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
      const applicantsObjectId = views?.applicants?.objectId;
      const applicantsFormId = form.createApplicants;

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
      if (!applicantsObjectId || !applicantsFormId) {
        return rejectWithValue(
          "Applicants form or view not loaded in app state. Ensure fetchForm and fetchViews have run first."
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
        serverInterfaceService.get(
          buildUrl(API_ENDPOINTS.APPLICANT.FORM_PROPERTIES, {
            objectId: applicantsObjectId,
            formId: applicantsFormId,
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
          result[
            index === 0
              ? "jobOpening"
              : index === 1
              ? "createRound"
              : "applicants"
          ] = extractFormProperties(item.value);
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
