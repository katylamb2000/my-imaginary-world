'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface ViewStorySlice {
    title: string,
    thumbnailImage: string,
    baseStoryImagePrompt: string,
    baseStoryImagePromptCreated: Boolean,
    storyId: string
}

const initialState: ViewStorySlice = {
    storyId: '',
    title: '',
    thumbnailImage: '',
    baseStoryImagePrompt: '',
    baseStoryImagePromptCreated: false
}

export const viewStorySlice = createSlice({
    name: 'viewStorySlice',
    initialState, 
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        }, 
        setStoryId: (state, action) => {
            state.storyId = action.payload;
        },
        setThumbnailImage: (state, action) => {
            state.thumbnailImage = action.payload;
        },
        setBaseStoryImagePrompt: (state, action) => {
            state.baseStoryImagePrompt = action.payload;
        },
        setBaseStoryImagePromptCreated: (state, action) => {
            state.baseStoryImagePromptCreated = action.payload;
        },
    }
});

export const { setTitle, setStoryId, setThumbnailImage, setBaseStoryImagePrompt, setBaseStoryImagePromptCreated } = viewStorySlice.actions;

export default viewStorySlice.reducer;