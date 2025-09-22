import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
    resetPassword: {
      isFetching: false,
      error: false,
      currentUser: null,
      success: false,
    },
    logout: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    // LOGIN
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },

    // REGISTER
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },

    // RESET PASSWORD
    resetPasswordStart: (state) => {
      state.resetPassword.isFetching = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.currentUser = action.payload;
      console.log(action.payload);
      state.resetPassword.success = true;
      state.resetPassword.error = false;
    },
    resetPasswordFailed: (state) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.error = true;
      state.resetPassword.success = false;
    },
    resetPasswordClear: (state) => {
      state.resetPassword.isFetching = false;
      state.resetPassword.success = false;
      state.resetPassword.currentUser = null;
      state.resetPassword.error = false;
    },

    // LOGOUT
    logoutStart: (state) => {
      state.logout.isFetching = true;
    },
    logoutSuccess: (state) => {
      state.logout.isFetching = false;
      state.logout.error = false;
      state.login.currentUser = null;
    },
    logoutFailed: (state) => {
      state.logout.isFetching = false;
      state.logout.error = true;
    },

    // RESET USER
    setCurrentUser: (state, action) => {
      if (state.login.currentUser) {
        state.login.currentUser = {
          ...state.login.currentUser,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailed,
  resetPasswordClear,
  setCurrentUser,
} = authSlice.actions;
export default authSlice.reducer;
