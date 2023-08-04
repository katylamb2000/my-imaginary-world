import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Modal {
  status: boolean
  type: string | null
  prompt: string | null
  pageId: string | null

}

const initialState: Modal = {
  status: false,
  type: null,
  prompt: null,
  pageId: null
};

export const getPageImageModalSlice = createSlice({
  name: "getPageImageModal",
  initialState,
  reducers: {
    updateGetPageImageModalStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setPageId: (state, action) => {
      state.pageId = action.payload;
    },
  },
});

export const { updateGetPageImageModalStatus, setType, setPrompt, setPageId } = getPageImageModalSlice.actions;

export default getPageImageModalSlice.reducer;
