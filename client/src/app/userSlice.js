import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: false,
  course: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signInfailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logOut: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = false;
    },
    allClasses: (state, action) => {
      state.course = action.payload;
    },
  },
});

export const {
  setUser,
  signInfailure,
  updateUser,
  updateUserFail,
  logOut,
  allClasses,
} = userSlice.actions;

export default userSlice.reducer;
