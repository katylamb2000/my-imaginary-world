'use client'

import { ArrowLeftIcon as BackOutline } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid } from "@heroicons/react/24/solid"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from '../app/GlobalRedux/store'
import { updateimproveStoryModalStatus } from '../app/GlobalRedux/Features/improveStoryModalSlice'
import { setEditBarType, setShowEditTextIcon } from "../app/GlobalRedux/Features/pageToEditSlice"
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
import { Disclosure } from '@headlessui/react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setStoryId } from "../app/GlobalRedux/Features/viewStorySlice"
import { usePathname } from "next/navigation"
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice"

interface Message {
    role: string;
    content: string;
}

function ImproveStorySideBar() {
    const dispatch = useDispatch()
    const pathname = usePathname()
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
    const [loading, setLoading] = useState(false)
    const [getImagePromptIdeasMessageAdded, setGetImagePromptIdeasMessageAdded] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [suggestionsAnswer, setSuggestionsAnswer] = useState<string | null>(null)
    const [introduction, setIntroduction] = useState<string>('');
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
    const [getAIHelpToImproveStory, setGetAIHelpToImproveStory] = useState<boolean>(false)
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        if (storyId || !pathname) return;
        const regex = /^\/story\/([a-zA-Z0-9]+)$/;
        const id = regex.exec(pathname);
      
        if (id) {
          const identifier = id[1];
        //   setStoryId(identifier);  
        dispatch(setStoryId(identifier))
        } else {
          console.log("No match");
        }
      }, [pathname, storyId])
    

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

        const responseData = await response.json();
        setUserMessage('')
        setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);

        }catch(err){
            console.error(err);
        }
    }}

    useEffect(() => {
        if (story) {
            const initialMessage = `I want you to act as super friendly and helpful assistant. please read this story:  ${story}. When you have read the story tell the user you have read it, naming it by its title if it has one. Give a brief opinion of the story This should be less than 100 words. 
            And then list 4 ways the story can be improveed to ake it more engaging and entertainng for a young child. Think about specific literary techniques that authors use when creating popular books for young readers. Do not give any suggestions related to images as we will be working on images later. Please keep your response under 60 words
            When giving the four suggestions structrue the response like this: 
            
            1. suggestion title
            this is a more detailed explanation of the suggestion.
            
            2. suggestion title
            this is a more detailed explanation of the suggestion.
            
            3. suggestion title
            this is a more detailed explanation of the suggestion.
            
            4. suggestion title
            this is a more detailed explanation of the suggestion.`;
            setInitialMessage(initialMessage);
            setMessages([{ role: "system", content: initialMessage }]);
        }
    }, [story]);

    const sendImproveStoryInitialSystemMessage = async() => {
        setLoading(true)
        try{
        const response = await fetch('/api/aiChatGPTAssistant', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userMessage: messages,
                promptType: 'initialRead',
                storyId: storyId, 
                pageId: pageId, 
                userId: session!.user!.email
            }),
        })
          const responseData = await response.json();
                console.log(responseData)
            setUserMessage('')
            setSuggestionsAnswer(responseData.answer)
            setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);
            setSendAddAPageOfTextMessage(false)
            setAiResponded(true) 
            setLoading(false)
       }catch(err){
           console.error(err);
           setLoading(false)
    }
}

