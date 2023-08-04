import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean;
}

const initialState: Modal = {
  status: false,
};

export const improveStoryModalSlice = createSlice({
  name: "improveStoryModal",
  initialState,
  reducers: {
    updateimproveStoryModalStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const { updateimproveStoryModalStatus } = improveStoryModalSlice.actions;

export default improveStoryModalSlice.reducer;
