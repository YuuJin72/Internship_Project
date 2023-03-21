import { createSlice } from "@reduxjs/toolkit";

export const signEmailSlice = createSlice({
  name: "email",
  initialState: { value: false },
  reducers: {
    chkEmail: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default signEmailSlice.reducer;
export const { chkEmail } = signEmailSlice.actions;
