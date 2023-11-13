import { BackwardIcon, CameraIcon, MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
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
import ImageFeedBackBox from "./ImageFeedBackBox";

type StoryItem = {
    name: string;
    description: string;
  };

  type Image = {
    url: string,
    id: string
  }

function ImproveImageSideBar() {
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
    

    const goBack = () => {
        setMessageSent(false)
        if (pageId == 'page_1'){
            dispatch(setEditBarType('editCover'))
            dispatch(setName('CoverPage'))
        }

        if (pageId !== 'page_1'){
            dispatch(setEditBarType('main'))
            dispatch(setName('InsidePage'))
        }   
    }

    useEffect(() => {
        if (pageId == 'Cover Page'){
            setPromptType('improvedCoverImagePrompt')
        }else {
            setPromptType('improvedImagePrompt')
        }
    }, [pageId])

    useEffect(() => {
        if (storyBuilderActive == 'improveLeftImage') {
            if (!finalSmallImage && !improvedSmallImageChoices && smallImageChoices){
                setUrl(smallImageChoices)
                setImageType('smallImageChoices')
            }
            else if (!finalSmallImage && improvedSmallImageChoices){
                setUrl(improvedSmallImageChoices)
                setImageType('improvedSmallImageChoices')
            }
            else if (finalSmallImage){
                setUrl(finalSmallImage)
                setImageType('finalSmallImage')
            }
        }
        if (storyBuilderActive == 'improveRightImage') {
            if (!finalMainImage && !improvedMainImageChoices && mainImageChoices){
                setUrl(mainImageChoices)
                setImageType('mainImageChoices')
            }
            else if (!finalMainImage && improvedMainImageChoices){
                setUrl(improvedMainImageChoices)
                setImageType('improvedMainImageChoices')
            }
            else if (finalMainImage){
                setUrl(finalMainImage)
                setImageType('finalMainImage')
            }
        }
        if (storyBuilderActive == 'CoverPage') {
            if (!finalMainImage && !improvedMainImageChoices && mainImageChoices){
                setUrl(mainImageChoices)
                setImageType('mainImageChoices')
            }
            else if (!finalMainImage && improvedMainImageChoices){
                setUrl(improvedMainImageChoices)
                setImageType('improvedMainImageChoices')
            }
            else if (finalMainImage){
                setUrl(finalMainImage)
                setImageType('finalMainImage')
            }
        }
    }, [storyBuilderActive, mainImageChoices, improvedMainImageChoices, finalMainImage, smallImageChoices, improvedSmallImageChoices, finalSmallImage ])

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
    
    const showImageGallery = () => {
        // console.log(image)
        setShowGallery(true)

    }

      return (
        <div style={{ backgroundColor: '#f3f4f6', height: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', padding: '24px', overflowY: 'auto' }}>
          {/* {!showGallery && ( */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }} onClick={goBack}>
              <BackwardIcon style={{ height: '32px', width: '32px', color: '#7c3aed' }} />
              <h2 style={{ fontSize: '32px', marginLeft: '8px', color: '#6d28d9' }}>Improve Image</h2>
            </div>
    
            {/* <p style={{ marginBottom: '16px', color: '#4b5563', fontSize: '14px' }}>Image type: {imageType}</p> */}
    
     
    
            {/* {messageSent === false ? ( */}
              <div>
                {/* <h2 style={{ color: '#6d28d9', fontWeight: 'bold', fontSize: '20px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>What are your thoughts on these image choices?</h2> */}
                
                {/* Accordion Components */}
<Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>View Page text</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
            Left Page: {leftPagetext}   
            </Typography>
            {rightPageText && rightPageText.length > 0 && (
            <Typography> 
            Right Page: {rightPageText}   
            </Typography>
            )}
            <ImageGallery />
    </AccordionDetails>
  </Accordion>
<Accordion>
<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
    <Typography>Image Gallery</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
    You can add switch the pages of the images that have already been created.    
    </Typography>
    <ImageGallery />
  </AccordionDetails>
  </Accordion>
  <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
    <Typography>Select you image</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
    <ImageUpscaleChoiceGrid />
      Here you can add additional options for image enhancement or editing. Users can select their preferences before proceeding.
    </Typography>
  </AccordionDetails>
</Accordion>
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
    <Typography>Tips for Better Results</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      Share tips or best practices for how users can achieve the best results with their images. Explain any do's and don'ts, or guide them on how to choose the best image for enhancement.
    </Typography>
  </AccordionDetails>
</Accordion>
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
    <Typography>Talk to AI about improving this image</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
        What are you thoughs about this image? 
    </Typography>
    <ImageFeedBackBox />
  </AccordionDetails>
</Accordion>


        </div>
        </div>
        </div>
      );
    };
    
    export default ImproveImageSideBar;
    
