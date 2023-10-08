'use client'

import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { useSession } from "next-auth/react"
import Draggable from 'react-draggable'
import { RootState } from '../app/GlobalRedux/store'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import { setDesignCoverModalStatus } from '../app/GlobalRedux/Features/designCoverModalSlice'
import { BackwardIcon } from "@heroicons/react/24/solid"
import { getImageListItemBarUtilityClass } from "@mui/material"
import { setImageUrl } from "../app/GlobalRedux/Features/pageToEditSlice"
import Image from "next/image"

function CoverModal() {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const open = useSelector((state: RootState) =>  state.designCoverModal.status);
    const [openInputBox, setOpenInputBox] = useState(false)
    const [showButtons, setShowButtons] = useState(true)
    const [gettingSuggestions, setGettingSuggestions] = useState(false)
    const [showGettingImagePrompt, setShowGettingImagePrompt] = useState(false)
    const [gettingImage, setGettingImage] = useState(false)
    const [imagePrompt, setImagePrompt] = useState<string | null>(null)
    const [generatedSuggestions, setGeneratedSuggestions] = useState([])
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const coverImage = useSelector((state: RootState) => state.viewStory.coverImage)

    const getSuggestions = async() => {
        setShowButtons(false)
        setGettingSuggestions(true)
        const prompt = 
            `Your job is to act as a helpful assistant for the user who is trying to create a custom children's book.
            Please read this story ${story}. 
            Then respond with a list of 8 ideas for the image for the front cover of the book.
            
            You must structure your response in this way: 

            "Friendly message to the user. 

                1: idea,
                2: idea,
                3: idea

            "
            etc`
        try{
            const response = await fetch('/api/createCoverImagePrompt', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promptType: 'getCoverImageIdeas', 
                    prompt: prompt,
                    session: session,
                    storyId: storyId, 
    
                }),
            })

            const data = await response.json(); // Parse JSON response
            const suggestionsArray = data.coverImagePrompt.split('\n'); // Split by new line character

            setGeneratedSuggestions(suggestionsArray); 
            setGettingSuggestions(false)
        }catch(err){
            console.log(err)
        }
    }

    const userIdeas = () => {
        setOpenInputBox(true)
        setShowButtons(false)
    }

    const send = async() => {

    }

    const goBack = () => {
        setOpenInputBox(false)
        setShowButtons(true)
    }

    const handleSuggestionClick = async(suggestion: string) => {
        // Implement the desired behavior here, such as setting a state for the clicked suggestion or performing an action with it.
        setShowGettingImagePrompt(true)
        // setGettingSuggestions(true)
        const prompt = 
            `
                Your job is to act create an image prompt for an ai image generator called midjourney. The children's book is for a 4 year old child.
                the image should depict: ${suggestion}. Your answer should only give the prompt, absolutely no other introduction or premamble. 
                Your prompt should describe the color pallete, style, scene, artist, and find a way to build a blank space into the image so that the typogrphy can be clearly shown on the top.  
                Remember thay the ai image generator has no knowledge of the story or anything described in it such as characters or places, so if you want to include these they must be clearly and succinctly described. 

            `
        try{
            const response = await fetch('/api/createCoverImagePrompt', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promptType: 'getImagePrompt', 
                    prompt: prompt,
                    session: session,
                    storyId: storyId, 
    
                }),
            })
            const data = await response.json(); // Parse JSON response
            setImagePrompt(data.coverImagePrompt); 
            setShowGettingImagePrompt(false)
        }catch(err){
            console.log(err)
        }
    };

    useEffect(() => {
        setGettingImage(true)
        if (!imagePrompt) return;
        else if (imagePrompt){
            getImage()
        }
    }, [imagePrompt])

    const getAudio = () => {
        try{
        fetch('/api/elevenLabs', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: imagePrompt, voice: '21m00Tcm4TlvDq8ikWAM', pageId: 'page_1', storyId: storyId, session: session })
                    }).then(async (response) => {
                      const blob = await response.blob();
        setImageUrl('image url')
        setGettingImage(false)
    })
        }
    catch(err){
            console.log(err)
            setGettingImage(false)
}}

const getImage = async() => {
    if (!session || !storyId || !imagePrompt) return;
      // setLoading(true)
      var data = JSON.stringify({
        msg: imagePrompt,
        ref: { storyId: storyId, userId: session!.user!.email, action: 'imagineCoverImage' },
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
      .then(function (response: any) {
        console.log(JSON.stringify(response.data));
        // setLoading(false)
      })
      .catch(function (error: any) {
        console.log(error);
        // setLoading(false)
      });
    }
    

  return (
    <Draggable>
    <Transition.Root show={open} as={Fragment}>
        <Dialog
            as='div'
            className='fixed z-10 inset-0 overflow-y-auto flex justify-center items-center'

            onClose={() => dispatch(setDesignCoverModalStatus(false))}
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

<div className="inline-block align-bottom bg-blue-400 rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full min-h-[600px] min-w-[600px] sm:p-6 items-center">
                        {/* <p className="text-lg font-semibold text-gray-600 mb-2">{messages[messagesLength]?.content}</p> */}

                            {/* <img src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/aiAvatar.PNG?alt=media&token=204b1d94-f30b-4c3c-8a81-101d57673aa7" className="h-28 w-28 mx-auto my-5" /> */}
              
                    {showButtons && !coverImage && (
                            <div>
                            <p>Do you have ideas for the front cover or would you like me to genreate some suggestions? </p>
                            <div className="flex space-x-4 py-5">
                                <button className="bg-pink-500 text-white shadow-xl hover:bg-pink-300 rounded-lg p-4" onClick={getSuggestions}>
                                    Give me Suggestions
                                </button>   
                                <button className="bg-pink-500 text-white shadow-xl hover:bg-pink-300 rounded-lg p-4" onClick={userIdeas}>
                                    Use My Ideas
                                </button>   
                            </div>
                        </div>
                    )}
                
                {openInputBox && showButtons == false && !coverImage && (
                <div>
                        <BackwardIcon className="text-green-500 hover:text-purple-500 h-8 w-8 absolute left-0 top-0" onClick={goBack} />
                    <div className="w-full items-center text-center space-y-4"> 


                        <p>What are your ideas for the front cover? </p>
                        <input className="w-full border border-gray-300 rounded-lg h-8" />
                        <button className="bg-pink-500 text-white shadow-xl hover:bg-pink-300 rounded-lg py-4 px-8" onClick={send}>
                            send
                        </button> 
                    </div>
                </div>
                )}

                {gettingSuggestions && !generatedSuggestions && !imagePrompt && !coverImage && (
                    <p>Ok great. just give me a second while i think up some ideas. </p>
                )}

                {generatedSuggestions.length > 0 && !coverImage && (
                    <div>
                        <p>Here are some suggestions for the front cover:</p>
                        <ul className="space-y-2">
                            {generatedSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer hover:bg-purple-100 p-2 rounded"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>

                )}

                {/* {imagePrompt && (
                    <p>{imagePrompt}</p>
                )} */}
        

                {showGettingImagePrompt && !coverImage && (
                    <p>Cool. ill start getting image for you now!</p>
                )}

            {gettingImage && !coverImage && (
                    <p>Your image is being created. Ill have four versions ready for you soon!</p>
                )}

                        
         
                        
                        
                    </div>
                </Transition.Child>
            </div>

        
            </Dialog>
    </Transition.Root>
    </Draggable>
  )
}

export default CoverModal