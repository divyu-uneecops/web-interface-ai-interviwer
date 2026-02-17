import { createSlice } from "@reduxjs/toolkit";
import { fetchFormProperties } from "./call.thunks";

export interface JobState {
  mappingValues: Record<string, any>;
}

const initialState: JobState = {
  mappingValues: {},
};

export const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFormProperties.fulfilled, (state, action) => {
      state.mappingValues = action.payload;
    });
  },
});

export default callSlice.reducer;
