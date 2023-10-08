import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { CSSProperties, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../app/GlobalRedux/store'
import { useSession } from 'next-auth/react'
import { SkewLoader } from 'react-spinners'

function ImproveImagesBox() {
    const { data: session } = useSession()
    const [feedback, setFeedback] = useState<string>('')
    const currentImagePrompt = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const [loading, setLoading] = useState(false)
    const [anErrorOccurred, setAnErrorOccurred] = useState(false)
    let [color, setColor] = useState("#7c3aed");
    const model = 'text-davinci-003';
  
    const override: CSSProperties = {
      display: "block",
      margin: "0 auto",
      borderColor: "red",
    };

    const sendGetImprovedImagePrompt = async() => {
        const prompt = `This is an image prompt which i have previously sent to an ai image generator: ${currentImagePrompt}. 
        However, I am not happy with the image beause: ${feedback}.
        Please generate an improved prompt for me to send to the image generating ai beased on this feedback. 
        `
        setLoading(true)
        try{
        const response = await fetch('/api/createSmallImagePrompts', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                promptType: 'improveSingleImagePrompt',
                session: session,
                storyId: storyId,
                pageId: pageId 
            }),
        })
          const responseData = await response.json();
          console.log(responseData)
          setLoading(false)
            setFeedback('')
        }catch(err){
            console.log(err)
            setLoading(false)
            setAnErrorOccurred(true)
    }   
}
  return (
    <div>
    {loading ? (
             <SkewLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
    ):
    <div className='w-full rounded-sm bg-violet-500'>
        <p className='p-4 text-white font-bold'>{anErrorOccurred ? "Ooopsie! Something went wrong. Please resend your feedback!" :  "What do you not like about this image?" }</p>
        <div className='flex items-center gap-2 w-full h-18'> 
            <input className=' w-4/5 h-12 p-2 m-4 rounded-sm ' type='text' placeholder="I don't like this image because..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            <PaperAirplaneIcon className='h-8 w-8 text-white hover:text-pink-400' onClick={sendGetImprovedImagePrompt} />
        </div>

    </div>
}
    </div>

  )
}

export default ImproveImagesBox