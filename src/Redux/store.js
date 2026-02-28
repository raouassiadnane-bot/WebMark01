import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import postsReducer from "../store/postsSlice";
import usersReducer from "../store/usersSlice";
import signupReducer from "../features/signup/signupSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    users: usersReducer,
    signup: signupReducer,
  },
});

export default store;
