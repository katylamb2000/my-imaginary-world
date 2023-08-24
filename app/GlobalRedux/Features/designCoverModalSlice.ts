import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DesignCoverModal {
  status: boolean
  type: string | null
  prompt: string | null
  pageId: string | null

}

const initialState: DesignCoverModal = {
  status: false,
  type: 'design the front cover',
  prompt: null,
  pageId: null
};

export const DesignCoverModalSlice = createSlice({
  name: "designCoverModal",
  initialState,
  reducers: {
    setDesignCoverModalStatus: (state, action: PayloadAction<boolean>) => {
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

export const { setDesignCoverModalStatus, setType, setPrompt, setPageId } = DesignCoverModalSlice.actions;

export default DesignCoverModalSlice.reducer;
