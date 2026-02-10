import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  posts: [], // Array of all posts: { id, userId, userName, userInitials, text, timestamp }
};

// Create the slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Action to add a new post
    addPost: (state, action) => {
      const newPost = {
        id: Date.now().toString(), // Simple unique ID based on timestamp
        userId: action.payload.userId,
        userName: action.payload.userName,
        userInitials: action.payload.userInitials,
        text: action.payload.text,
        timestamp: new Date().toISOString(),
      };
      // Add to the beginning so newest posts appear first
      state.posts.unshift(newPost);
    },

    // Action to remove a post
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },

    // Action to load posts from localStorage (for persistence)
    loadPosts: (state, action) => {
      state.posts = action.payload;
    },

    // Action to initialize posts (useful for syncing with localStorage)
    initializePosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

// Export actions
export const { addPost, removePost, loadPosts, initializePosts } = postsSlice.actions;

// Export reducer to add to the store
export default postsSlice.reducer;
