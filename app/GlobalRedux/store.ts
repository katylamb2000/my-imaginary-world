'use client';

import { configureStore } from '@reduxjs/toolkit' 
import storyBuilderActiveReducer from './Features/storyBuilderActiveSlice'
import pageToEditReducer from './Features/pageToEditSlice';
import viewCharacterReducer from './Features/viewCharacterSlice';
import viewStoryReducer from './Features/viewStorySlice'
import addTextBoxReducer from './Features/addTextBoxSlice'



export const store  = configureStore({
    reducer: {
        storyBuilderActive: storyBuilderActiveReducer,
        pageToEdit: pageToEditReducer,
        viewCharacter: viewCharacterReducer, 
        viewStory: viewStoryReducer,
        addTextBox: addTextBoxReducer
    }
})

export type  RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;