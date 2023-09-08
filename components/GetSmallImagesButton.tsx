import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState } from "../app/GlobalRedux/store";
import axios from "axios";

type StoryItem = {
    name: string;
    description: string;
  };

function GetSmallImagesButton() {
    const { data: session} = useSession()
    const charactersArray = useSelector((state: RootState) => state.viewStory.storyCharacters)
    const firstImagePrompt = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)
    const leftPagetext = useSelector((state: RootState) => state.pageToEdit.text)
    const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)

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
        const resultString = data.map((item: StoryItem) => {
            return `${item.name.slice(0, -1)}: ${item.description}`;
          }).join(', ');
        
        console.log(resultString);

        console.log(characters);
        const prompt = `i am using a A.I. image generator to create images for a childrens illustrated story book. 
      
         For any characters feeatures please reference these character descriptions: ${characters} `
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

    <div
      className={` h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
    >
      <div className="flex justify-between items-center space-x-8">
        <button className=" h-10 p-4 rounded-lg  flex items-center justify-center bg-purple-500 hover:bg-purple-600  hover:shadow-xl" onClick={getImage}>
          <p className=" text-white font-extrabold"> get image</p>
        </button>
        </div>
    </div> 
    </div> 
  )
}

export default GetSmallImagesButton