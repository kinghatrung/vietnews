import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: { isLoading: false },

  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const selectLoading = (state) => {
  return state.loading.isLoading;
};

export const loadingReducer = loadingSlice.reducer;
