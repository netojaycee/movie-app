import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: "",
  email: "",
  profileImage: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profileImage = action.payload.profileImage;
      state.isAuthenticated = true;
    },

    clearUserInfo: (state) => {
      return initialState; // Reset state to initial state when clearing user info
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
