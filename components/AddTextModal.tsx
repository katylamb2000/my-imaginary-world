'use client'

import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../app/GlobalRedux/store'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { updateAddTextModalStatus } from "../app/GlobalRedux/Features/addTextModalSlice";
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

function AddTextModal() {
    const dispatch = useDispatch()
    const open = useSelector((state: RootState) =>  state.addTextModal.status);
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const previousPageText = useSelector((state: RootState) => state.pageToEdit.previousPageText)
    const nextPageText = useSelector((state: RootState) => state.pageToEdit.nextPageText)
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const characters = useSelector((state: RootState) => state.characters)
    const { data: session } = useSession()
    const [userMessage, setUserMessage] = useState('')
    const [getImagePromptIdeasMessageAdded, setGetImagePromptIdeasMessageAdded] = useState(false)
    const [imageIdea, setImageIdea] = useState<string | null>(null)
    const [sendGetImagePromptsReady, setSendGetImagePromptsReady] = useState(false)
    const [aiResponded, setAiResponded] = useState(false)
    const [sendCustomMessage, setSendCustomMessage] = useState(false)
    const [showInitialOptions, setShowInitialOptions] = useState(true)
    const [initialMessage, setInitialMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([]);
    const [imagePrompt, setImagePrompt] = useState<string | null>(null)
    const [noText, setNoText] = useState<boolean>(true)
    const [sendAddAPageOfTextMessage, setSendAddAPageOfTextMessage] = useState<boolean>(false)
    const [promptType, setPromptType] = useState<string | null>(null)
    const [title, setTitle] = useState<string>('')
    const [sendGenerateTitleIdeas, setSendGenerateTitleIdeas] = useState<boolean>(false)
    const [selectedTitle, setSelectedTitle] = useState<string>('')
    const [getBookCoverImagePrompt, setGetBookCoverImagePrompt] = useState<boolean>(true)

    // fetch the aiAssistant message history!   
      const submit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() 
        if (messages.length){
        try{
            setMessages([...messages, { role: "user", content: userMessage }]);
            const response = await fetch('/api/aiChatGPTAssistant', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userMessage: messages, 
            
                }),
            })
        }catch(err){
            console.log(err)
        }
        }
    }

  return (
    <Draggable>
    <Transition.Root show={open} as={Fragment}>
        <Dialog
            as='div'
            className='fixed z-10 inset-0 overflow-y-auto'
            onClose={() => dispatch(updateAddTextModalStatus(false))}
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
                            {/* <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' /> */}

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

                            <img src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/aiAvatar.PNG?alt=media&token=204b1d94-f30b-4c3c-8a81-101d57673aa7" className="h-28 w-28 mx-auto my-5" />
              

                            <h1>
                                On this modal i want to chat with gpt about additional text ideas. 
                                 Once the text idea is agreed on it should be saved to firebase. 

                                it should especially focus on dialog or other literary devices.  
                            </h1>

   


                        </div>
                        </Transition.Child>
                </div>
            </Dialog>
    </Transition.Root>
    </Draggable>
  )
}

export default AddTextModal