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


interface Message {
    role: string;
    content: string;
}

function ImproveImagesModal() {
    const dispatch = useDispatch()
    const open = useSelector((state: RootState) =>  state.improveImagesModal.status);
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
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

           // Parse the server's response
           const responseData = await response.json();

           // Make sure the response is OK before proceeding
        //    if (!response.ok) {
        //        throw new Error(responseData.message || 'Server error');
        //    }
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

    useEffect(() => {
        if (!messages.length) {
            console.log("not ready to send initial message yet")
        } else if (messages.length == 1){
            console.log("now we have the message with story", messages)
            // talkToChatGPTNotGettingImagePrompt()
        }
    }, [messages])
    

    const talkToChatGPTNotGettingImagePrompt = async() => {
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

    useEffect(() => {
        if(pageText == ''){
            setNoText(true)
            setShowInitialOptions(false)
        }
        else if (pageText.length > 1){
            setNoText(false)
        }
    }, [pageText])

  const pushGetImagePromptIdeasMessage = () => {
    if (pageText == ''){
        console.log('this page has no text')
    }else{
        const userMessage = `I need an image for this page in the story ${pageText} what do you think would be a good idea for the image or images to show on this page?. In your reply please do not reference yourself in any way. Your answer should be structured so that you give an explanation of how many images you think should go on this page: 1, 2, 3, 04 four and then describe the pictures. Do not give them as options just give a recomendation and ask what the user thinks about that.  `
        setMessages(prevMessages => [...prevMessages, { role: "user", content: userMessage }]);
        setGetImagePromptIdeasMessageAdded(true)
    }}

    useEffect(() =>{
        if (getImagePromptIdeasMessageAdded){
            getImagePromptIdeas()
        }
    }, [getImagePromptIdeasMessageAdded] )

    const getImagePromptIdeas = async() => {
        try{
        console.log('this is the page text', pageText)
        const response = await fetch('/api/aiChatGPTAssistant', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessage: messages,
                promptType: 'imageIdeas'
            }),
        })
          const responseData = await response.json();
          console.log(responseData)
       setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);
       setImageIdea(responseData.answer)
       setUserMessage('')
       setShowInitialOptions(false)
    }catch(err){
        console.log(err)
    }
  }

