import { createSlice } from "@reduxjs/toolkit";

export const signIdSlice = createSlice({
  name: "id",
  initialState: { value: false },
  reducers: {
    chkId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default signIdSlice.reducer;
export const { chkId } = signIdSlice.actions;
