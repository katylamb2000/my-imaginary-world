'use client'

import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../app/GlobalRedux/store'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { MoonLoader} from 'react-spinners'
import { useSession } from "next-auth/react";
import { updateGetImagesModalStatus } from "../app/GlobalRedux/Features/getImagesModalSlice";
import { updateGetPageImageModalStatus } from "../app/GlobalRedux/Features/getPageImageModal";
import { AiOutlineRight } from "react-icons/ai"; // This is a right-facing arrow icon from the react-icons library
import axios from "axios"
import MessageForm from "./MessageForm"
import { db } from "../firebase"
import { doc, updateDoc, collection } from "firebase/firestore"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import Draggable from "react-draggable";
interface Message {
    role: string;
    content: string;
}

function GetPageImageModal() {
    const dispatch = useDispatch()
    const open = useSelector((state: RootState) =>  state.getPageImageModal.status);
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    // const wildcardIdea = useSelector((state:RootState) => state.pageToEdit.wildcardIdea)
    const promptIdea = useSelector((state: RootState) => state.getPageImageModal.prompt)
    const type = useSelector((state: RootState) => state.getPageImageModal.type)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const previousPageText = useSelector((state: RootState) => state.pageToEdit.previousPageText)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const nextPageText = useSelector((state: RootState) => state.pageToEdit.nextPageText)
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const characters = useSelector((state: RootState) => state.characters)
    const { data: session } = useSession()
    const [userMessage, setUserMessage] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const initialMessage = 
    `
        Please read the following story: ${story}. This is an illustrated children's storybook. chat Gpt has made some suggestions for images for this page: ${pageText}.

        this user has selected this idea ${promptIdea}.  Please work with the user to perfect the image idea and generate a prompt for the image generating ai. 

    `;
    const [messages, setMessages] = useState<Message[]>([]);

 
    
// useEffect(() => {
//     if (pageText.length && storyId && story.length){
//     setMessages(prevMessages => [...prevMessages, { role: "system", content: initialMessage}]);
//     }
// }, [pageText, storyId, story])

// useEffect(() => {
//     if (messages.length == 1){
//         sendInitalMessage()
//     }
// }, [messages])

const sendImagineCommand = async() => {
    // let enhancedPageText = pageText;
    // enhancedPageText = enhancedPageText.replace(new RegExp(heroCharacterName, 'g'), `${heroCharacterName} (${characterDescription})`);
    
    // characters?.forEach(character => {
    //     enhancedPageText = enhancedPageText.replace(new RegExp(character.name, 'g'), `${character.name} (${character.description})`);
    // });
    setLoading(true)
    var data = JSON.stringify({
      msg: `In the style of Adam Stower illustrate an image for a children's book depicting ${promptIdea} `,
      ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: pageId, type: type },
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
      setLoading(false)
    })

    .catch(function (error) {
      console.log(error);
      setLoading(false)
    });
  }
const sendInitalMessage = async() => {
    setLoading(true)
    console.log('SENDIGING IM', initialMessage)
try{
    const response = await fetch('/api/aiChatGPTAssistant', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // promptType: 'backgroundImages', 
            userMessage: messages,
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

  return (
    <Draggable>
    <Transition.Root show={open} as={Fragment}>
        <Dialog
            as='div'
            className='fixed z-10 inset-0 overflow-y-auto'
            onClose={() => dispatch(updateGetPageImageModalStatus(false))}
            >
                <div className="flex items-endjustify-center min-h-[800px] sm:min-h-scree pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className='fixed inset-0' />
                        </Transition.Child>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                            >
                            &#8203;
                        </span>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                        {/* <p className="text-lg font-semibold text-gray-600 mb-2">{messages[messagesLength]?.content}</p> */}

                            {/* <img src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/aiAvatar.PNG?alt=media&token=204b1d94-f30b-4c3c-8a81-101d57673aa7" className="h-28 w-28 mx-auto my-5" /> */}
              

                <div>
                  
                <p>{promptIdea}</p>
                {imageUrl ? (
                  <img src={imageUrl} className="h-48 w-48" />
                ):
          
                <button className="bg-pink-500 text-white p-4 rounded-lg hover:bg-pink-300" onClick={sendImagineCommand}>{loading ? 'loading' : 'Get image'}</button>
                
                }
                </div>

            
            
      


                        </div>
                        </Transition.Child>
                </div>
            </Dialog>
    </Transition.Root>
    </Draggable>
  )
}

export default GetPageImageModal