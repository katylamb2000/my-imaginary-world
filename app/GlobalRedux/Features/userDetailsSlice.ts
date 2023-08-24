'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface StoryBuilderActiveSlice {
    username: string,
    isSubscriber: boolean
}

const initialState: StoryBuilderActiveSlice = {
    username: '',
    isSubscriber: false
   
}

export const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState, 
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setIsSubscriber: (state, action) => {
            state.isSubscriber = action.payload;
        },
    }
});

export const { setUsername, setIsSubscriber } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;