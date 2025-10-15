import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    loginModalVisible: false,
  },

  reducers: {
    showLoginModal: (state) => {
      state.loginModalVisible = true;
    },
    hideLoginModal: (state) => {
      state.loginModalVisible = false;
    },
  },
});

export const selectLoginModalVisible = (state) => {
  return state.modal.loginModalVisible;
};

export const modalReducer = modalSlice.reducer;
