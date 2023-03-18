import { createSlice } from '@reduxjs/toolkit';

export const nicknameSlice = createSlice({
    name: "nickname",
    initialState: { value: '' },
    reducers: {
        nicknameState: (state, action) => {
            state.value = action.payload
        }
    },
});

export default nicknameSlice.reducer;
export const { nicknameState } = nicknameSlice.actions;