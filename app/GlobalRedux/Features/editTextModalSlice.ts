import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean;
  editTextPageId: string, 
  openEditorToolbar: boolean
}

const initialState: Modal = {
  status: false,
  editTextPageId: '',
  openEditorToolbar: false
};

export const editTextModalSlice = createSlice({
  name: "editTextModal",
  initialState,
  reducers: {
    updateEditTextModalStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
      setEditTextPageId: (state, action: PayloadAction<string>) => {
        state.editTextPageId = action.payload;
      },
      setOpenEditorToolbar: (state, action: PayloadAction<boolean>) => {
        state.openEditorToolbar = action.payload;
      },
  },
});

export const { updateEditTextModalStatus, setEditTextPageId, setOpenEditorToolbar } = editTextModalSlice.actions;

export default editTextModalSlice.reducer;


