'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface PageToEditSlice {
    id: string | null,
    text: string,
    textColor: string,
    textSize: string, 
    imageUrl: string,
    editText: string,
    buttonId: string
    characterDescription: string
    heroCharacterName: string
    style: string, 
    previousPageText: string | null,
    nextPageText: string | null,
    formattedText: string | null,
    audioUrl: string | null, 
    wildcardIdea: string | null, 
    objectIdea: string | null, 
    backgroundIdea: string | null, 
    characterIdea: string | null, 
    font: string,
    lineSpacing: string,
    alignment: string,
    showLayoutScrollbar: boolean,
    editBarType: string,
    editStage: string,
    buttonMsgId: string | null, 
    imagePrompt: string | null, 
    firstImagePromptIdea: string | null,
    improvedImageUrl: string | null,
    showEditTextIcon: boolean,
    showInputBox: boolean,
    imageRequestSent: boolean,
    finalImageUrl: string | null, 
    signatureTextSize: string,
    signatureLineOne: string, 
    signatureLineTwo: string,
    signatureTextColor: string,
    smallImageUrl: string | null,
    smallImageTop: string, 
    rightPageText: string | null
    smallImageButtonId: string | null
    improvedImageButtonId: string | null,
    titleColor: string,
    titleSize: string, 
    improvedSmallImageUrl: string | null,
    rightPageLoading: boolean, 
    midjourneyInitialRequestResponse: boolean,
    finalSmallImageUrl: string | null
  
}

const initialState: PageToEditSlice = {
    id: '',
    text: '', 
    textColor: 'text-pink-500',
    textSize: 'text-md', 
    imageUrl: '',
    editText: '',
    buttonId: '',
    characterDescription: '',
    heroCharacterName: '',
    style: '',
    previousPageText: '',
    nextPageText: '', 
    formattedText: null,
    audioUrl: null, 
    characterIdea: null,
    backgroundIdea: null, 
    wildcardIdea: null, 
    objectIdea: null,
    font: 'serif',
    lineSpacing: 'leading-normal',
    alignment: 'center',
    showLayoutScrollbar: false,
    editBarType: 'main',
    editStage: '1', 
    buttonMsgId: null,
    imagePrompt: null, 
    firstImagePromptIdea: null,
    improvedImageUrl: null, 
    showEditTextIcon: false,
    showInputBox: false,
    imageRequestSent: false,
    finalImageUrl: null, 
    signatureTextSize: 'text-md',
    signatureLineOne: '',
    signatureLineTwo: '',
    signatureTextColor: 'text-pink-500',
    smallImageUrl: null, 
    smallImageTop: 'imageTop',
    rightPageText: null,
    smallImageButtonId: null,
    improvedImageButtonId: null,
    titleColor: 'text-gray-600',
    titleSize: 'text-5xl', 
    improvedSmallImageUrl: null,
    rightPageLoading: false, 
    midjourneyInitialRequestResponse: false,
    finalSmallImageUrl: null
}

