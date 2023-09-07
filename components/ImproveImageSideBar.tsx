import { BackwardIcon, CameraIcon, MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RootState } from "../app/GlobalRedux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useSession } from "next-auth/react";

function ImproveImageSideBar() {
    const { data: session } = useSession() 
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const leftPagetext = useSelector((state: RootState) => state.pageToEdit.text)
    const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
    const firstImagePrompt = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)
    const [userFeedback, setUserFeedback] = useState<string>('')
    
    const goBack = () => {
        console.log('go back')
    }

    const getImprovedImagePrompt = async() => {
        const prompt = `i am using a A.I. image generator to create images for a childrens illustrated story book. You previously generated this prompt: ${firstImagePrompt}, for this page of the story: ${leftPagetext} ${rightPageText}, but the user has given this feedback: ${userFeedback}. please respond with an inproved prompt given this feedback. `
        console.log(firstImagePrompt)
        if (!session || !pageId || !storyId) return;
        try{
            const response = await fetch('/api/createCoverImagePrompt', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promptType: 'improvedImagePrompt', 
                    prompt: prompt,
                    session: session,
                    storyId: storyId, 
                    pageId: pageId
    
                }),
            })
            console.log('response from api', response)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="bg-gray-100 h-screen ml-2 mr-8 overflow-y-scroll p-6 shadow-lg rounded-lg">

            <div className='w-full'>

                <div className='flex items-center space-x-4 text-purple-500 py-4 hover:bg-gray-200 p-2 rounded-md transition-all duration-200 cursor-pointer' onClick={goBack}>
                    <BackwardIcon className="h-8 w-8 text-purple-600 hover:text-purple-400 transition-colors duration-200" />
                    <span className="font-semibold text-lg">Go back</span>
                </div>

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
                    <button className="p-2" onClick={getImprovedImagePrompt}>
                        <PaperAirplaneIcon className="h-6 w-6 text-purple-600 hover:text-purple-400" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImproveImageSideBar;
