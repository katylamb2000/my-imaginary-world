import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DraggableFontEditorState {
  textSize: number;
  fontStyle: string;
  textColor: string;
  textString: string,
  
}

const initialState: DraggableFontEditorState = {
  textSize: 20,
  fontStyle: "normal",
  textColor: "#000000",
  textString: ''
};

export const draggableFontEditorSlice = createSlice({
  name: "draggableFontEditor",
  initialState,
  reducers: {
    updateTextSize: (state, action: PayloadAction<number>) => {
      state.textSize = action.payload;
    },
    updateFontStyle: (state, action: PayloadAction<string>) => {
      state.fontStyle = action.payload;
    },
    updateTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload;
    },
    updateTextString: (state, action: PayloadAction<string>) => {
        state.textString = action.payload;
      },
  },
});

export const {
  updateTextSize,
  updateFontStyle,
  updateTextColor,
  updateTextString
} = draggableFontEditorSlice.actions;

export default draggableFontEditorSlice.reducer;
