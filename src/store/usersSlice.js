import { createSlice } from "@reduxjs/toolkit";
import mockUsers from "../data/mockUsers.js";

// Initial state with mock users
const initialState = {
  users: mockUsers, // All users from mock data
  loading: false,
  error: null,
};

// Create the slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Action to get a user by ID
    getUserById: (state, action) => {
      state.currentUser = state.users.find(u => u.id === action.payload);
    },

    // Action to get all users
    getAllUsers: (state) => {
      // Just returns state.users
    },

    // Action to get user posts by ID
    getUserPosts: (state, action) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        state.currentUserPosts = user.posts;
      }
    },

    // Action to set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Action to set error
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { getUserById, getAllUsers, getUserPosts, setLoading, setError } = usersSlice.actions;

// Export reducer to add to the store
export default usersSlice.reducer;
