'use client'

import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../app/GlobalRedux/store'
import { updateModalStatus } from "../app/GlobalRedux/Features/improveImagesModalSlice"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineRight } from "react-icons/ai"; // This is a right-facing arrow icon from the react-icons library
import axios from "axios"
import MessageForm from "./MessageForm"
import { db } from "../firebase"
import { doc, updateDoc, collection } from "firebase/firestore"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import updateUserNameForm from './UpdateUserNameForm'
import UpdateUserNameForm from "./UpdateUserNameForm"

interface Message {
    role: string;
    content: string;
}

function GreetingModal() {
    const dispatch = useDispatch()
    const open = useSelector((state: RootState) =>  state.imporoveStoryModal.status);
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const userNameFromServer = useSelector((state: RootState) => state.userDetails.username)
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const previousPageText = useSelector((state: RootState) => state.pageToEdit.previousPageText)
    const nextPageText = useSelector((state: RootState) => state.pageToEdit.nextPageText)
    const characters = useSelector((state: RootState) => state.characters)
    const heroDescription = useSelector((state: RootState) => state.pageToEdit.characterDescription)
    const heroName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)
    const { data: session } = useSession()
    const [userMessage, setUserMessage] = useState('')
    const [getImagePromptIdeasMessageAdded, setGetImagePromptIdeasMessageAdded] = useState(false)

    const [imageIdea, setImageIdea] = useState<string | null>(null)
    const [sendGetImagePromptsReady, setSendGetImagePromptsReady] = useState(false)
    // const [messagesLength, setMessagesLength] = useState(1)
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

    const [userName, setUserName] = useState<string>('')

    

    // fetch the aiAssistant message history!
    console.log('Story ID:', storyId);

   
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

        const responseData = await response.json();
        setUserMessage('')
        setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);

        }catch(err){
            console.error(err);
        }
    }}

    useEffect(() => {
        if (story && story.length > 100) {
            const initialMessage = `I want you to act as super friendly and helpful assistant. please read this story:  ${story}. When you have read the story tell the user you have read it, naming it by its title if it has one. Give a brief opinion of the story and ask how you can help. Please keep your response under 100 words`;
            setInitialMessage(initialMessage);
            setMessages([{ role: "system", content: initialMessage }]);
        }
    }, [story]);

    const sendImproveStoryInitialSystemMessage = async() => {
        console.log('this is the story', story)
        // setMessages([...messages, { role: "user", content: userMessage }]);
        try{
        const response = await fetch('/api/aiChatGPTAssistant', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessage: messages,
                promptType: promptType,
                storyId: storyId, 
                pageId: pageId, 
                userId: session!.user!.email
            }),
        })
          const responseData = await response.json();

       setUserMessage('')
       setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);
       setSendAddAPageOfTextMessage(false)
       setAiResponded(true) 
       }catch(err){
           console.error(err);
    }
}

  return (
    <Transition.Root show={open} as={Fragment}>
        <Dialog
            as='div'
            className='fixed z-10 inset-0 overflow-y-auto'
            onClose={() => dispatch(updateModalStatus(false))}
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
                            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
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
                            <img src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/aiAvatar.PNG?alt=media&token=204b1d94-f30b-4c3c-8a81-101d57673aa7" className="h-28 w-28 mx-auto my-5" />
                            
                        {userNameFromServer ? (

                            <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
                                <div>
                                    <p className="text-xl font-semibold text-indigo-500"> 
                                        As we embark on this journey, you and I are co-authors. I've read our first draft, and with your unique ideas, we can transform it into an epic adventure. How about we explore adding a hint of magic, a dose of thrill, or even a dash of mystery? Your voice is essential in shaping our narrative. So let's craft a tale that's truly 'you'! Ready to start? I can't wait to hear your brilliant ideas!
                                    </p>
                                    <input className="mt-4 w-full px-4 py-2 rounded-md border border-indigo-300 focus:outline-none focus:border-indigo-500" placeholder="Enter your name here..." />
                                </div>
                            </div>
                  
                            ):
                                <UpdateUserNameForm />
                        }
                            {/* {sendCustomMessage && <MessageForm submit={submit} userMessage={userMessage} setUserMessage={setUserMessage} />} */}

                        </div>

                        </Transition.Child>
                </div>
            </Dialog>
    </Transition.Root>
  )
}

export default GreetingModal