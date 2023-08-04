'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface StoryBuilderActiveSlice {
    username: string,
}

const initialState: StoryBuilderActiveSlice = {
    username: ''
   
}

export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState, 
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        }
    }
});

export const { setUsername } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;