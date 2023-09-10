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
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
    const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)

    const sendPromptToMidjourney = async () => {
      
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
    }catch (error) {
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
                    promptType: 'getSmallImagePrompt', 
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

    const handleGetSmallImageIdeas = async() => {

        const characters = JSON.stringify(charactersArray);
        // Parse the string into an array of objects
        const data = JSON.parse(characters);
        // Convert the array of objects into the desired string format
        const charactersString = data.map((item: StoryItem) => {
            return `${item.name.slice(0, -1)}: ${item.description}`;
          }).join(', ');
        
        const imageDescriptionsPrompt = 
        `
            Please read the following story: ${story}. This is an illustrated children's storybook. 
      
            Your task is to create prompts that I will send to an AI image generator. For the page: ${leftPagetext} ${rightPageText}, I want you to create 4 separate prompts. 
      
            For each page, respond in this format:
            {
                "pageNumber": ${pageId},
                "characterCloseUp": "character prompt",
                "object": "object prompt",
                "wildCardImage": "wild card prompt"
            }
            
            
            1. Character close up: Focus very strongly on the character's expression, pose, and movements. These should be highly exaggerated and dynamic. Take into account their current emotions and actions in the story, and reflect this in the prompt. The character should be in the midst of an action, not just static or posing.
            
            2. Object or artifact from the scene: This should be the most important object in the scene. It should be on a white background unless the background is super important.
            
            3. Wild card image: For this image, you have complete freedom. Describe anything you think will make that page more funny, engaging, add to the storytelling, or generally improve the book. Be super creative, think out of the box and bring some magic to the scene!
            
            Each prompt should be succinct and clear for an AI to understand. Give camera angles, color palettes, and write in simple present tense.

            For any characters featured please refere to these descriptions: ${charactersString}. And the style should reference: ${style}
            
        `
      ;
     
      console.log('prompt', imageDescriptionsPrompt)
      try{
        // const response = await fetch('/api/createSmallImagePrompts', {
          const response = await fetch('/api/singlePageCreateSmallImageIdeas', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promptType: 'getSmallImagePromptSinglePage', 
                prompt: imageDescriptionsPrompt,
                session: session,
                storyId: storyId, 
                pageId: pageId
      
            }),
        })
        console.log('response from api', response)

        // dispatch(updateGetImagesModalStatus(false))
      }catch(err){
        console.log(err)

      }
      }

    // const getImage = () => {
    //     if (!wildcardIdea && !objectIdea && !characterIdea){
    //         sendPromptToMidjourney()
    //     }
    //     else if (wildcardIdea && objectIdea && characterIdea){
    //         handleGetSmallImageIdeas()
    //     }
    // }

  return (
    <div className='w-3/4'>

    <div
      className={` h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
    >
      <div className="flex justify-between items-center space-x-8">
        <button className=" h-10 p-4 rounded-lg  flex items-center justify-center bg-purple-500 hover:bg-purple-600  hover:shadow-xl" onClick={handleGetSmallImageIdeas}>
          <p className=" text-white font-extrabold"> Get image ideas</p>
        </button>
        </div>
    </div> 
    </div> 
  )
}

export default GetSmallImagesButton