import { createSlice } from "@reduxjs/toolkit";
import { fetchFormProperties } from "./jobs.thunks";

export interface JobState {
  mappingValues: Record<string, any>;
}

const initialState: JobState = {
  mappingValues: {},
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFormProperties.fulfilled, (state, action) => {
      console.log(action.payload);
      state.mappingValues = action.payload;
    });
  },
});

export default jobsSlice.reducer;
