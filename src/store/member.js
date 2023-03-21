import { createSlice } from "@reduxjs/toolkit";

export const memberSlice = createSlice({
  name: "member",
  initialState: { value: false },
  reducers: {
    memberState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default memberSlice.reducer;
export const { memberState } = memberSlice.actions;
