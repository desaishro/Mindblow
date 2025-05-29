import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "fittrack-app-token";

const initialState = {
  currentUser: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
