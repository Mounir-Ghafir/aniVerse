import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
}

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {},
})

export default ratingSlice.reducer