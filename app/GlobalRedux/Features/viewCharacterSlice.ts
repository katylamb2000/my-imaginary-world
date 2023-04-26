'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface ViewCharacterSlice {
    characterName: string,
    characterId: string,
}

const initialState: ViewCharacterSlice = {
    characterName: '',
    characterId: ''
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
        }
    }
});

export const { setCharacterName, setCharacterId } = viewCharacterSlice.actions;

export default viewCharacterSlice.reducer;