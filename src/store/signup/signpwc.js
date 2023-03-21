import { createSlice } from "@reduxjs/toolkit";

export const signPwcSlice = createSlice({
  name: "pwc",
  initialState: { value: false },
  reducers: {
    chkPwc: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default signPwcSlice.reducer;
export const { chkPwc } = signPwcSlice.actions;
