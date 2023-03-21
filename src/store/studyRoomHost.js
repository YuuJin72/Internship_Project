import { createSlice } from "@reduxjs/toolkit";

export const studyRoomSlice = createSlice({
  name: "studyroomhost",
  initialState: { value: "" },
  reducers: {
    studyRoomState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default studyRoomSlice.reducer;
export const { studyRoomState } = studyRoomSlice.actions;
