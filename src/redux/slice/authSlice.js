import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.isAuthenticated = action?.payload?.token ? true : false;
      state.userData = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { setUserData, logoutUser } = userSlice.actions;
export default userSlice.reducer;
