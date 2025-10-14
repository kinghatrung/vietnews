import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

import authorizedAxiosInstance from "~/utils/authorizedAxios";

const API_URL = import.meta.env.VITE_APP_API_URL;

// export const loginUser = crea

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {},
});

export const selectCurrentUser = (state) => {
  return state.auth.currentUser;
};

export const authReducer = authSlice.reducer;
