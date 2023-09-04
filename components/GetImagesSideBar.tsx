import { useState, useEffect, CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { ArrowLeftIcon as BackOutline } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid } from "@heroicons/react/24/solid"
import { useDispatch } from "react-redux"
import { setEditBarType, setImageRequestSent } from "../app/GlobalRedux/Features/pageToEditSlice"
import { RootState } from '../app/GlobalRedux/store'
import { setStoryId } from '../app/GlobalRedux/Features/viewStorySlice'
import { SyncLoader } from 'react-spinners'
import axios from 'axios'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import ImproveSmallImage from './ImproveSmallImage'


function GetImagesSideBar() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const { data: session} = useSession()
    const [loading, setLoading] = useState<boolean>(false)
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    // const characters = useSelector((state: RootState) => state.characters.characters)
    const firstImagePromptIdea = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const characters = useSelector((state: RootState) => state.viewStory.storyCharacters)
    const imageRequestSent = useSelector((state: RootState) => state.pageToEdit.imageRequestSent)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const [color, setColor] = useState("#c026d3");
    const [extractedCharacters, setExtractedCharacters] = useState<string | null>(null)
    const  smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl)
    const [thoughts, setThoughts] = useState('')

    useEffect(() => {
      if (!story || !characters.length) return;
      console.log('story characters ===> ', characters)
      let descriptions = characters
      .map(character => `${character.name}: ${character.description}`);
      // return descriptions.join(' ');
      const charctersDescriptions = descriptions.join(' ');
      console.log(charctersDescriptions)
      setExtractedCharacters(charctersDescriptions)
    }, [story, characters])

    const override: CSSProperties = {
      display: "block",
      margin: "0 auto",
      borderColor: "#c026d3",
    };
    const goBack = () => {
        dispatch(setEditBarType('main'))
    }

    useEffect(() => {
      if (!pathname || storyId !== '') return;
      if (storyId == ''){

  
          const regex = /^\/story\/([a-zA-Z0-9]+)$/;
          const id = regex.exec(pathname);
        
          if (id) {
            const identifier = id[1];
            dispatch(setStoryId(identifier));  
          }}
    
    }, [storyId, pathname])

    const handleGetImageIdeas = async() => {
      if (!session || storyId == '') return;
      console.log(session, "STORYID",  storyId)
      setLoading(true)
      // const extractedCharacters = extractCharactersFromStory();
      const imageDescriptionsPrompt = 
      `
      Given the story: ${story}, generate an image prompts for each page of this illustrated children's storybook. 

      Use this example prompt as a template for how a prompt should be written. Ignore the prompt content, this is just an example: cartoon illustration of a boy being teased by a giant gorilla, in the style of whimsical children's book illustrator, strong color contrasts, dark azure and gray, the vancouver school, detailed character illustrations, manticore, sony alpha a1 -
     
      You must describe the camera angles and color palette to be used for each image Also, suggest an artistic style that complements the story's mood and setting for each page.

      The characters must remain consistent in appearance throughout the book: 

      Characters: ${extractedCharacters}

      the style must be consistent throughout the book. the style to reference is: ${style}

      each prompt is read by the ai in isolation so any reference to style or characters must be in each individual prompt. 

      This prompt is for a children's story book, so think about exciting and engaging images for each page, not boring or same same. 
      `;
      
try{
    const response = await fetch('/api/createStoryImagePrompts', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // promptType: 'backgroundImages', 
            promptType: 'firstImageIdeas', 
            prompt: imageDescriptionsPrompt,
            session: session,
            storyId: storyId, 

        }),
    })
    console.log('response from api', response)
    setLoading(false)

}catch(err){
    console.log(err)
    setLoading(false)
}
}

