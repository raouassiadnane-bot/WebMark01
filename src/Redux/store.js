import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import postsReducer from "../store/postsSlice";
import usersReducer from "../store/usersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    users: usersReducer,
  },
});

export default store;
