import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean;
}

const initialState: Modal = {
  status: false,
};

export const addTextModalSlice = createSlice({
  name: "addTextModal",
  initialState,
  reducers: {
    updateAddTextModalStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const { updateAddTextModalStatus } = addTextModalSlice.actions;

export default addTextModalSlice.reducer;


