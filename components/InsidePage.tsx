import Image from "next/image";
import axios from "axios";
import Draggable from "react-draggable";
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { setImageUrl, setEditText } from "../app/GlobalRedux/Features/pageToEditSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function InsidePage() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const { data: session } = useSession()

    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const editTextSelected = useSelector((state: RootState) => state.pageToEdit.editText)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id )
    
    const [textSize, setTextSize] = useState<number>(24)
    const [loading, setLoading] = useState<boolean>(false)
    const [addText, setAddText] = useState<boolean>(false)
    const [updatedPageText, setUpdatedPageText] = useState<string>(pageText)
    const [storyId, setStoryId] = useState<string | null>()
    const [upscaleImage, setUpscaleImage] = useState<string | null>(null)

    useEffect(() => {
        if (!pathname) return;
        const regex = /^\/story\/([a-zA-Z0-9]+)$/;
        const id = regex.exec(pathname);
      
        if (id) {
          const identifier = id[1];
          setStoryId(identifier);  
        } else {
          console.log("No match");
        }
      }, [pathname])

    useEffect(() => {
        console.log('this is image  ====>', imageUrl)
    }, [imageUrl])


    const requestImage = async() => {
             console.log('trying to send sms')

      const phoneNumber = '+447309693489'
      const message = `you have a new request for images! 
      USER: ${session?.user?.email}
      STORYID: ${storyId}
      PAGEID: ${pageId}`
      try {
        const response = await fetch("/api/sendSms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ toPhoneNumber: phoneNumber, message }),
        }); 
  
        if (response.ok) {
          console.log("SMS sent successfully!");
        } else {
          console.error("Error sending SMS");
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    }

    const sendImagineCommand = async() => {
        // console.log('sending this prompt => ', page.data.imagePrompt)
        setLoading(true)
        var data = JSON.stringify({
          msg: `In the style of Adam Stower illustrate an image for a children's book depicting ${pageText} `,
          ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: pageId, },
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
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        //   setLoading(false)
        })
        .catch(function (error) {
          console.log(error);
          setLoading(false)
        });
      }

      useEffect(() => {
        if (imageUrl) {
            setLoading(false)
        }
      }, [imageUrl])

    const resetText = () => {
        setUpdatedPageText(pageText)
        dispatch(setEditText(''))
    }

  const updateText = async () => {
    // console.log(selectedPageText, selectedPageId);
    if (!storyId || !pageId || !session) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
    const updatedPage = await updateDoc(docRef, {
      page: updatedPageText
    });
    console.log(' this is the updated', updatedPage);
    dispatch(setEditText(''))
  };

//   useEffect(() => {
//     if (upscaleImage){
//         sendUpscaleRequest
//     }
//   }, [upscaleImage])

  const upscaleChosenImage = async(btn: string) => {
    console.log(btn)
    console.log(buttonId)

var data = JSON.stringify({
  button: btn,
  buttonMessageId: buttonId ,
  ref: { storyId: storyId, userId: session!.user!.email, action: 'upscale', pageId: pageId },
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
  setLoading(false)
});
  }
  
    return (
      <div className='bg-gray-50 h-full w-full items-center overscroll-none '>
    
          <div className="flex space-x-6 justify-center py-12 ">
   
                <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md text-center ">
             
                    {editTextSelected === pageId  ? (
                        // <Draggable bounds='parent'>
                            <div>
                                <textarea className="border border-purple-500 rounded-lg bg-white z-50 p-6 h-full w-full text-purple-500 border-none" value={updatedPageText} onChange={(e) => setUpdatedPageText(e.target.value)} />
                                    <div className="w-full items-center space-x-4">
                                        <button 
                                            onClick={resetText}
                                            className="text-purple-400 p-4 rounded-lg hover:shadow-xl hover:text-purple-600 border-2 border-purple-400 hover:border-purple-600">
                                            Reset text
                                        </button>
                                        <button 
                                            onClick={updateText}
                                            className="text-purple-400 p-4 rounded-lg hover:shadow-xl hover:text-purple-600 border-2 border-purple-400 hover:border-purple-600">
                                            Update text
                                        </button>
                                    </div>
                            </div>
                        // </Draggable>
                    ):
                        <Draggable bounds='parent'>
                            <p onClick={() => setAddText(!addText)} className={`font-serif text-purple-400 py-24 mx-8 cursor-move hover:text-purple-600`}>{pageText}</p>
                        </Draggable >
                    }
      
                </div>
                <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md">
            
                    {imageUrl.length ? (
                        <Image className='w-full h-full z-10' alt="/" src={imageUrl} width={200} height={200} />
                    ):
                        loading ? (
                            <div className="w-full h-full justify-center items-center text-center">
                                <p>loading</p>
                        </div>
                        ):
                        <div className="w-full h-full justify-center items-center text-center">
                            <button 
                                onClick={sendImagineCommand}
                                className="my-40 p-4 border border-purple-500 rounded-lg text-purple-500 hover:shadow-2xl hover:border-purple-700 hover:border-2 hover:text-purple-700 ">
                                    Get Image
                            </button>
                        </div>
                        
                    }

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
  
      </div>
    )
  }
  
  export default InsidePage