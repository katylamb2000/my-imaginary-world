'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface StoryBuilderActiveSlice {
    name: string,
}

const initialState: StoryBuilderActiveSlice = {
    name: 'CoverPage'
   
}

export const storyBuilderActiveSlice = createSlice({
    name: 'storyBuilderActive',
    initialState, 
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        }
    }
});

export const { setName } = storyBuilderActiveSlice.actions;

export default storyBuilderActiveSlice.reducer;