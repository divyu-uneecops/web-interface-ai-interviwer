import { createSlice } from "@reduxjs/toolkit";
import {
  fetchForm,
  fetchViews,
  type AppFormIds,
  type AppViewIds,
} from "./app.thunks";

export interface AppState {
  form: AppFormIds;
  views: AppViewIds;
}

const initialState: AppState = {
  form: {},
  views: {},
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchForm.fulfilled, (state, action) => {
      state.form = action.payload;
    });
    builder.addCase(fetchViews.fulfilled, (state, action) => {
      state.views = action.payload;
    });
  },
});

export default appSlice.reducer;
