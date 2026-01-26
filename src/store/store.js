import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import postsReducer from '../features/posts/postsSlice'
import uiReducer from '../features/ui/uiSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    ui: uiReducer,
  },
})

export default store
