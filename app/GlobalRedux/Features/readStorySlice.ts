'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface ReadStorySlice {
    startReading: boolean,
    currentPage: string | null,
    currentPageText: string | null,
    paused: boolean
}

const initialState: ReadStorySlice = {
    startReading: false,
    currentPage: '',
    currentPageText: null,
    paused: false
   
}

export const readStorySlice = createSlice({
    name: 'readStory',
    initialState, 
    reducers: {
        setStartReading: (state, action) => {
            state.startReading = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setCurrentPageText: (state, action) => {
            state.currentPageText = action.payload;
        },
        setPaused: (state, action) => {
            state.paused = action.payload;
        },
    }
});

export const { setStartReading, setCurrentPage, setCurrentPageText, setPaused } = readStorySlice.actions;

export default readStorySlice.reducer;