import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
}

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setLibrary(state, action) {
      state.items = action.payload
    },
    addToLibrary(state, action) {
      state.items.push(action.payload)
    },
    updateLibraryItem(state, action) {
      const idx = state.items.findIndex((item) => item.anime_id === action.payload.anime_id)
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload }
      }
    },
    removeFromLibrary(state, action) {
      state.items = state.items.filter((item) => item.anime_id !== action.payload)
    },
  },
})

export const { setLibrary, addToLibrary, updateLibraryItem, removeFromLibrary } = librarySlice.actions
export default librarySlice.reducer
