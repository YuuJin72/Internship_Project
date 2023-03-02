import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: "user",
    initialState: { value: false },
    reducers: {
        loginState: (state, action) => {
            state.value = action.payload
        }
    },
});

export default userSlice.reducer;
export const { loginState } = userSlice.actions;