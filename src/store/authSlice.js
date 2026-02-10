import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isAuthenticated: false, // false by default
  user: null,             // will store user info after login
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to log in
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // payload should contain user info
    },
    // Action to log out
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Export actions
export const { login, logout } = authSlice.actions;

// Export reducer to add to the store
export default authSlice.reducer;
