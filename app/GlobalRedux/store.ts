'use client';

import { configureStore } from '@reduxjs/toolkit' 
import storyBuilderActiveReducer from './Features/storyBuilderActiveSlice'
import pageToEditReducer from './Features/pageToEditSlice';
import viewCharacterReducer from './Features/viewCharacterSlice';



export const store  = configureStore({
    reducer: {
        storyBuilderActive: storyBuilderActiveReducer,
        pageToEdit: pageToEditReducer,
        viewCharacter: viewCharacterReducer
    }
})

export type  RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;