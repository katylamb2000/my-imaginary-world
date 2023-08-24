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
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckDone } from '@heroicons/react/24/solid'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

function BookCover() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    // const title = useSelector((state: RootState) => state.viewStory.title)
    const title = useSelector((state: RootState) => state.pageToEdit.text)
    const textColor = useSelector((state: RootState) => state.pageToEdit.textColor)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const coverImage = useSelector((state: RootState) => state.viewStory.coverImage)
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const [currentStoryId, setCurrentStoryId] = useState<string | null>()
    const [showInputBox, setShowInputBox] = useState<boolean>(false)
    const [titleUpdated, setTitleUpdated] = useState<boolean>(false)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const { data: session } = useSession()
    console.log('this is title ===> ', title)

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

  const editText = () => {
    console.log("dispatch edit text stuff and open and input b0ox etc")
    setShowInputBox(true)
  }

  const saveTitle = async() => {
    try{ 
      if (!storyId) return;
      const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", 'page_1');
      const updatedPage = await updateDoc(docRef, {
        text: title
      });
      setTitleUpdated(true)
      setShowInputBox(false)
    }catch(err){
      console.log(err)
      
    }
  }

  return (
    <div className='bg-gray-50 h-full w-full justify-center overscroll-none'>
        {/* <div className="border-2 border-gray-300 border-dashed h-4/5 w-3/5 bg-white drop-shadow-md text-center relative -mt-12"> */}
        <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">
          {showInputBox ? (
            <h1 className={`text-4xl font-bold ${textColor} mx-auto my-auto relative z-20 cursor-pointer`}   
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              onClick={editText}
              >
               {title || 'title'}
          </h1>
          ): 
          <div className=' mx-auto my-[250px] z-20 cursor-pointer flex items-center justify-center'>
            <input  type='text' placeholder={title || 'title'} 
                    className={`placeholder:text-4xl placeholder:font-bold placeholder:${textColor} pl-12 h-28 text-4xl ${textColor} font-bold `}
                    value={title || 'title'}
                    onChange={(e) => dispatch(setText(e.target.value))}
                    />
            {titleUpdated ? (
              <CheckDone className='text-green-500 h-8 w-8'/>
            ): 
              <CheckCircleIcon className='text-gray-200 h-8 w-8 hover:text-green-200' onClick={saveTitle} />
            }
          </div>
          }
       

            {/* Move the Image component below the title */}
            {/* {imageUrl && (
                <Image alt="/" src={imageUrl} fill className='z-10' />
            )} */}

            {coverImage && (
              //  <div className=" bg-purple-500 relative my-2 flex justify-center items-center">
                    <Image src={coverImage} alt="/" fill className="rounded-sm object-center object-cover z-10" />
                // </div>
               
            )}

            {/* Ensure the button is positioned above the image */}
            {/* <button onClick={openAIAssistant} className="z-30 relative">Open AI assistant</button> */}
        </div>
    </div>
  )
}

export default BookCover