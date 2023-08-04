'use client';

import { createSlice } from "@reduxjs/toolkit";
import storyBaseIP from "../../../lib/storyBaseIP";

export interface ViewStorySlice {
    title: string,
    thumbnailImage: string,
    baseStoryImagePrompt: string,
    baseStoryImagePromptCreated: Boolean,
    storyId: string,
    fullStory: string;
}

const initialState: ViewStorySlice = {
    storyId: '',
    title: '',
    thumbnailImage: '',
    baseStoryImagePrompt: '',
    baseStoryImagePromptCreated: false,
    fullStory: '',
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
        setFullStory: (state, action) => {
            state.fullStory = action.payload;
        },
    }
});

export const { setTitle, setStoryId, setThumbnailImage, setBaseStoryImagePrompt, setBaseStoryImagePromptCreated, setFullStory } = viewStorySlice.actions;

export default viewStorySlice.reducer;