export const PageToEditSlice = createSlice({
    name: 'pageToEdit',
    initialState, 
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setText: (state, action) => {
            state.text = action.payload;
        },
        setTextColor: (state, action) => {
            state.textColor = action.payload;
        },
        setTextSize: (state, action) => {
            state.textSize = action.payload;
        },
        setImageUrl: (state, action) => {
            state.imageUrl = action.payload;
        },
        setEditText: (state, action) => {
            state.editText = action.payload;
        },
        setButtonId: (state, action) => {
            state.buttonId = action.payload;
        },
        setCharacterDescription: (state, action) => {
            state.characterDescription = action.payload;
        },
        setHeroCharacterName: (state, action) => {
            state.heroCharacterName = action.payload;
        },
        setStyle: (state, action) => {
            state.style = action.payload;
        },
        setPreviousPageText: (state, action) => {
            state.previousPageText = action.payload;
        },
        setNextPageText: (state, action) => {
            state.nextPageText = action.payload;
        },
        setFormattedText: (state, action) => {
            state.formattedText = action.payload;
        },
        setAudioUrl: (state, action) => {
            state.audioUrl = action.payload;
        },
        setWildcardIdea: (state, action) => {
            state.wildcardIdea = action.payload;
        },
        setObjectIdea: (state, action) => {
            state.objectIdea = action.payload;
        },
        setBackgroundIdea: (state, action) => {
            state.backgroundIdea = action.payload;
        },
        setCharacterIdea: (state, action) => {
            state.characterIdea = action.payload;
        },
        setFont: (state, action) => {
            state.font = action.payload;
        },
        setLineSpacing: (state, action) => {
            state.lineSpacing = action.payload;
        },
        setAlignment: (state, action) => {
            state.alignment = action.payload;
        },
        setShowLayoutScrollbar: (state, action) => {
            state.showLayoutScrollbar = action.payload
        }, 
        setEditBarType: (state, action) => {
            state.editBarType = action.payload
        }, 
        setEditStage: (state, action) => {
            state.editStage = action.payload
        }, 
        setbuttonMsgId: (state, action) => {
            state.buttonMsgId = action.payload
        }, 
        setImagePrompt: (state, action) => {
            state.imagePrompt = action.payload
        }, 
        setFirstImagePromptIdea: (state, action) => {
            state.firstImagePromptIdea = action.payload
        },
        setImprovedImageUrl: (state, action) => {
            state.improvedImageUrl = action.payload
        },
        setShowEditTextIcon: (state, action) => {
            state.showEditTextIcon = action.payload
        },
        setShowInputBox: (state, action) => {
            state.showInputBox = action.payload
        },
        setImageRequestSent: (state, action) => {
            state.imageRequestSent = action.payload
        },
        setFinalImageUrl: (state, action) => {
            state.finalImageUrl = action.payload
        },
        setSignatureTextSize: (state, action) => {
            state.signatureTextSize = action.payload
        },
        setSignatureLineOne: (state, action) => {
            state.signatureLineOne = action.payload
        },
        setSignatureLineTwo: (state, action) => {
            state.signatureLineTwo = action.payload
        }, 
        setSignatureTextColor: (state, action) => {
            state.signatureTextColor = action.payload
        }, 
        setSmallImageUrl: (state, action) => {
            state.smallImageUrl = action.payload
        }, 
        setSmallImageTop: (state, action) => {
            state.smallImageTop = action.payload
        }, 
        setRightPageText: (state, action) => {
            state.rightPageText = action.payload
        }, 
           setSmallImageButtonId: (state, action) => {
            state.smallImageButtonId = action.payload
        }, 
        setImprovedImageButtonId: (state, action) => {
            state.improvedImageButtonId = action.payload
        }, 
        setTitleColor: (state, action) => {
            state.titleColor = action.payload
        },
        setTitleSize: (state, action) => {
            state.titleSize = action.payload
        },
        setImprovedSmallImageUrl: (state, action) => {
            state.improvedSmallImageUrl = action.payload
        },
        setRightPageLoading: (state, action) => {
            state.rightPageLoading = action.payload
        },
        setMidjourneyInitialRequestResponse: (state, action) => {
            state.midjourneyInitialRequestResponse = action.payload
        },
        setFinalSmallImageUrl: (state, action) => {
            state.finalSmallImageUrl = action.payload
        }
     
    }
});

export const { 
    setId, setText, setTextColor, setTextSize, setImageUrl, setEditText, setButtonId, setCharacterDescription, 
    setHeroCharacterName, setStyle, setPreviousPageText, setNextPageText, setFormattedText, setAudioUrl, setWildcardIdea, setCharacterIdea,
    setBackgroundIdea, setObjectIdea, setFont, setLineSpacing, setAlignment, setShowLayoutScrollbar, setEditBarType, setEditStage, 
    setbuttonMsgId, setImagePrompt, setFirstImagePromptIdea, setImprovedImageUrl, setShowEditTextIcon, setShowInputBox, setImageRequestSent,
    setFinalImageUrl, setSignatureTextSize, setSignatureLineOne, setSignatureLineTwo, setSignatureTextColor, setSmallImageUrl, setSmallImageTop,
    setRightPageText, setSmallImageButtonId, setImprovedImageButtonId, setTitleColor, setTitleSize, setImprovedSmallImageUrl, setRightPageLoading,
    setMidjourneyInitialRequestResponse, setFinalSmallImageUrl
} 
    = PageToEditSlice.actions;

export default PageToEditSlice.reducer;