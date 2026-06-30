import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
}

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {},
})

export default librarySlice.reducer