const getImagePrompts = () => {
        const requestImagePrompt = `Please write an image prompt that I will give to an image generating ai. The image prompt should depict ${imageIdea} for an illustrated children's storybook. Here are descriptions of the characters in the story ${characters}. Please refer to these descriptions when referencing the characters so that they are consistent with other images in the book. Make sure the image is illustrated in the style of ${style}. When responding please only give the image prompt and no other communications with the user. The prompt should be direct and written in present tense english, please refence camera angles or other details to communicate your exact vision `
        setMessages(prevMessages => [...prevMessages, { role: "user", content: requestImagePrompt }]);
        setSendGetImagePromptsReady(true)
}
        // i have said those image prompts sound good. so i should save the idea to firebase for this page. 
        // then i should request an image prompt making sure to reference the character descriptions. style. color pallete etc. 
        // then i should send the prompt request to midjourney. 
    useEffect(() => {
        if (!sendGetImagePromptsReady) return;
        sendGetImagePrompts()
    }, [sendGetImagePromptsReady])

    const sendGetImagePrompts = async() => {
        try{
        // console.log('this is the page text', pageText)
        const response = await fetch('/api/aiChatGPTAssistant', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessage: messages,
                promptType: 'imagePrompts'
            }),
        })
          const responseData = await response.json();
          console.log(responseData)
            setImagePrompt(responseData.answer)
    //    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);
       setUserMessage('')
       setShowInitialOptions(false)
       setSendGetImagePromptsReady(false)
        }catch(err){
            console.log(err)
            setSendGetImagePromptsReady(false)
    }
}
        useEffect(() => {
            if (!imagePrompt) return;
            if (imagePrompt){
                console.log("imagePrompt", imagePrompt)
                sendPromptToMidjourney()
            } 
        }, [imagePrompt])



        const sendPromptToMidjourney = async() => {
            console.log('is this the PROBLEM????', imagePrompt)
            var data = JSON.stringify({
                msg: imagePrompt,
                ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: pageId },
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
                console.log('this is the error', error);
      
              });
        }

        const sendPromptToMidjourneyForDoublePageImage = async() => {
            console.log('is this the PROBLEM????', imagePrompt)
            var data = JSON.stringify({
                msg: imagePrompt,
                ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: pageId },
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
                console.log('this is the error', error);
      
              });
        }

    const getDoublePageImageIdea = async() => {
        console.log(previousPageText, '====>', nextPageText)
        const doublePageImageIdeaPrompt = `for the story ${story} I have a blank page page between ${previousPageText} and ${nextPageText}. On this page I want to create a really exciting image. Please give me a really fun and creative idea for an image or multiple images that I can put here that will appeal to a child. Please be as creative as you possibly can.  `
        setMessages(prevMessages => [...prevMessages, { role: "user", content: doublePageImageIdeaPrompt }]);
        // setSendGetImagePromptsReady(true)
    }

    const addAPageOfText = () => {
        setPromptType('addAPageOfText')
        const addAPageOfTextPrompt = `For the story ${story}, I have a blank page between ${previousPageText} and ${nextPageText}. On this page I would like to add a page of text which improves the story and its appeal to a child, making it more engaging. Please respond only with the text that will go in the story and absolutely no other communication. Your response should be under 50 words.`
        setMessages(prevMessages => [...prevMessages, { role: "user", content: addAPageOfTextPrompt }]);
        setSendAddAPageOfTextMessage(true)
   
    }

    useEffect(() => {
        if (!sendAddAPageOfTextMessage) return;
        if (sendAddAPageOfTextMessage) {
            talkToChatGPTNotGettingImagePrompt()
        }
    }, [sendAddAPageOfTextMessage])

    const getBookCoverImage = () => {
        console.log('get book cover ideas')
        const bookoverImagePrompt = `For this story: ${story} please write an image prompt I can give to an ai art generator to create the book cover for this book. It should be whimsical and engaging for a small child and should reference the style of ${style}. The prompt should make sure that there is some space in the image for the image title. When you return the prompt only give the prompt and no additional communication. `
   
        setMessages(prevMessages => [...prevMessages, { role: "user", content: bookoverImagePrompt }]);
        setSendGetImagePromptsReady(true)
    } 

    const getTitleIdeas = () => {
        console.log('get book title ideas')
        setPromptType('getTitleIdeas')
        const getTitleIdeasPrompt = `For the story ${story}, I want you to generate a list of 10 creative title ideas that will appeal to a child called ${heroName}. Generate your response in the form of a list like this: 
        1. title one, 
        2. title two, 
        3, title three etc`
         setMessages(prevMessages => [...prevMessages, { role: "user", content: getTitleIdeasPrompt }]);
         setSendGenerateTitleIdeas(true)

    } 


    useEffect(() => {
        if (!sendGenerateTitleIdeas) return;
        if (sendGenerateTitleIdeas) {
            talkToChatGPTNotGettingImagePrompt()
        }
    }, [sendGenerateTitleIdeas])

    const handleTitleClick = (title: string) => {
        const cleanedTitle = title.replace(/^\d+\.\s*/, '').trim();
        // Save cleaned title to state
        setSelectedTitle(cleanedTitle);

    }

    useEffect(() => {
        if (!selectedTitle.length) return;
        console.log('selectedTitle', selectedTitle)
        const updateTitle = async () => {
            const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", 'page_1');
            await updateDoc(docRef, {
              text: selectedTitle
            });
        };
    
        updateTitle();
        dispatch(updateModalStatus(false))
    }, [selectedTitle]);
    

    useEffect(() => {

    }, [])

    const handleGetImagePrompts = async() => {
            const imageDescriptionsPrompt = `
                I want you to read this story ${story} and describe the image or images which should go on each page. Each page is actually a double page of a children's story book, so if you choose to have one image it would be spread across the two pages. Or you can have multiple smaller images that show part of a single scene or show a scene progressing. You should make decisions based on wehat will be create the most engaging story book for a young reader. Keep the original page structure. 
                The response must be structured into exactly 14 pages and also give a describtion of the style choices you would use throughout the book, including reference to artists, mediums, color pallete and other important asthetics. The structure should be as follows:
                
                Overall style: 
                
                Page 1: 
                
                Page 2: 
                
                etc`
        try{
            const response = await fetch('/api/createStory', {
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
        }catch(err){
            console.log(err)
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
                        {/* <p className="text-lg font-semibold text-gray-600 mb-2">{messages[messagesLength]?.content}</p> */}

                            <img src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/aiAvatar.PNG?alt=media&token=204b1d94-f30b-4c3c-8a81-101d57673aa7" className="h-28 w-28 mx-auto my-5" />
                            {/* {messages.filter(msg => msg.role === 'assistant').slice(-1).map((msg, index) => 
                                <p key={index}> {msg.content} </p>
                            )} */}

                {messages.filter(msg => msg.role === 'assistant').slice(-1).map((msg, index) => {
                    if(promptType === 'getTitleIdeas') {
                        // Splitting on newline pattern
                        const lines = msg.content.split(/\n/g);
                        return lines.map((line, lIndex) => {
                            // Check if line starts with a number (title idea)
                            if (/^\d/.test(line.trim())) {
                                return <p key={`${index}-${lIndex}`} className="cursor-pointer hover:text-purple-600" onClick={() => handleTitleClick(line.trim())}>{line.trim()}</p>
                            } else {
                                return <p key={`${index}-${lIndex}`}>{line}</p>
                            }
                        })
                    } else {
                        return <p key={index}>{msg.content}</p>
                    }
                })}

           

        {sendCustomMessage && <MessageForm submit={submit} userMessage={userMessage} setUserMessage={setUserMessage} />}

        {showInitialOptions && aiResponded && sendCustomMessage == false && (
               <div className="grid grid-cols-2 gap-4 mt-4">
               <button 
                   className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                   onClick={() => pushGetImagePromptIdeasMessage()}
               >
                   Get image URLs
               </button>
       
               <button 
                   className="py-2 px-4 bg-yellow-500 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                   onClick={() => { /* function here */ }}
               >
                   Change layout
               </button>
               <button 
                   className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                   onClick={() => setSendCustomMessage(true)}
               >
                   Custom message
               </button>
           </div>     
        )}

        {showInitialOptions == false && noText == false && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                  <button 
                      className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                      onClick={() => getImagePrompts()}
                  >
                      Sounds good
                  </button>
                  <button 
                      className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                      onClick={() => { /* function here */ }}
                  >
                      Lets work on those ideas
                  </button>
            </div>
        )}

        {noText && pageId !== 'page_1' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                  <button 
                      className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                      onClick={() => addAPageOfText()}
                  >
                      Add text
                  </button>
                  <button 
                      className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                      onClick={() => getDoublePageImageIdea()}
                  >
                    Make a double page image
                  </button>
            </div>
        )}

        {pageId == "page_1" && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                           <button 
                               className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                               onClick={() => getTitleIdeas()}
                           >
                               Generate title ideas
                           </button>
                           <button 
                               className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                               onClick={() => getBookCoverImage()}
                           >
                             Get book cover image ideas
                           </button>
                     </div>
        )}


                        </div>

                        </Transition.Child>
                </div>
            </Dialog>
    </Transition.Root>
  )
}

export default ImproveImagesModal