import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authorizedAxiosInstance from "~/utils/authorizedAxios";
const API_URL = import.meta.env.VITE_APP_API_URL;

export const loginUser = createAsyncThunk("auth/loginUser", async (user) => {
  const res = await authorizedAxiosInstance.post(`${API_URL}/api/auth/login`, user);
  return res.data.data.user;
});

export const loginUserWithGoogle = createAsyncThunk("auth/loginUserWithGoogle", async (tokenGoogle) => {
  const res = await authorizedAxiosInstance.post(`${API_URL}/api/auth/google`, {
    tokenGoogle,
  });
  return res.data;
});

export const loginUserWithFacebook = createAsyncThunk("auth/loginUserWithFacebook", async (tokenFacebook) => {
  const res = await authorizedAxiosInstance.post(`${API_URL}/api/auth/facebook`, {
    tokenFacebook,
  });
  return res.data;
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const res = await authorizedAxiosInstance.delete(`${API_URL}/api/auth/logout`);
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(loginUserWithGoogle.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(loginUserWithFacebook.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.currentUser = null;
    });
  },
});

export const selectCurrentUser = (state) => {
  return state.auth.currentUser;
};

export const authReducer = authSlice.reducer;
