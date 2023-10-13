'use client';

import { createSlice } from "@reduxjs/toolkit";
import storyBaseIP from "../../../lib/storyBaseIP";


export 

interface Character {
    name: string;
    description: string;
  }

  interface CompletePage {
    pageId: string;
  }

interface ViewStorySlice {
    title: string,
    thumbnailImage: string,
    baseStoryImagePrompt: string,
    baseStoryImagePromptCreated: Boolean,
    storyId: string,
    fullStory: string | null,
    coverImage: string | null, 
    storyComplete: boolean,
    storyCharacters: Character[], 
    pagesComplete: number, 
    titleTextColor: string
    completedPages: CompletePage[],
    titleIdeas: string | null,
    selectedTitle: string | null,
    pagesLoadingMainImage: Record<string, boolean>;
    pdfUrl: string | null

}

const initialState: ViewStorySlice = {
    storyId: '',
    title: '',
    thumbnailImage: '',
    baseStoryImagePrompt: '',
    baseStoryImagePromptCreated: false,
    fullStory: null,
    coverImage: null,
    storyComplete: false,
    storyCharacters: [],
    pagesComplete: 0,
    titleTextColor: 'text-black',
    completedPages: [],
    titleIdeas: null,
    selectedTitle: null,
    pagesLoadingMainImage: {},
    pdfUrl: null
}

export const viewStorySlice = createSlice({
    name: 'viewStorySlice',
    initialState, 
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        }, 
        setStoryId: (state, action) => {
            state.storyId = action.payload;
        },
        setThumbnailImage: (state, action) => {
            state.thumbnailImage = action.payload;
        },
        setBaseStoryImagePrompt: (state, action) => {
            state.baseStoryImagePrompt = action.payload;
        },
        setBaseStoryImagePromptCreated: (state, action) => {
            state.baseStoryImagePromptCreated = action.payload;
        },
        setFullStory: (state, action) => {
            state.fullStory = action.payload;
        },
        setCoverImage: (state, action) => {
            state.coverImage = action.payload;
        },
        setStoryComplete: (state, action) => {
            state.storyComplete = action.payload;
        },
        setStoryCharacters: (state, action) => {
            state.storyCharacters = action.payload;
        },
        setPagesComplete: (state, action) => {
            state.pagesComplete = action.payload;
        },
        setTitleTextColor: (state, action) => {
            state.titleTextColor = action.payload;
        },
      // In your viewStorySlice
    setCompletedPages: (state, action) => {
    const pageId = action.payload; // Assuming action.payload is the pageId as a string
    if (!state.completedPages.some((page) => page.pageId === pageId)) {
      state.completedPages.push({ pageId }); // Add the pageId as an object
    }
  },
  setTitleIdeas: (state, action) => {
    state.titleIdeas = action.payload;
},

setSelectedTitle: (state, action) => {
    state.selectedTitle = action.payload;
},
setPageLoadingMainImage: (state, action) => {
    const pageId = action.payload;
    state.pagesLoadingMainImage[pageId] = true;
},
setPageDoneLoadingMainImage: (state, action) => {
    const pageId = action.payload;
    state.pagesLoadingMainImage[pageId] = false;
},
setPdfUrl: (state, action) => {
    state.pdfUrl = action.payload;
},

  
    }
});

export const { 
    setTitle, setStoryId, setThumbnailImage, setBaseStoryImagePrompt, setBaseStoryImagePromptCreated, setFullStory, setCoverImage, 
    setStoryComplete, setStoryCharacters, setPagesComplete, setTitleTextColor, setCompletedPages, setTitleIdeas, setSelectedTitle,
    setPageLoadingMainImage, setPageDoneLoadingMainImage, setPdfUrl
} 
    = viewStorySlice.actions;

export default viewStorySlice.reducer;