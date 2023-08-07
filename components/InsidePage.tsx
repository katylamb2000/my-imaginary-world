'use client'

import Image from "next/image";
import axios from "axios";
import Draggable from "react-draggable";
import dynamic from "next/dynamic";
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { setImageUrl, setEditText, setText, setId , setAudioUrl} from "../app/GlobalRedux/Features/pageToEditSlice";
import { setStoryId } from "../app/GlobalRedux/Features/viewStorySlice";
import { doc, updateDoc, collection } from "firebase/firestore";
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { db } from "../firebase";
import { updateModalStatus } from "../app/GlobalRedux/Features/improveImagesModalSlice"
import { updateGetImagesModalStatus } from "../app/GlobalRedux/Features/getImagesModalSlice"
import { updateGetPageImageModalStatus, setPageId, setPrompt, setType } from "../app/GlobalRedux/Features/getPageImageModal"
import DragableFontEditor from "./DragableFontEditor";
import { updateTextString } from "../app/GlobalRedux/Features/dragableFontEditorSlice";
import { Delta, Sources } from 'quill';
import TipTap from './TextEditorToolBar'
import TextEditor from "./TextEditor";
import TextEditorHeader from "./TextEditorHeader"
import QuillToolbar from "./QuillToolbar";
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import Star from '../masks/Star';
import CustomTextEditor from "./CustomTextEditor";
import LayoutScrollbar from "./LayoutScrollbar";
import ReactPlayer from 'react-player'

type Props = {
  storyPages: any
  imageIdeas: any
}

function InsidePage({ storyPages, imageIdeas }: Props) {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const { data: session } = useSession()
    const [playing, setPlaying] = useState<boolean>(false)
    // const audioRef = useRef(new Audio());
    const audioRef = useRef<HTMLAudioElement | null>(new Audio());
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const audioUrl = useSelector((state: RootState) => state.pageToEdit.audioUrl)
    const characters = useSelector((state: RootState) => state.characters.characters)
    const characterDescription = useSelector((state: RootState) => state.pageToEdit.characterDescription)
    const heroCharacterName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const [fullPageImageUrl, setFullPageImage] = useState(null) 
    const [smallRoundImageUrl, setSmallRoundImageUrl] = useState(null) 
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    // const editTextSelected = useSelector((state: RootState) => state.pageToEdit.editText)
    const editTextSelected = useSelector((state: RootState) => state.editTextModal.editTextPageId)

    const pageId = useSelector((state: RootState) => state.pageToEdit.id )
    const selectedText = useSelector((state: RootState) => state.fontEditor.textString)
    const newFontColor = useSelector((state: RootState) => state.fontEditor.textColor)
    const newFontSize = useSelector((state: RootState) => state.fontEditor.textSize)
    const newFontStyle = useSelector((state: RootState) => state.fontEditor.fontStyle)
    const formattedText = useSelector((state: RootState) => state.pageToEdit.formattedText);

    const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
    const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)
    const backgroundIdea = useSelector((state: RootState) => state.pageToEdit.backgroundIdea)
    const showLayoutScrollbar = useSelector((state: RootState) => state.pageToEdit.showLayoutScrollbar)

    const [value, setValue] = useState(pageText)
    // const [value, setValue] = useState(`<p><strong class="ql-size-large" style="color: rgb(0, 153, 255);">Sophia</strong>, suddenly feeling more <em style="color: rgb(0, 153, 0);">brave</em> and <em style="color: rgb(0, 153, 0);">bold</em>, was just getting the knack of controlling the <u class="ql-size-large ql-font-monospace" style="color: rgb(102, 51, 153);">massive spaceship</u> when, without any warning, the floor beneath her began to <strong class="ql-size-huge" style="color: rgb(255, 51, 51);">shake</strong> and <em class="ql-size-huge" style="color: rgb(255, 51, 51);">shudder</em>.</p>
    // <p>In a <strong class="ql-size-large" style="color: rgb(0, 102, 255);">flash</strong>, as if from thin air, <u class="ql-size-huge ql-font-monospace" style="color: rgb(204, 0, 204);">creatures</u> from another galaxy - <strong class="ql-size-huge" style="color: rgb(204, 0, 204);">aliens!</strong> - materialized out of nowhere!</p>`);
    
    const [textSize, setTextSize] = useState<number>(24)
    const [loading, setLoading] = useState<boolean>(false)
    const [addText, setAddText] = useState<boolean>(false)
    const [updatedPageText, setUpdatedPageText] = useState<string>(pageText)
    const [currentStoryId, setCurrentStoryId] = useState<string | null>()
    const [upscaleImage, setUpscaleImage] = useState<string | null>(null)
    const [highlightedText, setHighlightedText] = useState<string | null>(null)
    const open = useSelector((state: RootState) =>  state.improveImagesModal.status);

    const highlightedTextRef = useRef<string>('');
    const [showText, setShowText] = useState(true);

    useEffect(() => {
      // When pageText or audioUrl changes, set showText to false to trigger the transition effect
      setShowText(false);
  
      // After a short delay, set showText back to true to show the new text with the transition
      const delay = 300; // Adjust the delay time as needed
      const timeout = setTimeout(() => {
        setShowText(true);
      }, delay);
  
      // Clear the timeout when the component unmounts or when the dependency values change again
      return () => clearTimeout(timeout);
    }, [pageText, audioUrl]);

