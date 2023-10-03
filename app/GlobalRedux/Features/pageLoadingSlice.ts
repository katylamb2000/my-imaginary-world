'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface PageLoadingSlice {
    isLoading: boolean,
}

const initialState: PageLoadingSlice = {
    isLoading: false,
}

export const PageLoadingSlice = createSlice({
    name: 'pageLoading',
    initialState, 
    reducers: {

        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
});

export const { setIsLoading } = PageLoadingSlice.actions;

export default PageLoadingSlice.reducer;