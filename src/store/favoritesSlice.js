import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.items = action.payload
    },
    addFavorite(state, action) {
      state.items.push(action.payload)
    },
    removeFavorite(state, action) {
      state.items = state.items.filter((item) => item.anime_id !== action.payload)
    },
  },
})

export const { setFavorites, addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer