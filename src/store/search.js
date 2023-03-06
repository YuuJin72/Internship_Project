import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: "search",
    initialState: { value: '' },
    reducers: {
        searchState: (state, action) => {
            state.value = action.payload
        }
    },
});

export default userSlice.reducer;
export const { searchState } = userSlice.actions;