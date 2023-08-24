import { useState, useEffect, CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { ArrowLeftIcon as BackOutline } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid } from "@heroicons/react/24/solid"
import { useDispatch } from "react-redux"
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice"
import { RootState } from '../app/GlobalRedux/store'
import { setStoryId } from '../app/GlobalRedux/Features/viewStorySlice'
import { SyncLoader } from 'react-spinners'
function GetImagesSideBar() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const { data: session} = useSession()
    const [loading, setLoading] = useState<boolean>(false)
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    let [color, setColor] = useState("#c026d3");
  
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
      const imageDescriptionsPrompt = 
      `
      Given the story: ${story}, generate an image prompts for each page of this illustrated children's storybook. 
     
      You must describe the camera angles and color palette to be used for each image Also, suggest an artistic style that complements the story's mood and setting for each page.
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

  return (
    <div className="bg-white h-screen ml-2 mr-8">
        <div className='w-full pt-8 group flex gap-3 '>
            <BackOutline className="h-6 w-6 text-purple-600 group-hover:text-purple-400" onClick={goBack} />
            <p className="text-purple-600 group-hover:text-purple-400 font-light text-sm">Go back</p>

        </div>

          <h1 className='text-xl text-purple-500 font-bold mt-4'>Get Images</h1>
          {loading ? (
                <SyncLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />):
          <button className='bg-pink-500 text-white hover:bg-pink-300 rounded-lg p-4 '
                  onClick={handleGetImageIdeas}
          >
            Get image ideas
          </button>
      
          }
    </div>
  )
}

export default GetImagesSideBar