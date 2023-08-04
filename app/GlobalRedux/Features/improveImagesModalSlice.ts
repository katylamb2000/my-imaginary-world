import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean;
}

const initialState: Modal = {
  status: false,
};

export const improveImagesModalSlice = createSlice({
  name: "improveImagesModal",
  initialState,
  reducers: {
    updateModalStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const { updateModalStatus } = improveImagesModalSlice.actions;

export default improveImagesModalSlice.reducer;
