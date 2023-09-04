'use client'
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import { useSession } from "next-auth/react"


function ImproveSmallImage() {
    const { data: session } = useSession()
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const smallImagePrompt = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const [thoughts, setThoughts] = useState<string>('')

    const sendMessageToImageChatGpt = async() => {
        console.log(thoughts)
        const imageDescriptionsPrompt = 
        `
        Given the story: ${story}, I used A.I. to generate an image for this page ${pageText}. The prompt i was given to send to an image generator A.I. was ${smallImagePrompt}. 

        However, I am not happy with this image because: ${thoughts}. 

        Please write an improved prompt for me based on this feedback.

        `;
        
  try{
      const response = await fetch('/api/createStoryImagePrompts', {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              // promptType: 'backgroundImages', 
              promptType: 'improveSmallImagePrompt', 
              prompt: imageDescriptionsPrompt,
              session: session,
              storyId: storyId, 
              pageId: pageId
  
          }),
      })
      console.log('response from api', response)
    //   setLoading(false)
  
  }catch(err){
      console.log(err)
    //   setLoading(false)
  }
  }

  return (
    <div>
        <p className='text-pink-500 p-4 text-xl '>
        What are your thoughts on this image?
        </p>
        <div className='flex w-full gap-4'>
        <textarea 
                value={thoughts} 
                placeholder='Thoughs on the image used on this page...' 
                onChange={(e) => setThoughts(e.target.value)} 
                className="p-4 border rounded focus:outline-none focus:ring focus:border-purple-400 w-4/5 h-48 mx-4" aria-multiline 
        />
            <button className='text-purple-600 hover:text-purple-300' onClick={sendMessageToImageChatGpt}>
            Send
            </button>
        </div>
   </div>
  )
}

export default ImproveSmallImage