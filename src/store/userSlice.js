import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: "",
  email: "",
  joined: "",
  location: ""
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUp: (state, action) => {
      const { name, email, joined, location } = action.payload
      state.name = name
      state.email = email
      state.joined = joined
      state.location = location
    },
    clearUser: () => initialState
  }
})

export const { signUp, clearUser } = userSlice.actions
export default userSlice.reducer
