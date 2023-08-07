'use client';

import { configureStore } from '@reduxjs/toolkit' 
import storyBuilderActiveReducer from './Features/storyBuilderActiveSlice'
import pageToEditReducer from './Features/pageToEditSlice';
import viewCharacterReducer from './Features/viewCharacterSlice';
import viewStoryReducer from './Features/viewStorySlice'
import addTextBoxReducer from './Features/addTextBoxSlice'
import characterReducer from './Features/characterSlice';
import improveImagesModalReducer from './Features/improveImagesModalSlice';
import dragableFontEditorReducer from './Features/dragableFontEditorSlice';
import getImagesModalReducer from './Features/getImagesModalSlice'
import addTextModalReducer from './Features/addTextModalSlice';
import editTextModalReducer from './Features/editTextModalSlice';
import improveStoryModalReducer from './Features/improveStoryModalSlice'
import userDetailsReducer from './Features/userDetailsSlice';
import getPageImageModalReducer from './Features/getPageImageModal';
import layoutReducer from './Features/layoutSlice'

export const store  = configureStore({
    reducer: {
        storyBuilderActive: storyBuilderActiveReducer,
        pageToEdit: pageToEditReducer,
        viewCharacter: viewCharacterReducer, 
        viewStory: viewStoryReducer,
        addTextBox: addTextBoxReducer,
        characters: characterReducer,
        improveImagesModal: improveImagesModalReducer,
        imporoveStoryModal: improveStoryModalReducer,
        fontEditor: dragableFontEditorReducer,
        getImagesModal: getImagesModalReducer,
        getPageImageModal: getPageImageModalReducer,
        addTextModal: addTextModalReducer,
        editTextModal: editTextModalReducer,
        userDetails: userDetailsReducer,
        layout: layoutReducer
    }
})

export type  RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;