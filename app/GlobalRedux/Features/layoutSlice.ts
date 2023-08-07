'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface LayoutSlice {
    layoutSelected: string,
}

const initialState: LayoutSlice = {
    layoutSelected: 'default',

}

export const LayoutSlice = createSlice({
    name: 'layoutSlice',
    initialState, 
    reducers: {
        setLayoutSelected: (state, action) => {
            state.layoutSelected = action.payload;
        }, 
    
    }
});

export const { setLayoutSelected } = LayoutSlice.actions;

export default LayoutSlice.reducer;