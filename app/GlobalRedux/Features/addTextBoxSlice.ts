'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface AddTextBoxSlice {
    id: string,
    addTextBox: boolean,
    // text: string,
    // textColor: string,
    // textSize: string
}

const initialState: AddTextBoxSlice = {
    id: '',
    addTextBox: false,
    // text: '', 
    // textColor: 'black',
    // textSize: 'text-lg'
}

export const AddTextBoxSlice = createSlice({
    name: 'addTextBox',
    initialState, 
    reducers: {
        // setId: (state, action) => {
        //     state.id = action.payload;
        // },
        setAddTextBox: (state, action) => {
            state.addTextBox = action.payload;
        },
        setAddTextBoxPageId: (state, action) => {
            state.id = action.payload;
        },
        // setText: (state, action) => {
        //     state.text = action.payload;
        // },
        // setTextColor: (state, action) => {
        //     state.textColor = action.payload;
        // },
        // setTextSize: (state, action) => {
        //     state.textSize = action.payload;
        // },

    }
});

// export const { setId, setAddTextBox, setText, setTextColor, setTextSize } = AddTextBox.actions;
export const { setAddTextBox, setAddTextBoxPageId } = AddTextBoxSlice.actions;


export default AddTextBoxSlice.reducer;