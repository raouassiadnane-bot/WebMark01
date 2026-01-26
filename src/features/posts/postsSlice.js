import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: { list: [] },
  reducers: {
    addPost: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
