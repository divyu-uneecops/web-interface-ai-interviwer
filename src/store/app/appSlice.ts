import { createSlice } from "@reduxjs/toolkit";
import { fetchForm, type AppFormIds } from "./app.thunks";

export interface AppState {
  form: AppFormIds;
}

const initialState: AppState = {
  form: {},
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchForm.fulfilled, (state, action) => {
      state.form = action.payload;
    });
  },
});

export default appSlice.reducer;
