import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { loading: false, toast: null },
  reducers: {
    setLoading(state, action){ state.loading = action.payload },
    setToast(state, action){ state.toast = action.payload }
  }
})

export const { setLoading, setToast } = uiSlice.actions
export default uiSlice.reducer
