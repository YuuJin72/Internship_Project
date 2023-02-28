import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: "user",
    initialState: { value: false },
    reducers: {
        login: (state, action) => {
            state.value = action.payload
        },
        logout: (state, action) => {
            state.value = action.payload
        },
    },
});

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;