import { CameraIcon, MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { TextareaAutosize } from '@mui/base';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import ImageUpscaleChoiceGrid from "./ImageUpscaleChoiceGrid";
import Image from "next/image";
import { RootState } from "../app/GlobalRedux/store";
import ImageGallery from "./ImageGallery";


type StoryItem = {
    name: string;
    description: string;
  };

function ImageFeedBackBox() {
    const { data: session } = useSession() 
    const dispatch = useDispatch()
    // const characters = useSelector((state: RootState) => state.characters)
    const charactersArray = useSelector((state: RootState) => state.viewStory.storyCharacters)
    const imagesArray = useSelector((state: RootState) => state.viewStory.images)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const leftPagetext = useSelector((state: RootState) => state.pageToEdit.text)
    const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
    const firstImagePrompt = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)
    const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name)
    const editBarType = useSelector((state: RootState) => state.pageToEdit.editBarType)

    const mainImageChoices = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const improvedMainImageChoices = useSelector((state: RootState) => state.pageToEdit.improvedImageUrl)
    const finalMainImage = useSelector((state: RootState) => state.pageToEdit.finalImageUrl)

    const smallImageChoices = useSelector((state: RootState) => state.pageToEdit.smallImageUrl)
    const improvedSmallImageChoices = useSelector((state: RootState) => state.pageToEdit.improvedSmallImageUrl)
    const finalSmallImage = useSelector((state: RootState) => state.pageToEdit.finalSmallImageUrl)

    const [messageSent, setMessageSent] = useState(false)
    const [userFeedback, setUserFeedback] = useState<string>('')
    const [url, setUrl] = useState<string | null>(null)
    const [imageType, setImageType] = useState<string | null>(null)
    const [promptType, setPromptType] = useState<string | null>(null)
    const [showGallery, setShowGallery] = useState<boolean>(false)
    

    const getImprovedImagePrompt = async() => {
        const characters = JSON.stringify(charactersArray);
        // Parse the string into an array of objects
        const data = JSON.parse(characters);
        // Convert the array of objects into the desired string format
        const charactersString = data.map((item: StoryItem) => {
            return `${item.name.slice(0, -1)}: ${item.description}`;
          }).join(', ');
        const prompt = `I am using a A.I. image generator to create images for a childrens illustrated story book. 
        You previously generated this prompt: 
        ${firstImagePrompt}, for this page of the story: ${leftPagetext} ${rightPageText},
         but the user has given this feedback: ${userFeedback}. 
         please respond with an inproved prompt given this feedback. 
         For any characters feeatures please reference these character descriptions: ${charactersString} `

         console.log('this is the prompt ==> ', prompt, 'this is result string', charactersString, 'prompt type', promptType)
        if (!session || !pageId || !storyId || !promptType) return;
        try{
            const response = await fetch('/api/createCoverImagePrompt', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promptType: promptType, 
                    prompt: prompt,
                    session: session,
                    storyId: storyId, 
                    pageId: pageId
    
                }),
            })
            console.log('response from api', response)
            setUserFeedback('')
            setMessageSent(true)
        }catch(err){
            console.log(err)
            setUserFeedback('')
        }
    }
  return (
    <div className='mt-4'>
    <TextareaAutosize 
    minRows={5}
    maxRows={10}
    style={{ 
      width: '100%', 
      padding: '10px', 
      fontSize: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      outline: 'none',
      marginBottom: '16px'
    }} 
    onFocus={(e) => {
      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    }}
    onBlur={(e) => {
      e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    }}
    placeholder="Enter your thoughts here..."
    value={userFeedback}
    onChange={(e) => setUserFeedback(e.target.value)}
  />

  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
    <button style={{ padding: '8px' }}>
      <CameraIcon style={{ height: '24px', width: '24px', color: '#7c3aed' }} />
    </button>
    <button style={{ padding: '8px' }}>
      <MicrophoneIcon style={{ height: '24px', width: '24px', color: '#7c3aed' }} />
    </button>
    <button style={{ padding: '8px' }} onClick={getImprovedImagePrompt}>
      <PaperAirplaneIcon style={{ height: '24px', width: '24px', color: '#10b981' }} />
    </button>
  </div>
</div>


  )
}

export default ImageFeedBackBox