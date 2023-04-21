'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface PageToEditSlice {
    id: string,
    text: string,
    textColor: string,
    textSize: string
}

const initialState: PageToEditSlice = {
    id: '',
    text: '', 
    textColor: '',
    textSize: 'text-xl'
}

export const PageToEditSlice = createSlice({
    name: 'pageToEdit',
    initialState, 
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setText: (state, action) => {
            state.text = action.payload;
        },
        setTextColor: (state, action) => {
            state.textColor = action.payload;
        },
        setTextSize: (state, action) => {
            state.textSize = action.payload;
        },

    }
});

export const { setId, setText, setTextColor, setTextSize } = PageToEditSlice.actions;

export default PageToEditSlice.reducer;