'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface PageToEditSlice {
    id: string,
    text: string,
    textColor: string,
    textSize: string, 
    imageUrl: string,
    editText: string,
    buttonId: string
    characterDescription: string
    heroCharacterName: string
    style: string, 
    previousPageText: string | null,
    nextPageText: string | null,
    formattedText: string | null,
    audioUrl: string | null, 
    wildcardIdea: string | null, 
    objectIdea: string | null, 
    backgroundIdea: string | null, 
    characterIdea: string | null, 
    font: string,
    lineSpacing: string,
    alignment: string,
    showLayoutScrollbar: boolean
}

const initialState: PageToEditSlice = {
    id: '',
    text: '', 
    textColor: 'text-pink-500',
    textSize: 'text-md', 
    imageUrl: '',
    editText: '',
    buttonId: '',
    characterDescription: '',
    heroCharacterName: '',
    style: '',
    previousPageText: '',
    nextPageText: '', 
    formattedText: null,
    audioUrl: null, 
    characterIdea: null,
    backgroundIdea: null, 
    wildcardIdea: null, 
    objectIdea: null,
    font: 'serif',
    lineSpacing: 'leading-normal',
    alignment: 'center',
    showLayoutScrollbar: false
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
        setCharacterDescription: (state, action) => {
            state.characterDescription = action.payload;
        },
        setHeroCharacterName: (state, action) => {
            state.heroCharacterName = action.payload;
        },
        setStyle: (state, action) => {
            state.style = action.payload;
        },
        setPreviousPageText: (state, action) => {
            state.previousPageText = action.payload;
        },
        setNextPageText: (state, action) => {
            state.nextPageText = action.payload;
        },
        setFormattedText: (state, action) => {
            state.formattedText = action.payload;
        },
        setAudioUrl: (state, action) => {
            state.audioUrl = action.payload;
        },
        setWildcardIdea: (state, action) => {
            state.wildcardIdea = action.payload;
        },
        setObjectIdea: (state, action) => {
            state.objectIdea = action.payload;
        },
        setBackgroundIdea: (state, action) => {
            state.backgroundIdea = action.payload;
        },
        setCharacterIdea: (state, action) => {
            state.characterIdea = action.payload;
        },
        setFont: (state, action) => {
            state.font = action.payload;
        },
        setLineSpacing: (state, action) => {
            state.lineSpacing = action.payload;
        },
        setAlignment: (state, action) => {
            state.alignment = action.payload;
        },
        setShowLayoutScrollbar: (state, action) => {
            state.showLayoutScrollbar = action.payload
        }
    }
});

export const { 
    setId, setText, setTextColor, setTextSize, setImageUrl, setEditText, setButtonId, setCharacterDescription, 
    setHeroCharacterName, setStyle, setPreviousPageText, setNextPageText, setFormattedText, setAudioUrl, setWildcardIdea, setCharacterIdea,
    setBackgroundIdea, setObjectIdea, setFont, setLineSpacing, setAlignment, setShowLayoutScrollbar
} 
    = PageToEditSlice.actions;

export default PageToEditSlice.reducer;