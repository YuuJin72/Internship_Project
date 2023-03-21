import { createSlice } from "@reduxjs/toolkit";

export const studyNavSlice = createSlice({
  name: "studynavnumber",
  initialState: { value: 0 },
  reducers: {
    studyNavState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default studyNavSlice.reducer;
export const { studyNavState } = studyNavSlice.actions;
