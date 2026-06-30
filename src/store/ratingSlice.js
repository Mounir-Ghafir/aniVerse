import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
}

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setRatings(state, action) {
      state.items = action.payload
    },
    addRating(state, action) {
      state.items.push(action.payload)
    },
    updateRating(state, action) {
      const idx = state.items.findIndex((item) => item.anime_id === action.payload.anime_id)
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload }
      }
    },
    removeRating(state, action) {
      state.items = state.items.filter((item) => item.anime_id !== action.payload)
    },
  },
})

export const { setRatings, addRating, updateRating, removeRating } = ratingSlice.actions
export default ratingSlice.reducer
