import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean;
}

const initialState: Modal = {
  status: false,
};

export const getImagesModalSlice = createSlice({
  name: "getImagesModal",
  initialState,
  reducers: {
    updateGetImagesModalStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const { updateGetImagesModalStatus } = getImagesModalSlice.actions;

export default getImagesModalSlice.reducer;



