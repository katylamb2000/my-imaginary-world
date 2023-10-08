import { BackwardIcon, CameraIcon, MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RootState } from "../app/GlobalRedux/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { setAudioUrl, setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import ImageUpscaleChoiceGrid from "./ImageUpscaleChoiceGrid";

type StoryItem = {
    name: string;
    description: string;
  };

function ImproveImageSideBar() {
    const { data: session } = useSession() 
    const dispatch = useDispatch()
    // const characters = useSelector((state: RootState) => state.characters)
    const charactersArray = useSelector((state: RootState) => state.viewStory.storyCharacters)
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
        const resultString = data.map((item: StoryItem) => {
            return `${item.name.slice(0, -1)}: ${item.description}`;
          }).join(', ');
        const prompt = `I am using a A.I. image generator to create images for a childrens illustrated story book. 
        You previously generated this prompt: 
        ${firstImagePrompt}, for this page of the story: ${leftPagetext} ${rightPageText},
         but the user has given this feedback: ${userFeedback}. 
         please respond with an inproved prompt given this feedback. 
         For any characters feeatures please reference these character descriptions: ${characters} `
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
        <div className="bg-gray-100 h-screen ml-2 mr-8 overflow-y-scroll p-6 shadow-lg rounded-lg w-full">

            <div className='w-full'>

                <div className='flex items-center space-x-4 text-purple-500 py-4 hover:bg-gray-200 p-2 rounded-md transition-all duration-200 cursor-pointer' onClick={goBack}>
                    <BackwardIcon className="h-8 w-8 text-purple-600 hover:text-purple-400 transition-colors duration-200" />
                    {/* <span className="font-semibold text-lg">Go back</span> */}
                    <span> <h2 className="text-4xl"> Improve Image </h2></span>
                </div>
            {/* {!finalImageUrl} */}
                <p>IMage type: {imageType}</p>
                <ImageUpscaleChoiceGrid />

        {messageSent == false ? (
            <>
            <h2 className='text-purple-500 font-bold text-xl py-4 border-b border-gray-300 pb-2 mb-4'>What are your thoughts on these image choices?</h2>
                <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Left Page Text</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {leftPagetext}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {rightPageText && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
     
    <Typography>Right Page text</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {rightPageText}
          </Typography>
        </AccordionDetails>
      </Accordion>
                )}

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
                        transition: 'box-shadow 0.2s ease-in-out'
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

       
            <div className="flex items-center justify-evenly absolute right-14 mt-4">
                    <button className="p-2">
                        <CameraIcon className="h-6 w-6 text-purple-600 hover:text-purple-400" />
                    </button>
                    <button className="p-2">
                        <MicrophoneIcon className="h-6 w-6 text-purple-600 hover:text-purple-400" />
                    </button>
            {storyBuilderActive == 'editLeft' ? (
                <button className="p-2" onClick={getImprovedImagePrompt}>
                    <PaperAirplaneIcon className="h-6 w-6 text-green-600 hover:text-purple-400" />
                </button>
                    ): 
                <button className="p-2" onClick={getImprovedImagePrompt}>
                    <PaperAirplaneIcon className="h-6 w-6 text-purple-600 hover:text-purple-400" />
                </button>
                    }
              
                </div>
            </>
        ) : (
            <div>
                <h2 className='text-purple-500 font-bold text-xl py-4 border-b border-gray-300 pb-2 mb-4'>Sounds good. I'll have another crack at it</h2>
            </div>
        )}

            </div>
        </div>
    )
}

export default ImproveImageSideBar;
