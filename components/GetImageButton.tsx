import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState } from "../app/GlobalRedux/store";
import axios from "axios";
import { setImageRequestSent, setMidjourneyInitialRequestResponse } from "../app/GlobalRedux/Features/pageToEditSlice";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';


type StoryItem = {
    name: string;
    description: string;
  };

function GetImageButton() {
    const { data: session} = useSession()
    const dispatch = useDispatch()
   
    const charactersArray = useSelector((state: RootState) => state.viewStory.storyCharacters)
    const firstImagePrompt = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)
    const midjourneyInitialRequestResponse = useSelector((state: RootState) => state.pageToEdit.midjourneyInitialRequestResponse)
    const leftPagetext = useSelector((state: RootState) => state.pageToEdit.text)
    const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const [responseFromMidjourney, setResponseFromMidjourney] = useState<string | undefined>(undefined);

    const sendPromptToMidjourney = async () => {
        if (!firstImagePrompt) {
            throw new Error("Image prompt is undefined.");
        }
        const data = JSON.stringify({
            msg: firstImagePrompt,
            ref: { storyId: storyId, userId: session?.user?.email, action: 'imagine', page: pageId },
            webhookOverride: ""
        });
      
        const config = {
            method: 'post',
            url: 'https://api.thenextleg.io/v2/imagine',
            headers: {
                'Authorization': `Bearer ${process.env.next_leg_api_token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
      
        try {
            const response = await axios(config);
            console.log("Midjourney Response:", JSON.stringify(response.data));
            const midjourneyResp = JSON.stringify(response.data.success)
            if (!midjourneyResp) return;
            dispatch(setMidjourneyInitialRequestResponse(midjourneyResp))
            console.log("Midjourney Response JSON:", midjourneyResp);
        } catch (error) {
            console.error("Error sending to Midjourney:", error);
            throw error;  // If you want the main function to catch this error too
        }
      };

    const getImagePrompt = async() => {
        const characters = JSON.stringify(charactersArray);
        // Parse the string into an array of objects
        const data = JSON.parse(characters);
        // Convert the array of objects into the desired string format
        const charactersString = data.map((item: StoryItem) => {
            return `${item.name.slice(0, -1)}: ${item.description}`;
          }).join(', ');

        const prompt = `i am using a A.I. image generator to create images for a childrens illustrated story book. 
      
         For any characters feeatures please reference these character descriptions: ${charactersString} `
        if (!session || !pageId || !storyId) return;
        try{
            dispatch(setImageRequestSent(true))
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
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        const updatePage = async () => {
            try {
                if (!storyId) return;
                const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", 'page_1');
                await updateDoc(docRef, {
                    midjourneyInitialRequestResponse: responseFromMidjourney
                });
            } catch (err) {
                console.log(err);
            }
        };
    
        updatePage();
    }, [responseFromMidjourney, storyId, session]);
    
    useEffect(() => {
        if (midjourneyInitialRequestResponse) return;
        if (!midjourneyInitialRequestResponse){
            setTimeout(() => {
                getImage();
            }, 5000);  // 5000 milliseconds is 5 seconds
        }
    }, [midjourneyInitialRequestResponse]);
    

    const getImage = () => {
        if (firstImagePrompt){
            sendPromptToMidjourney()
        }
        else if (!firstImagePrompt){
            getImagePrompt()
        }
    }
  return (
    <div className='w-3/4'>
    {!midjourneyInitialRequestResponse && (
        <div
            className={` h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
        >
            <div className="flex justify-between items-center space-x-8">
            <button className=" h-10 p-4 rounded-lg  flex items-center justify-center bg-purple-500 hover:bg-purple-600  hover:shadow-xl" onClick={getImage}>
                <p className=" text-white font-extrabold"> get image</p>
            </button>
            </div>
        </div> 
    )}

    </div> 
  )
}

export default GetImageButton