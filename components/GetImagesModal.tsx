'use client'

import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../app/GlobalRedux/store'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { updateGetImagesModalStatus } from "../app/GlobalRedux/Features/getImagesModalSlice";
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

function GetImagesModal() {
    const dispatch = useDispatch()
    const open = useSelector((state: RootState) =>  state.getImagesModal.status);
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
    const [loading, setLoading] = useState<boolean>(false)
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

    const handleGetImagePrompts = async() => {
        setLoading(true)
        const imageDescriptionsPrompt = `
        Please read the following story: ${story}. Your task is to envision the artwork for this children's storybook. Each 'page' refers to a two-page spread, and you should visualize this as a single, unified image that spans both pages. Make decisions that you believe will result in the most engaging and immersive storybook experience for a young reader. Maintain the original structure of the story, but feel free to interpret the text creatively.
        
        The response must be structured into exactly 14 sections, corresponding to the 14 pages of the book. For each page, describe the key elements and actions, the characters' appearances and emotions, the setting details, and the interactions between characters and their environment. Include a detailed description of each character and their unique features to maintain consistency across the book. As part of each page's description, also hint at the artistic style, including color palette and overall aesthetic that could best bring this scene to life, considering the story's mood and setting.
        
        The structure of the response should be as follows:
        
        Page 1: 
        
        Page 2: 
        
        ...and so forth.`;
        
    try{
        const response = await fetch('/api/createStoryImagePrompts', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                promptType: 'imageDescriptions', 
                prompt: imageDescriptionsPrompt,
                session: session,
                storyId: storyId, 

            }),
        })
        console.log('response from api', response)
        setLoading(false)
        dispatch(updateGetImagesModalStatus(false))
    }catch(err){
        console.log(err)
        setLoading(false)
    }
}

const handleGetImageBackgrounds = async() => {
    setLoading(true)
    const imageDescriptionsPrompt = 
    `
        Please read the following story: ${story}. This is an illustrated children's storybook. 

        Your task is to create prompts that I will send to an AI image generator. For each page, I want you to create 4 separate prompts. 

        For each page, respond in this format:
        {
            "pageNumber": "page number",
            "backgroundImage": "background prompt",
            "characterCloseUp": "character prompt",
            "object": "object prompt",
            "wildCardImage": "wild card prompt"
        }
        
        1. Background image: Only describe the background setting, don't mention any characters. Make decisions that will result in the most engaging and immersive storybook experience for a young reader. The background could be a single element of the picture or more like a general pattern, be creative.
        
        2. Character close up: Focus very strongly on the character's expression, pose, and movements. These should be highly exaggerated and dynamic. Take into account their current emotions and actions in the story, and reflect this in the prompt. The character should be in the midst of an action, not just static or posing.
        
        3. Object or artifact from the scene: This should be the most important object in the scene. It should be on a white background unless the background is super important.
        
        4. Wild card image: For this image, you have complete freedom. Describe anything you think will make that page more funny, engaging, add to the storytelling, or generally improve the book. Be super creative, think out of the box and bring some magic to the scene!
        
        Each prompt should be succinct and clear for an AI to understand. Give camera angles, color palettes, and write in simple present tense.
        
        The response must be structured into exactly 14 sections, corresponding to the 14 pages of the book. As part of each page's description, also hint at the artistic style, including color palette and overall aesthetic that could best bring this scene to life, considering the story's mood and setting.
    `
;
    
try{
    const response = await fetch('/api/createStoryImagePrompts', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            promptType: 'backgroundImages', 
            prompt: imageDescriptionsPrompt,
            session: session,
            storyId: storyId, 

        }),
    })
    console.log('response from api', response)
    setLoading(false)
    dispatch(updateGetImagesModalStatus(false))
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
            onClose={() => dispatch(updateGetImagesModalStatus(false))}
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
              

                            <h1>On this modal i want to chat with gpt about image ideas, whether there shold be one image or multiple. What size they should be etc. Once the image idea is agreed on the ai should create an image prompt and send it to midjourney.  And then work with ai to improve images if they are not right.  </h1>
                {!loading && (
                            <button 
                            className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                            onClick={handleGetImagePrompts}
                        >
                            Get image ideas
                        </button>   
                ) }
            
            {!loading && (
                            <button 
                            className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                            onClick={handleGetImageBackgrounds}
                        >
                            Get background ideas
                        </button>   
                ) }


                        </div>
                        </Transition.Child>
                </div>
            </Dialog>
    </Transition.Root>
    </Draggable>
  )
}

export default GetImagesModal