useEffect(() => {
    if (suggestionsAnswer) {
      const firstPart = suggestionsAnswer.split('\n')[0]; 
      setIntroduction(firstPart);

      const suggestionArray = suggestionsAnswer.match(/(\d\..*?)(?=\d\.|$)/gs);

      if (suggestionArray) {
        setSuggestions(suggestionArray.map(suggestion => suggestion.trim()));
      }
    }
  }, [suggestionsAnswer]);

  const handleHelpMe = (index: number, text: string) => {
    console.log('help me', index, text)
  }

  const handleDoIt = async(index: number, text: string) => {
    console.log('do it', index, text)
        const doItPrompt = 
        // `
        // I want you to improve this story ${story} by making it a rhyming and hilarious story. Keep the original page structure. 
        // The story must be structured into exactly 14 pages and a title page. The structure should be as follows:
        
        // Message from chat GPT: explain the ehancements you have made. 

        // Title: 
        
        // Page 1: 
        
        // Page 2: 
        
        // etc`
        `
            I want you to improve this story ${story} by doing the following: ${text}. Keep the original page structure. 
            The story must be structured into exactly 14 pages and a title page. The structure should be as follows:
            
            Message from chat GPT: explain the ehancements you have made. 

            Title: 
            
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
                promptType: 'improveStory', 
                prompt: doItPrompt,
                session: session,
                storyId: storyId, 

            }),
        })
        console.log('response from api', response)
    }catch(err){
        console.log(err)
    }
    }

    const goBack = () => {
        dispatch(setEditBarType('main'))
        dispatch(setName('InsidePage'))
    }

    useEffect(() => {
      if (!getAIHelpToImproveStory) return;
      else if (getAIHelpToImproveStory){
        sendImproveStoryInitialSystemMessage()
      }
    }, [getAIHelpToImproveStory])

  return (
    <div className="bg-white h-screen ml-2 mr-8">

    <div className='space-y-6 w-full pt-8 '>
        <div className="space-x-4 w-full flex h-12 items-center group cursor-pointer">
          <BackOutline className="h-8 w-8 text-purple-600 font-bold group-hover:text-purple-400" onClick={goBack} />
          <p className="text-purple-600 font-bold group-hover:text-purple-400">Go back</p>
        </div>

    {getAIHelpToImproveStory &&  (
      <div> 
        {loading && (
            <p className="text-gray-600 text-sm">
              I am just reading they story. I'll let you know my thoughts in a
              few.
            </p>
          )}

          {/* {messages.length == 1 && !loading && (
            <button
              onClick={sendImproveStoryInitialSystemMessage}
              className="py-2 px-4 my-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-700 transition-colors"
            >
              send prompt
            </button>
          )} */}

            {suggestions.length > 0 && (
    <div className="mt-4">
            <h1 className="font-semibold text-lg mb-2">Story Improvement Suggestions</h1>
            <p className="text-gray-600 text-sm mb-4">{introduction}</p>
            {suggestions.map((suggestion, index) => (
                <Accordion key={index} className="mb-2">
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    className="bg-indigo-500 text-white"
                    >
                    <Typography className="font-medium">
                        {suggestion.split("\n")[0]}
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography className="text-sm mb-2">
                        {suggestion.split("\n")[1]}
                    </Typography>
                    <div className="flex justify-end space-x-2">
                        <button
                        className="py-1 px-2 bg-violet-500 text-white rounded-md shadow-md hover:bg-yellow-700 transition-colors"
                        onClick={() => handleHelpMe(index, suggestion.split("\n")[1])}
                        >
                        Help Me
                        </button>
                        <button
                        className="py-1 px-2 bg-rose-400 text-white rounded-md shadow-md hover:bg-green-700 transition-colors"
                        onClick={() => handleDoIt(index, suggestion.split("\n")[1])}
                        >
                        Do It
                        </button>
                    </div>
                    </AccordionDetails>
                </Accordion>
))}




          </div>

            )}
      </div>
      )}
          </div>
        {getAIHelpToImproveStory == false && (
          <div>
            <div  className="h-18 w-full border-t-2 border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  "
                  onClick={() => dispatch(setShowEditTextIcon(true))}
            >
              <button className="text-purple-500 group-hover:text-white p-4 ">Edit text like a human</button>
            </div>

            <div  className="h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  "
                  onClick={() => (setGetAIHelpToImproveStory(true))}
            >
              <button className="text-purple-500 group-hover:text-white p-4 ">Get Ai to edit text</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default ImproveStorySideBar