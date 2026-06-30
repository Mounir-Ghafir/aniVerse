import { configureStore } from "@reduxjs/toolkit"
import favoritesReducer from "./favoritesSlice"
import libraryReducer from "./librarySlice"
import ratingReducer from "./ratingSlice"

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    library: libraryReducer,
    rating: ratingReducer,
  },
})

export default store
