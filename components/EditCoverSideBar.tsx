import { useState, useEffect } from 'react'
import { ArrowLeftIcon as BackOutline } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice"
import GetBookCoverIdeas from './GetBookCoverIdeas'
import ChooseImageVersion from './ChooseImageVersion'
import { RootState } from '../app/GlobalRedux/store'
import { useSession } from 'next-auth/react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'

function EditCoverSideBar() {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const heroName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)

    const [editStage, setEditStage] = useState('1')
    const [promptType, setPromptType] = useState<string | null>()
    const [messages, setMessages] = useState<{ role: string; content: any; }[]>([]);
    const [userMessage, setUserMessage] = useState<string>("")
    const [aiResponded, setAiResponded] = useState(false)
    const [sendGenerateTitleIdeas, setSendGenerateTitleIdeas] = useState(false)
    const [titleSuggestions, setTitleSuggestions] = useState<string | null>(null)
    const [introduction, setIntroduction] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<any>(null)


    const goBack = () => {
        dispatch(setEditBarType('main'))
        dispatch(setName('InsidePage'))
    }

    const workOnTitle = () => {
        console.log('get ai to generate some title ideas. ')
    }

    useEffect(() => {
        if (!sendGenerateTitleIdeas) return;
        if (sendGenerateTitleIdeas) {
            talkToChatGPTNotGettingImagePrompt()
        }
    }, [sendGenerateTitleIdeas])

    const talkToChatGPTNotGettingImagePrompt = async() => {
        console.log('this is the story', story)
        // setMessages([...messages, { role: "user", content: userMessage }]);
        const getTitleIdeasPrompt = `For the story ${story}, I want you to generate a list of 10 creative title ideas that will appeal to a child called ${heroName}. Generate your response in the form of a list like this: 
        1. title one, 
        2. title two, 
        3, title three etc`
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
                pageId: 'page_1', 
                userId: session!.user!.email
            }),
        })
          const responseData = await response.json();
            setTitleSuggestions(responseData.answer)
    //    setUserMessage('')
    //    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: responseData.answer }]);
     
    //    setAiResponded(true) 
       }catch(err){
           console.error(err);
    }
}

useEffect(() => {
    if (titleSuggestions) {
      const firstPart = titleSuggestions.split('\n')[0]; 
      setIntroduction(firstPart);

      const suggestionArray = titleSuggestions.match(/(\d\..*?)(?=\d\.|$)/gs);

      if (suggestionArray) {
        setSuggestions(suggestionArray.map(suggestion => suggestion.trim()));
      }
    }
  }, [titleSuggestions]);

    const getTitleSuggestions = () => {
        try{
            console.log('get book title ideas')
            setPromptType('getTitleIdeas')
            const getTitleIdeasPrompt = `For the story ${story}, I want you to generate a list of 10 creative title ideas that will appeal to a child ${heroName ? `called ${heroName}` : ''}. Generate your response in the form of a list like this:
            1. title one, 
            2. title two, 
            3, title three etc`
            setMessages(prevMessages => [...prevMessages, { role: "user", content: getTitleIdeasPrompt }]);
            setSendGenerateTitleIdeas(true)
    }catch(err){
        console.log(err)
    }
}


    const updateTitle = async(title: string) => {
        if (!storyId) return;
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", 'page_1');
        const updatedPage = await updateDoc(docRef, {
          text: title
        });
    }

  return (
    
    <div className="bg-white h-screen ml-2 mr-8 overflow-y-scroll">

        <div className='space-y-6 w-full pt-8 '>

            <div className='flex space-x-4 text-purple-500'>
                <BackOutline className="h-8 w-8 text-purple-600 hover:text-purple-400" onClick={goBack} />
                <p>Go back</p>
            </div>

                <div>
            {suggestions ? (
                <div className='space-y-2'>
                <p  className='text-xl font font-semibold text-purple-600'>{introduction}</p>
                {suggestions.map((suggestion: string) => (
                <p className='text-purple-400 hover:text-purple-600 hover:underline' 
                    onClick={() => updateTitle(suggestion)}
                >
                    {suggestion}
                </p>
                )) }

                </div>
            ):
           
                <button className='text-purple-500 hover:text-purple-300' onClick={getTitleSuggestions}>
                    Get title suggestions. 
                </button>
                }
                </div>

                <div>
                <button className='text-purple-500 hover:text-purple-300' onClick={workOnTitle}>
                    Work on the image
                </button>
                </div>

                <div>
                <button className='text-purple-500 hover:text-purple-300' onClick={workOnTitle}>
                    Add signature
                </button>
                </div>

                <div>
                <button className='text-purple-500 hover:text-purple-300' onClick={workOnTitle}>
                    Work on the title
                </button>
                </div>
           

        

            {editStage == '1' && (
                <GetBookCoverIdeas /> 
            )}

            {editStage == '2' && (
                <ChooseImageVersion /> 
            )}  

        </div>

    </div>
  )
}

export default EditCoverSideBar