'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface ViewCharacterSlice {
    characterName: string,
    characterId: string,
    characterImagePrompt: string,
    characterImage: string
}

const initialState: ViewCharacterSlice = {
    characterName: '',
    characterId: '',
    characterImagePrompt: '',
    characterImage: ''
}

export const viewCharacterSlice = createSlice({
    name: 'viewCharacterSlice',
    initialState, 
    reducers: {
        setCharacterName: (state, action) => {
            state.characterName = action.payload;
        }, 
        setCharacterId: (state, action) => {
            state.characterId = action.payload;
        },
        setCharacterImagePrompt: (state, action) => {
            state.characterImagePrompt = action.payload;
        },
        setCharacterImage: (state, action) => {
            state.characterImage = action.payload;
        },
    }
});

export const { setCharacterName, setCharacterId, setCharacterImagePrompt, setCharacterImage } = viewCharacterSlice.actions;

export default viewCharacterSlice.reducer;