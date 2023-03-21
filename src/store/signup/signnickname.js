import { createSlice } from "@reduxjs/toolkit";

export const signNicknameSlice = createSlice({
  name: "nickname",
  initialState: { value: false },
  reducers: {
    chkNickname: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default signNicknameSlice.reducer;
export const { chkNickname } = signNicknameSlice.actions;
