'use client';

import { configureStore } from '@reduxjs/toolkit' 
import storyBuilderActiveReducer from './Features/storyBuilderActiveSlice'
import pageToEditReducer from './Features/pageToEditSlice';



export const store  = configureStore({
    reducer: {
        storyBuilderActive: storyBuilderActiveReducer,
        pageToEdit: pageToEditReducer,

    }
})

export type  RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;