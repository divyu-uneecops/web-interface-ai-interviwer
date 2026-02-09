import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "./user-management.thunks";

export interface UserManagementState {
  roles: Record<string, any>[];
}

const initialState: UserManagementState = {
  roles: [],
};

export const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      state.roles = action.payload.data || [];
    });
  },
});

export default userManagementSlice.reducer;
