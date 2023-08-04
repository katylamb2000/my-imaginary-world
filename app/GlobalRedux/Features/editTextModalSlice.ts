import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean;
  editTextPageId: string
}

const initialState: Modal = {
  status: false,
  editTextPageId: ''
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
  },
});

export const { updateEditTextModalStatus, setEditTextPageId } = editTextModalSlice.actions;

export default editTextModalSlice.reducer;