useEffect(() => {
  setPlaying(false)
}, [pageText])

    useEffect(() => {
        if (!pathname) return;
        const regex = /^\/story\/([a-zA-Z0-9]+)$/;
        const id = regex.exec(pathname);
      
        if (id) {
          const identifier = id[1];
          setCurrentStoryId(identifier);  
        } else {
          console.log("No match");
        }
      }, [pathname])

    const requestImage = async() => {
             console.log('trying to send sms')

      const phoneNumber = '+447309693489'
      const message = `you have a new request for images! 
      USER: ${session?.user?.email}
      STORYID: ${currentStoryId}
      PAGEID: ${pageId}`
      try {
        const response = await fetch("/api/sendSms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ toPhoneNumber: phoneNumber, message }),
        }); 
  
        if (response.ok) {
          console.log("SMS sent successfully!");
        } else {
          console.error("Error sending SMS");
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    }
  
    const sendImagineCommand = async() => {
        let enhancedPageText = pageText;
        enhancedPageText = enhancedPageText.replace(new RegExp(heroCharacterName, 'g'), `${heroCharacterName} (${characterDescription})`);
        
        characters.forEach(character => {
            enhancedPageText = enhancedPageText.replace(new RegExp(character.name, 'g'), `${character.name} (${character.description})`);
        });
        setLoading(true)
        var data = JSON.stringify({
          msg: `In the style of Adam Stower illustrate an image for a children's book depicting ${enhancedPageText} `,
          ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'imagine', page: pageId },
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
          console.log(error);
          setLoading(false)
        });
      }

    const resetText = () => {
        setUpdatedPageText(pageText)
        dispatch(setEditText(''))
    }

  const updateText = async () => {
    // console.log(selectedPageText, selectedPageId);
    if (!currentStoryId || !pageId || !session) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", currentStoryId, "storyContent", pageId);
    const updatedPage = await updateDoc(docRef, {
      text: updatedPageText
    });
    console.log(' this is the updated', updatedPage);
    dispatch(setEditText(''))
  };

useEffect(() => {
    if (fullPageImageUrl) return;
    console.log(characters)
    if (!fullPageImageUrl && !characters.length){
        console.log('get the characters for this story. ', characters, characters.length)
        // fetchStoryCharacters()
    }
}, [fullPageImageUrl, characters])

  const upscaleChosenImage = async(btn: string) => {
    console.log(btn)
    console.log(buttonId)

var data = JSON.stringify({
  button: btn,
  buttonMessageId: buttonId ,
  ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'upscale', page: pageId, mainCharacter: characterDescription },
  webhookOverride: ""
});