const handleGetSmallImageIdeas = async() => {
  setLoading(true)
  const imageDescriptionsPrompt = 
  `
      Please read the following story: ${story}. This is an illustrated children's storybook. 

      Your task is to create prompts that I will send to an AI image generator. For each page, I want you to create 4 separate prompts. 

      For each page, respond in this format:
      {
          "pageNumber": "page number",
          "characterCloseUp": "character prompt",
          "object": "object prompt",
          "wildCardImage": "wild card prompt"
      }
      
      
      1. Character close up: Focus very strongly on the character's expression, pose, and movements. These should be highly exaggerated and dynamic. Take into account their current emotions and actions in the story, and reflect this in the prompt. The character should be in the midst of an action, not just static or posing.
      
      2. Object or artifact from the scene: This should be the most important object in the scene. It should be on a white background unless the background is super important.
      
      3. Wild card image: For this image, you have complete freedom. Describe anything you think will make that page more funny, engaging, add to the storytelling, or generally improve the book. Be super creative, think out of the box and bring some magic to the scene!
      
      Each prompt should be succinct and clear for an AI to understand. Give camera angles, color palettes, and write in simple present tense.
      
      The response must be structured into exactly 14 sections, corresponding to the 14 pages of the book. As part of each page's description, also hint at the artistic style, including color palette and overall aesthetic that could best bring this scene to life, considering the story's mood and setting.
  `


;
  
try{
  const response = await fetch('/api/createSmallImageIdeas', {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          promptType: 'smallImageIdeas', 
          prompt: imageDescriptionsPrompt,
          session: session,
          storyId: storyId, 

      }),
  })
  console.log('response from api', response)
  setLoading(false)
  // dispatch(updateGetImagesModalStatus(false))
}catch(err){
  console.log(err)
  setLoading(false)
}
}


useEffect(() => {
  console.log('first image prompt no if', firstImagePromptIdea)
  if (firstImagePromptIdea){
    console.log('first image prompt', firstImagePromptIdea)
  }
}, [firstImagePromptIdea])

useEffect(() => {
  console.log('imageUrl no if', imageUrl, imageRequestSent)
  if (imageUrl) return;
  if (!firstImagePromptIdea) return;
  if (imageRequestSent) return;
  if (firstImagePromptIdea && !imageRequestSent){
    updatePageWithGettingImageStarted()

  }
}, [imageUrl, firstImagePromptIdea, imageRequestSent])

useEffect(() => {
  if (storyId == ''){
  if (!pathname) return;
  const regex = /^\/story\/([a-zA-Z0-9]+)$/;
  const id = regex.exec(pathname);

  if (id) {
    const identifier = id[1];
    setStoryId(identifier);  
  
  } else {
    console.log("No match");
  }}
}, [storyId, pathname])

const updatePageWithGettingImageStarted = async() => {
  if (!session || storyId == '') return;
  try{
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
    const updatedPage = await updateDoc(docRef, {
      imageRequestSent: true
    });
    console.log(updatedPage)
    getImage()
  }catch(err){
    console.log(err)
  }
}

const getImage = async() => {
  if (!session || !storyId || !firstImagePromptIdea) return;
    var data = JSON.stringify({
      msg: firstImagePromptIdea,
      ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', pageId: pageId },
      webhookOverride: ""
    });
    
    var config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/imagine',
      headers: { 
        'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response: any) {
      console.log(JSON.stringify(response.data));
      // setLoading(false)
    })
    .catch(function (error: any) {
      console.log(error);
      dispatch(setImageRequestSent(false))
      // setLoading(false)
    });
  }

  return (
    <div className="bg-white h-screen ml-2 mr-8">
        <div className='w-full pt-8 group flex gap-3 '>
            <BackOutline className="h-6 w-6 text-purple-600 group-hover:text-purple-400" onClick={goBack} />
            <p className="text-purple-600 group-hover:text-purple-400 font-light text-sm">Go back</p>

        </div>

          <h1 className='text-xl text-purple-500 font-bold mt-4'>Get Images</h1>

          {loading &&  (
                <SyncLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />)}

    {!loading && !firstImagePromptIdea && (
          <button className='bg-pink-500 text-white hover:bg-pink-300 rounded-lg p-4 '
                  onClick={handleGetImageIdeas}
          >
            Get images
          </button>
      
    )}
      {!smallImageUrl && (
        <button className='bg-pink-500 text-white hover:bg-pink-300 rounded-lg p-4 '
        onClick={handleGetSmallImageIdeas}
      >
        Get small image ideas
      </button>
      )}

      {smallImageUrl && (
          <ImproveSmallImage />
      )}    

    </div>
  )
}

export default GetImagesSideBar