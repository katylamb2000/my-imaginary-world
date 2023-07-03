'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface PageToEditSlice {
    id: string,
    text: string,
    textColor: string,
    textSize: string, 
    imageUrl: string,
    editText: string,
    buttonId: String
}

const initialState: PageToEditSlice = {
    id: '',
    text: '', 
    textColor: 'white',
    textSize: 'text-xl', 
    imageUrl: '',
    editText: 'wft is going on????',
    buttonId: ''
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
        setImageUrl: (state, action) => {
            state.imageUrl = action.payload;
        },
        setEditText: (state, action) => {
            state.editText = action.payload;
        },
        setButtonId: (state, action) => {
            state.buttonId = action.payload;
        },

    }
});

export const { setId, setText, setTextColor, setTextSize, setImageUrl, setEditText, setButtonId } = PageToEditSlice.actions;

export default PageToEditSlice.reducer;