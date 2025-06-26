import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    logoutUser: (state) => {
      state.userData = null;
    },
  },
});

export const { setUserData, setToken, logoutUser } = userSlice.actions;
export default userSlice.reducer;