var config = {
  method: 'post',
  url: 'https://api.thenextleg.io/v2/button',
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
dispatch(setImageUrl(null))
})
.catch(function (error) {
  console.log(error);
  setLoading(false)
  dispatch(setImageUrl(null))
});
  }
 
  const openModal = (type: string, promptIdea: string) => {
    dispatch(setStoryId(currentStoryId))
    dispatch(setType(type))
    dispatch(setPrompt(promptIdea))
    dispatch(setPageId(pageId))
    dispatch(updateGetPageImageModalStatus(true))
  }
  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const highlightedText = selection.toString();
      dispatch(updateTextString(highlightedText))
      setHighlightedText(highlightedText);
      console.log(highlightedText);

    }
  };

  const closeFontEditor = () => {
    setHighlightedText(null);
  }

  const saveUpdatedText = async () => {
    if (!currentStoryId || !pageId || !session ) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", currentStoryId, "storyContent", pageId);
  
    const highlightedText = highlightedTextRef.current;
    const startIndex = updatedPageText.indexOf(highlightedText);
    const endIndex = startIndex + highlightedText.length;
    
    const formattedText = `${updatedPageText.slice(0, startIndex)}<span style="color: ${newFontColor}; font-size: ${newFontSize}px; font-style: ${newFontStyle};">${highlightedText}</span>${updatedPageText.slice(endIndex)}`;
  
    const updatedPage = await updateDoc(docRef, {
      formatedText: formattedText,
    });
    console.log('Updated page:', updatedPage);
  
    dispatch(setEditText(''));
  };

  const handleAudioEnded = () => {
    console.log("Audio has finished playing!",  storyPages, pageId);
    const currentPageNumber = parseInt(pageId.split("_")[1], 10);
    // Increment the currentPageNumber by 1
    const nextPageNumber = currentPageNumber + 1;
    // Construct the next page name
    const nextPageId = `page_${nextPageNumber}`;
    console.log("go to ====>>", nextPageId)
    const nextPage = storyPages.find((page: any) => page.id === nextPageId);
    dispatch(setId(nextPage.id))
    dispatch(setText(nextPage.data.text))
    dispatch(setAudioUrl(nextPage.data.audioUrl))
 
    // Call your desired function here...
  };

  useEffect(() => {
    setPlaying(true)
  }, [audioUrl])
 // Initialize the audio object when the component mounts
// Initialize the audio object and add the event listener when the component mounts
useEffect(() => {
  if (!audioUrl || !audioRef.current) return;

  audioRef.current.src = audioUrl;

  const handleAudioEnded = () => {
    console.log("Audio has finished playing!");
    // Call your desired function here...
  };

  audioRef.current.addEventListener("onEnded", handleAudioEnded);

  return () => {
    if (audioRef.current) {
      audioRef.current.removeEventListener("onEnded", handleAudioEnded);
    }
  };
}, [audioUrl]);



// Cleanup the audio object when the component unmounts
useEffect(() => {
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
}, []);

useEffect(() => {
  if (audioUrl) {
    audioRef.current = new Audio(audioUrl);
  }
}, [audioUrl]);

const play = useCallback(() => {
  console.log(audioRef, audioUrl)
      setPlaying(true);
}, [audioUrl, audioRef.current]);

const pause = () => {
  // if (!audioUrl || !audioRef.current) return;
      setPlaying(false);
      // audioRef.current.pause();
      // console.log(audioRef.current.ended)
};

useEffect(() => {
  if (!audioUrl || !audioRef.current?.ended) return;
  if (audioRef.current.ended){
    setPlaying(false)
    console.log('FINISHED', storyPages, pageId )
    
  }
}, [audioRef.current?.ended])

const playPauseClicked = () => {
  setPlaying(!playing)
}

