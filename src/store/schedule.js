import { createSlice } from '@reduxjs/toolkit';

export const scheduleSlice = createSlice({
    name: "schedule",
    initialState: { value: '' },
    reducers: {
        scheduleState: (state, action) => {
            state.value = action.payload
        }
    },
});

export default scheduleSlice.reducer;
export const { scheduleState } = scheduleSlice.actions;