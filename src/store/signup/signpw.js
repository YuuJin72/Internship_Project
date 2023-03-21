import { createSlice } from "@reduxjs/toolkit";

export const signPwSlice = createSlice({
  name: "pw",
  initialState: { value: false },
  reducers: {
    chkPw: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default signPwSlice.reducer;
export const { chkPw } = signPwSlice.actions;