return (
  <div className='bg-gray-50 h-full w-full items-center overscroll-none'>
      <div className="flex space-x-6 justify-center pt-4 h-4/5 bg-gray-50 ">
        {audioUrl && playing && (
            <div className="react-player-wrapper" style={{ display: "none" }}>
                <ReactPlayer url={audioUrl} playing={playing} onEnded={handleAudioEnded} />
           </div>
        )}

         
          {editTextSelected === pageId  ? (
              <div className="border-2 border-gray-300 border-dashed h-4/5 w-3/5 bg-white drop-shadow-md">
                <CustomTextEditor  />
              </div>
          ):
              // <div className="border-2 border-gray-300 border-dashed  h-4/5 w-3/5 bg-white drop-shadow-md">
              <div
              className={`border-2 border-gray-300 border-dashed h-4/5 w-3/5 bg-white drop-shadow-md ${
                showText ? 'opacity-100' : 'opacity-0 scale-0 translate-y-[-50%] transition-all duration-300'
              }`}
            >
                  <p className="text-lg text-purple-700/60 m-4 p-4 font-mystery leading-loose">{pageText}</p>
              </div>
          }

                {smallRoundImageUrl && (
                  <div className='h-1/2 w-1/2 bottom-0 relative mx-auto py-4 ' >
                    <Image src={smallRoundImageUrl} alt='/' fill className="mx-auto rounded-full" />
                    {/* <img src={smallRoundImageUrl} style={{mask: 'url(#mask)'}} /> */}
                  </div>
                )}

                {audioUrl && (
                <div className="absolute bottom-20 w-full ">
                  {playing ? (
                    <PauseCircleIcon className="h-8 w-8 text-green-500 absolute left-10"  onClick={pause} />
                  ):
                    <PlayCircleIcon className="h-8 w-8 text-green-500 absolute left-10" onClick={play} />
                  }
                  </div>
                  )}

  

                {!wildcardIdea && (
                <div className="border-2 border-gray-300 border-dashed  h-4/5 w-3/5 bg-white drop-shadow-md">
                    {fullPageImageUrl ? (
                        <Image className='w-full h-full z-10' alt="/" src={fullPageImageUrl} width={200} height={200} />
                    ):
                        loading ? (
                            <div className="w-full h-full justify-center items-center text-center">
                                <p>loading</p>
                        </div>
                        ):
                        <div className="w-full h-full justify-center items-center text-center">
                            <button 
                                onClick={sendImagineCommand}
                                className="my-40 p-4 border border-purple-500 rounded-lg text-purple-500 hover:shadow-2xl hover:border-purple-700 hover:border-2 hover:text-purple-700 font-roboto ">
                                    Get Image
                            </button>
                            <button 
                                // onClick={openModal}
                                className="my-40 p-4 border border-purple-500 rounded-lg text-purple-500 hover:shadow-2xl hover:border-purple-700 hover:border-2 hover:text-purple-700 font-mystery ">
                                    open modal
                            </button>
                        </div> 
                    }
                </div>
                )}

  {wildcardIdea && !imageUrl  && (
    <div className="border-2 border-gray-300 border-dashed h-4/5 w-3/5 bg-white drop-shadow-md">
                {wildcardIdea && (
                  <button   className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600 hover:cursor-help" 
                            onClick={() => openModal('wildcardImageChoices', wildcardIdea)}
                        >
                    Wildcard image idea: {wildcardIdea}
                  </button>
                )}

              {backgroundIdea && (
                  <button className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
                          onClick={() => openModal('backgroundImageChoices', backgroundIdea)}
                  >
                    Background image idea: {backgroundIdea}
                  </button>
                )}

              {objectIdea && (
                 <button className="p-4 text-purple-400 hover:underline hover:text-purple-600"
                 onClick={() => openModal('objectImageChoices', objectIdea)}
                 >
                    Object image idea: {objectIdea}
                  </button>
                )}

              {characterIdea && (
                  <button className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
                  onClick={() => openModal('characterImageChoices', characterIdea)}
                  >
                    character image idea: {characterIdea}
                  </button>
                )}

        </div>
  )}
      {imageUrl && (
        <div className="h-3/5 w-3/5" >
          <div className="border-2 border-gray-300 border-dashed h-full w-full bg-white drop-shadow-md relative">
            <Image src={imageUrl} fill alt='/'  />
            </div>
            <div className='border shadow-2xl border-gray-100 rounded-lg mb-2 w-full h-20 '> 
            <p className="mx-auto p-6" w-full>Select Your image</p>
    
       
            <div className="mx-auto my-auto bg-white grid grid-cols-2">
                <button onClick={() => upscaleChosenImage('U1')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">1</button>
                <button onClick={() => upscaleChosenImage('U2')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">2</button>
                <button onClick={() => upscaleChosenImage('U3')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">3</button>
                <button onClick={() => upscaleChosenImage('U4')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">4</button>
            </div>
            </div>
          </div>
        )}
</div>
 
      {showLayoutScrollbar && (
          <LayoutScrollbar />
        )}

          {highlightedText && (
              <button 
                onClick={saveUpdatedText}
                className="text-purple-400 p-4 rounded-lg hover:shadow-xl hover:text-purple-600 border-2 border-purple-400 hover:border-purple-600">
                Update text
              </button>

            )}
      </div>
    )
  }
  
  export default InsidePage