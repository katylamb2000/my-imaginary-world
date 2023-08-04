import {useState, useEffect} from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import { RootState } from '../app/GlobalRedux/store'
import { setText, setId } from '../app/GlobalRedux/Features/pageToEditSlice'
import { updateModalStatus } from '../app/GlobalRedux/Features/improveImagesModalSlice'
import { setStoryId } from '../app/GlobalRedux/Features/viewStorySlice'
import { usePathname } from 'next/navigation'

function BookCover() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const title = useSelector((state: RootState) => state.pageToEdit.text)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const [currentStoryId, setCurrentStoryId] = useState<string | null>()
    const { data: session } = useSession()

    useEffect(() => {
        if (!pathname) return;
        const regex = /^\/story\/([a-zA-Z0-9]+)$/;
        const id = regex.exec(pathname);
      
        if (id) {
          const identifier = id[1];
          setCurrentStoryId(identifier);  
        } else {
          console.log("No match");
        }
      }, [pathname])

    const openAIAssistant = () => {
            dispatch(updateModalStatus(true))
            dispatch(setStoryId(currentStoryId))
            dispatch(setId(pageId))   
    }

    const upscaleChosenImage = async(btn: string) => {
        console.log(btn)
        console.log(buttonId)
    
    var data = JSON.stringify({
      button: btn,
      buttonMessageId: buttonId ,
      ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'upscale', page: pageId },
      webhookOverride: ""
    });
    
    var config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/button',
      headers: { 
        'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    //   setLoading(false)
    })
    .catch(function (error) {
      console.log(error);
    //   setLoading(false)
    });
      }

  return (
<div className='bg-gray-50 h-full w-full  justify-center flex overscroll-none  '>
    <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md text-center mt-14 ">
            <button onClick={openAIAssistant}>open ai</button>
              
            {imageUrl.length && (
                        <Image className='w-full h-full z-10' alt="/" src={imageUrl} width={200} height={200} />
            )}

            <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
            <path id="curve" fill="transparent" d="M 10 250 q 390 -200 780 0" />
            <text x="10" y="250" fill="black" font-size="25">
                <textPath href="#curve">
                {title}
                </textPath>
            </text>
            </svg>

        <button onClick={openAIAssistant}>Open AI assistant</button>
    </div>

         {imageUrl.length && (
                    <div className=' h-44 bg-white border shadow-2xl border-gray-100  rounded-lg'> 
                        <p className="mx-auto p-6">Select Your image</p>
                        <div className="w-20 h-20 mx-auto my-auto bg-white grid grid-cols-2">
                            <button onClick={() => upscaleChosenImage('U1')} className="text-purple-400 rounded-full hover:border hover:border-purple-600 hover:text-purple-600">1</button>
                            <button onClick={() => upscaleChosenImage('U2')} className="text-purple-400 rounded-full hover:border hover:border-purple-600 hover:text-purple-600">2</button>
                            <button onClick={() => upscaleChosenImage('U3')} className="text-purple-400 rounded-full hover:border hover:border-purple-600 hover:text-purple-600">3</button>
                            <button onClick={() => upscaleChosenImage('U4')} className="text-purple-400 rounded-full hover:border hover:border-purple-600 hover:text-purple-600">4</button>
                        </div>
                    </div>
                )}
</div>



  )
}

export default BookCover