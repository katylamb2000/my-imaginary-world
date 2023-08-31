'use client';

import { createSlice } from "@reduxjs/toolkit";
import storyBaseIP from "../../../lib/storyBaseIP";


export 

interface Character {
    name: string;
    description: string;
  }

interface ViewStorySlice {
    title: string,
    thumbnailImage: string,
    baseStoryImagePrompt: string,
    baseStoryImagePromptCreated: Boolean,
    storyId: string,
    fullStory: string | null,
    coverImage: string | null, 
    storyComplete: boolean,
    storyCharacters: Character[]
}

const initialState: ViewStorySlice = {
    storyId: '',
    title: '',
    thumbnailImage: '',
    baseStoryImagePrompt: '',
    baseStoryImagePromptCreated: false,
    fullStory: null,
    coverImage: null,
    storyComplete: true,
    storyCharacters: []
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
        setCoverImage: (state, action) => {
            state.coverImage = action.payload;
        },
        setStoryComplete: (state, action) => {
            state.storyComplete = action.payload;
        },
        setStoryCharacters: (state, action) => {
            state.storyCharacters = action.payload;
        },
    }
});

export const { setTitle, setStoryId, setThumbnailImage, setBaseStoryImagePrompt, setBaseStoryImagePromptCreated, setFullStory, setCoverImage, setStoryComplete, setStoryCharacters } = viewStorySlice.actions;

export default viewStorySlice.reducer;