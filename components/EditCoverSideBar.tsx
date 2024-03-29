import { useState, useEffect } from 'react'
import { ArrowLeftIcon as BackOutline } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid, CheckCircleIcon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import { setEditBarType, setShowInputBox } from "../app/GlobalRedux/Features/pageToEditSlice"
import GetBookCoverIdeas from './GetBookCoverIdeas'
import ChooseImageVersion from './ChooseImageVersion'
import { RootState } from '../app/GlobalRedux/store'
import { useSession } from 'next-auth/react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { usePathname } from 'next/navigation'
import { setStoryId, setTitle } from '../app/GlobalRedux/Features/viewStorySlice'
import RootLayout from '../app/layout'
import axios from 'axios'
import EditTextSideBar from './EditTextSideBar'
import EditSignatureBox from './EditSignatureBox'
import EditTitleBox from './EditTitleBox'
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect'

function EditCoverSideBar() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const { data: session } = useSession()
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const heroName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)
    // const characters = useSelector((state: RootState) => state.characters.characters)
    const characters = useSelector((state: RootState) => state.viewStory.storyCharacters)
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const storyTitle = useSelector((state: RootState) => state.viewStory.title)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const titleIdeas = useSelector((state: RootState) => state.viewStory.titleIdeas)
    const selectedTitle = useSelector((state: RootState) => state.viewStory.selectedTitle)

    const [editStage, setEditStage] = useState('1')
    const [promptType, setPromptType] = useState<string | null>()
    const [messages, setMessages] = useState<{ role: string; content: any; }[]>([]);
    const [userMessage, setUserMessage] = useState<string>("")
    const [aiResponded, setAiResponded] = useState(false)
    const [sendGenerateTitleIdeas, setSendGenerateTitleIdeas] = useState(false)
    const [titleSuggestions, setTitleSuggestions] = useState<string | null>(null)
    const [introduction, setIntroduction] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<any>(null)
    const [imageSuggestions, setImageSuggestions] = useState<any>(null)
    const [coverImageSuggestions, setCoverImageSuggestions] = useState<any>(null)
    const [selected, setSelected] = useState('')
    const [showAddSignature, setShowAddSignature] = useState(true)
    const [showGetImageIdeas, setShowGetImageIdeas] = useState(true)
    const [showWorkOnTitle, setShowWorkOnTitle] = useState(true)
    const [showEditFont, setShowEditFont] = useState(true)
    const [showGetTitleSuggestions, setShowGetTitleSuggestions] = useState(true)
    const [extractedCharacters, setExtractedCharacters] = useState<string | null>(null)
    const [titleSugggestionsDone, setTitleSuggestionsDone] = useState<boolean>(true)
    const [loadingGettingCoverImage, setLoadingGettingCoverImage] = useState(false)
    const [imageSuggestionChosen, setImageSuggestionChosen] = useState<null | string>(null)

    useEnhancedEffect(() => {
    }, [selected, showWorkOnTitle, showAddSignature, showEditFont, showGetImageIdeas, showGetTitleSuggestions])
    
    useEffect(() => {
        if (!pathname) return;
        if (storyId) return;
        const regex = /^\/story\/([a-zA-Z0-9]+)$/;
        const id = regex.exec(pathname);
      
        if (id) {
          const identifier = id[1];
          dispatch(setStoryId(identifier));  
        } else {
          console.log("No match");
        }
      }, [pathname])

      useEffect(() => {
        if (!storyTitle && !pageText) return;
        if (storyTitle){ 
          setTitle(storyTitle)
        }
        else if (!storyTitle && pageText){
          setTitle(pageText)
        }
      }, [pageText, storyTitle])

    const goBack = () => {
        if (!showAddSignature || !showEditFont || !showGetImageIdeas || !showGetTitleSuggestions || !showWorkOnTitle){
            setShowAddSignature(true)
            setShowEditFont(true)
            setShowGetImageIdeas(true)
            setShowGetTitleSuggestions(true)
            setShowWorkOnTitle(true)
        }else {
            dispatch(setEditBarType('main'))
            dispatch(setName('InsidePage'))
        }
    }

    const workOnTitle = () => {
        setSelected('workOnTitle')
        dispatch(setShowInputBox(false))
        setShowAddSignature(false)
        setShowGetImageIdeas(false)
        setShowEditFont(false)
        setShowGetTitleSuggestions(false)
    }

    useEffect(() => {
        if (!sendGenerateTitleIdeas) return;
        if (sendGenerateTitleIdeas) {
            talkToChatGPTNotGettingImagePrompt()
        }
    }, [sendGenerateTitleIdeas])

    const talkToChatGPTNotGettingImagePrompt = async() => {
        if (!session){
            console.log('got no session')
        }
        // setMessages([...messages, { role: "user", content: userMessage }]);
        const getTitleIdeasPrompt = `For the story ${story}, I want you to generate a list of 10 creative title ideas that will appeal to a child called ${heroName}. Generate your response in the form of a list like this: 
        1. title one, 
        2. title two, 
        3, title three etc`
        try{
        const response = await fetch('/api/createCoverImagePrompt', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: getTitleIdeasPrompt,
                promptType: 'titleIdeas',
                storyId: storyId, 
                session: session
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

const generateCoverImageIdeas = async() => {

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

    useEffect(() => {
        if (coverImageSuggestions) {
        // const firstPart = titleSuggestions.split('\n')[0]; 
        // setIntroduction(firstPart);
      
        const splitDescriptions = coverImageSuggestions.coverImagePrompt.split(/\d+\.\s/).slice(1);
            setImageSuggestions(splitDescriptions);

        }
    }, [coverImageSuggestions]);

    const getTitleSuggestions = () => {
        setSelected('getTitleSuggestions')
        setShowAddSignature(false)
        setShowWorkOnTitle(false)
        try{
            setPromptType('getTitleIdeas')
            const getTitleIdeasPrompt = `For the story ${story}, I want you to generate a list of 10 creative title ideas that will appeal to a child ${heroName ? `called ${heroName}` : ''}. Generate your response in the form of a list like this:
            1. title one, 
            2. title two, 
            3, title three etc`
            setMessages(prevMessages => [...prevMessages, { role: "user", content: getTitleIdeasPrompt }]);
            setSendGenerateTitleIdeas(true)
    }catch(err){
        console.log(err)
    }}

    const updateTitle = async(title: string) => {
        const matchResult = title.match(/"\s*(.+?)\s*"/);
        const cleanedTitle = matchResult ? matchResult[1] : title; // Check if we have a match, otherwise use the original title
            if (!storyId) return;
        try{
            const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", 'page_1');
            const updatedPage = await updateDoc(docRef, {
            text: cleanedTitle,
            updateedTitleFromAiSuggestion: true
            });
            setSuggestions(null)
        }catch(err){
            console.log(err)
            setSuggestions(null)
            }
    }

    const editSignature = () => {
        setSelected('addSignature')
        setShowAddSignature(true)
        setShowWorkOnTitle(false)
        setShowGetTitleSuggestions(false)
        setShowEditFont(false)
        setShowGetImageIdeas(false)
    }

    const getImageIdeas = async() => {
        setSelected('getImageIdeas')
        setShowAddSignature(false)
        setShowWorkOnTitle(false)
        setShowGetTitleSuggestions(false)
        setShowEditFont(false)
        try{
            setPromptType('getCoverImageIdeas')
            const getCoverImageIdeasPrompt = `For the story ${story}, I want you to generate a list of 10 creative ideas for the book cover image that will appeal to a child. Generate your response in the form of a list like this:
            1. idea one, 
            2. idea two, 
            3, idea three etc`
                const response = await fetch('/api/createCoverImagePrompt', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: getCoverImageIdeasPrompt,
                        promptType: 'coverImageIdeas',
                        storyId: storyId, 
                        pageId: 'page_1', 
                        session : session
                    }),
                })
                  const responseData = await response.json();
                    setCoverImageSuggestions(responseData)
               }catch(err){
                   console.error(err);
            }
        }

        useEffect(() => {
            if (!story || !characters.length) return;
     
            let descriptions = characters
            .map(character => `${character.name}: ${character.description}`);
            // return descriptions.join(' ');
            const charctersDescriptions = descriptions.join(' ');

            setExtractedCharacters(charctersDescriptions)
          }, [story, characters])

        const generatePromptToSendToMidjourney = async(idea: string) => {
            if (!session || storyId == '') return;  
            setLoadingGettingCoverImage(true)
            setImageSuggestionChosen(idea)
            // dispatch(setLoadingGettingCoverImage(true))
            // const extractedCharacters = extractCharactersFromStory();
            const prompt = 
            `
            Given the story: ${story}, generate an image prompt which an ai image generator will use to create the cover image of the book. 
            
            The image should feature ${idea}. 
      
    
            You must describe the camera angles and color palette to be used for the image. Also explicitly describe the artistic style that complements the story's mood and setting, taking inspirations from ${style}
      
            The characters must remain consistent in appearance throughout the book, so make sure to use these character descriptions as your reference when describing any characters who will feature in the image. 
      
            Characters: ${extractedCharacters}
      
            `;
            
      try{
          const response = await fetch('/api/createCoverImagePrompt', {
              method: 'POST', 
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  // promptType: 'backgroundImages', 
                  promptType: 'coverImage', 
                  prompt: prompt,
                  session: session,
                  storyId: storyId, 
                //   pageId: 'page_1'
      
              }),
          })
          const responseData = await response.json();
         
          getImage(responseData)
 
        }catch(err){
            console.log(err)
        }
    }

    const getImage = async(coverPrompt: any) => {
          var data = JSON.stringify({
            msg: coverPrompt.coverImagePrompt,
            ref: { storyId: storyId, userId: session!.user!.email, action: 'imagineCoverImage', page: 'page_1' },
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
          //   setLoading(false)
          setLoadingGettingCoverImage(false)
          })
          .catch(function (error) {
            console.log(error);
            setLoadingGettingCoverImage(false)


          });
        }

        const editCoverFont = () => {
            setSelected('showEditFont')
            setShowEditFont(true)
            setShowAddSignature(false)
            setShowGetImageIdeas(false)
            setShowGetTitleSuggestions(false)
            setShowWorkOnTitle(false)
        }

        const useThisTitle = async() => {
            try {
                const docRef = doc(db, "users", session?.user?.email!, "storys", storyId);
                const updatedTitle = await updateDoc(docRef, {
                  title: selectedTitle
                });
              } catch (err) {
                console.log(err);
              }
        }
            
  return (
    
    <div className="bg-white h-screen ml-2 mr-8 overflow-y-scroll">

        <div className='w-full pt-8 '>

            <div className='flex space-x-4 text-purple-500 py-4'>
                <BackOutline className="h-8 w-8 text-purple-600 hover:text-purple-400" onClick={goBack} />
                <p>Go back</p>
            </div>
            <h2 className='text-purple-500 font-bold text-xl p-2'>Design your book cover</h2>
                <div>
            {suggestions && (
                <div className='space-y-2'>
                {/* <p  className='text-xl font font-semibold text-purple-600'>{introduction}</p> */}
                {suggestions.map((suggestion: string, index: number) => (
                <p key={index} className='text-purple-400 hover:underline cursor-pointer hover:text-purple-600 hover:text-lg' 
                    onClick={() => updateTitle(suggestion)}
                >
                    {suggestion}
                </p>
                )) }

                </div>
            )}

            {imageSuggestions && !loadingGettingCoverImage && (
                <div className='space-y-2'>
                    {/* <p  className='text-xl font font-semibold text-purple-600'>{introduction}</p> */}
                    {imageSuggestions.map((suggestion: string) => (
                    <p  className='text-purple-400 hover:underline cursor-pointer hover:text-purple-600 hover:text-lg' 
                        onClick={() => generatePromptToSendToMidjourney(suggestion)}
                    >
                        {suggestion}
                    </p>
                )) }
                </div>
            )}

        {imageSuggestionChosen && loadingGettingCoverImage && (
                <div className='space-y-2'>
                       <p  className='text-purple-400 hover:underline cursor-pointer hover:text-purple-600 hover:text-lg' 
                    >
                       This image is being created
                        
                    </p>
                    <p  className='text-purple-400 hover:underline cursor-pointer hover:text-purple-600 hover:text-lg' 
                    >
                        {imageSuggestionChosen}

                    </p>

                </div>
            )}

            {/* {showGetTitleSuggestions && (
                <div  className={`${selected == 'getTitleSuggestions' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `} >
                    {titleSugggestionsDone ? (
                        <div className={`flex text-white group-hover:font-semibold p-4 w-full justify-between  ${selected == 'getTitleSuggestions' ? 'text-white' : 'text-purple-500'} `}>
                        <button className={` text-purple-500 font-semibold  ${selected == 'getTitleSuggestions' ? 'text-white' : 'text-purple-500'} `} >
                            Title Done. 
                        </button>
                        <CheckCircleIcon className='h-16 w-16 z-50 text-green-500 pl-8' />
                        </div>
                    ):
                        <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'getTitleSuggestions' ? 'text-white' : 'text-purple-500'} `} onClick={getTitleSuggestions}>
                            Get title suggestions. 
                        </button>
                     
                    }
                    </div>
                    )} */}
                </div>

                {/* <div className={`flex text-white group-hover:font-semibold p-4 w-full justify-between  ${selected == 'getTitleSuggestions' ? 'text-white' : 'text-purple-500'} `}>
                        <button className={` text-purple-500 font-semibold  ${selected == 'getTitleSuggestions' ? 'text-white' : 'text-purple-500'} `} >
                            Edit Title 
                        </button>
                        <CheckCircleIcon className='h-16 w-16 z-50 text-green-500 pl-8' />
                </div> */}

            {showGetImageIdeas && (
                <div  className={`${selected == 'getImageIdeas' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `} onClick={getImageIdeas}>
                    <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'getImageIdeas' ? 'text-white' : 'text-purple-500'} `} >
                        Get image ideas
                    </button>
                </div>
            )}
            
            {showAddSignature && (
                <div  className={`${selected == 'addSignature' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `} onClick={editSignature}>
                    <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'addSignature' ? 'text-white' : 'text-purple-500'} `} >
                        Edit signature
                    </button>
                </div>
            )}
            
            {!storyTitle && !titleIdeas ? (
                <div  className={`${selected == 'addSignature' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `} onClick={editSignature}>
                    {/* <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'addSignature' ? 'text-white' : 'text-purple-500'} `} > */}
                    <button className={` group-hover:text-white group-hover:font-semibold p-4 text-purple-500  `} onClick={getTitleSuggestions} >
                        Get Title Ideas
                    </button>
                </div>
            ): 
            <div  className={`${selected == 'addSignature' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `}>
            {/* <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'addSignature' ? 'text-white' : 'text-purple-500'} `} > */}
                <button className={` group-hover:text-white group-hover:font-semibold p-4 text-white  `} onClick={useThisTitle} >
                   Use this title
                </button>
            </div>
            }
             
            {showWorkOnTitle && (
                <div  className={`${selected == 'workOnTitle' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `} onClick={workOnTitle}>
                    <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'workOnTitle' ? 'text-white' : 'text-purple-500'} `} >
                        Edit the title like a human
                    </button>
                </div>
            )}

            {showEditFont && (
                <div  className={`${selected == 'showEditFont' ? 'bg-purple-600': 'bg-white'} h-18 w-full  border-b-2 border-purple-300 hover:bg-purple-300 group group-hover:drop-shadow-xl transition duration-200  `} onClick={editCoverFont}>
                    <button className={` group-hover:text-white group-hover:font-semibold p-4  ${selected == 'showEditFont' ? 'text-white' : 'text-purple-500'} `} >
                        Edit the cover font
                    </button>
                </div>
            )}

            {!showAddSignature && !showEditFont && !showGetImageIdeas && !showGetTitleSuggestions && showWorkOnTitle && (
                <EditTitleBox />
            )}

            {showEditFont && !showAddSignature && !showGetImageIdeas && !showGetTitleSuggestions && !showWorkOnTitle && (
                <EditTextSideBar />
            )}

            {showAddSignature && !showEditFont && !showGetImageIdeas && !showGetTitleSuggestions && !showWorkOnTitle && (
                <EditSignatureBox />
            )}
          

        </div>

    </div>
  )
}

export default EditCoverSideBar