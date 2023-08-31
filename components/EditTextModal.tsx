'use client'

import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../app/GlobalRedux/store'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { updateEditTextModalStatus } from "../app/GlobalRedux/Features/editTextModalSlice";
import { AiOutlineRight } from "react-icons/ai"; // This is a right-facing arrow icon from the react-icons library
import axios from "axios"
import MessageForm from "./MessageForm"
import { db } from "../firebase"
import { doc, updateDoc, collection } from "firebase/firestore"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import Draggable from "react-draggable";
import process from "process";
interface Message {
    role: string;
    content: string;
}

function EditTextModal() {
    const dispatch = useDispatch()
    const open = useSelector((state: RootState) =>  state.editTextModal.status);
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
    const [audioUrl, setAudioUrl] = useState<any | null>(null)
    const [suggestions, setSuggestions] = useState<string | null>(null)
    const [customCss, setCustomCss] = useState<string | null>(null)

    const improveContentAndAddTypogrphy =`As an AI language model, your goal is to elevate the narrative of a children's story. Stories for children should be engaging, imaginative, and filled with emotions, adventures, and lessons. The characters should be relatable and the plot captivating. Here are some elements you should focus on:

    Characters: Make the characters vibrant and multi-dimensional. They should have unique personalities, desires, and fears.
    
    Plot: The plot should be intriguing, filled with interesting twists and turns. It should keep the young readers on their toes, wanting to know what happens next.
    
    Setting: The setting should be vividly described, so readers feel like they are part of the story.
    
    Language: Use simple, clear language, but don't shy away from introducing new words. Make the dialogues lively and full of emotions.
    
    Conflict and Resolution: There should be a clear conflict that the characters need to resolve. The resolution should be satisfying and provide a sense of closure.
    
    Lesson or Moral: Most children's stories have a lesson or moral. Make sure it's subtly woven into the narrative and not preached.
    
    Using these principles, take a look at the following story, ${story}, and specifically focus on enhancing this page, ${pageText}, making it more engaging, vivid, and memorable. Keep your response to under 50 words.`

    //   console.log('Story=> ', story)
    //   console.log("page text", pageText)

    // fetch the aiAssistant message history!   

    const sendFirstMessage = async() => {
        try{
            console.log('sending message')
            console.log('sending THIS message', messages[0])
            const response = await fetch('/api/aiChatGPTAssistant', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userMessage: messages, 
                }),
            })
            console.log(response)
            // setSuggestions(response)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        if (!messages.length && pageText.length && story?.length){
            console.log('these are messages', messages)
            setMessages([...messages, { role: "system", content: improveContentAndAddTypogrphy }]);
        } 
        // if (messages.length == 1){
        //     console.log('these are messages NOw', messages)
        //     sendFirstMessage()
        // }  
    }, [messages, story, pageText])

    const textToSpeeech = async () => {
        fetch('/api/elevenLabs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message:  pageText, voice: '21m00Tcm4TlvDq8ikWAM' })
          }).then(async (response) => {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            new Audio(url).play();
          }).catch(console.error);
    }

    const handleClick = async () => {
        try {
            // const audioUrl = await textToSpeech(voice_id, text);
            let audio = new Audio(audioUrl); // Create a new Audio object with the blob url
            audio.play(); // Play the audio
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     if (pageText.length){
    //         textToSpeeech()
    //     }
    // }, [pageText])

  return (
    <Draggable>
    <Transition.Root show={open} as={Fragment}>
        <Dialog
            as='div'
            className='fixed z-10 inset-0 overflow-y-auto'
            onClose={() => dispatch(updateEditTextModalStatus(false))}
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

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl border border-gray-300 transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                        {/* <p className="text-lg font-semibold text-gray-600 mb-2">{messages[messagesLength]?.content}</p> */}

                            <img src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/aiAvatar.PNG?alt=media&token=204b1d94-f30b-4c3c-8a81-101d57673aa7" className="h-28 w-28 mx-auto my-5" />
                            
                            
                            {audioUrl && (
                                    <div>
                                        <button onClick={handleClick}>speak it</button>
                                    </div>
                            )}

                            {messages.length == 1 && (
                                <button onClick={sendFirstMessage}>level up text</button>
                            )}

                            {!audioUrl && pageText && (
                                    <div>
                                        <button onClick={textToSpeeech}>Convert Text to Speech</button>
                                    </div>
                            )}
                         
                            {/* <h1>
                            What should this module do? 
                            </h1>
                            <p>
                                1. read this page of text and the previous and next. 
                            </p>
                            <p>
                                2. figure out how to improve the text based on using the list of things that can be done to improve the enagagement, 
                            </p>
                            <p>
                                3. return the text with improved typogrphy including the classNames. 
                            </p> */}

                            {/* <p>{pageText}</p> */}
   


                        </div>
                        </Transition.Child>
                </div>
            </Dialog>
    </Transition.Root>
    </Draggable>
  )
}

export default EditTextModal