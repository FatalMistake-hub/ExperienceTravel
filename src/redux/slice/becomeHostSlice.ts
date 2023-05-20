import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type } from 'os';
import { RootState } from '../store';

// declaring the types for our state


export const becomeHostSlice = createSlice({
    name: 'becomeHost',
    initialState: {
        step:0,
    },
    reducers: {
        SET_STEP: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
    },
});
// exporting the actions
export const { SET_STEP } = becomeHostSlice.actions;

export const selectBecomeHost = (state: RootState) => state.becomeHost;
export default becomeHostSlice.reducer;
