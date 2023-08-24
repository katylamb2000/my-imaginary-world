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
import SelectImageToUpscaleBar from "./SelectImageToUpscaleBar";
import FlipPage from "./FlipPage";
import ImproveImagesModal from "./ImproveImagesModal";
import ImproveImagesBox from "./ImproveImagesBox";

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
    // const audioRef = useRef<HTMLAudioElement | null>(new Audio());
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const audioUrl = useSelector((state: RootState) => state.pageToEdit.audioUrl)
    const characters = useSelector((state: RootState) => state.characters.characters)
    const characterDescription = useSelector((state: RootState) => state.pageToEdit.characterDescription)
    const heroCharacterName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const imagePrompt = useSelector((state: RootState) => state.pageToEdit.imagePrompt)
    const [fullPageImageUrl, setFullPageImage] = useState(null)
    const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060')
    // const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1140985949216571463/katy2000_on_a_white_background_draw_two_friendly_aliens_in_the_5a7de73c-0857-4382-9cea-a6b4ade86a5b.png?width=1060&height=1060')
    // const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1140984757778403368/katy2000_on_a_white_background_draw_a_giant_pruple_monster_in__acf329b5-6136-43e1-a2fb-c0b539c32fc8.png?width=1060&height=1060') 
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    // const editTextSelected = useSelector((state: RootState) => state.pageToEdit.editText)
    const editTextSelected = useSelector((state: RootState) => state.editTextModal.editTextPageId)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const story = useSelector((state: RootState) => state.viewStory.fullStory)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id )
    const selectedText = useSelector((state: RootState) => state.fontEditor.textString)
    const newFontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
    const newFontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
    const newFontStyle = useSelector((state: RootState) => state.pageToEdit.font)
    const formattedText = useSelector((state: RootState) => state.pageToEdit.formattedText);

    const firstImagePromptIdea = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)

    const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
    const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)
    const backgroundIdea = useSelector((state: RootState) => state.pageToEdit.backgroundIdea)
    const showLayoutScrollbar = useSelector((state: RootState) => state.pageToEdit.showLayoutScrollbar)
    
    const [happyToSelectImage, setHappyToSelectImage] = useState<boolean | 'not clicked'>('not clicked')

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
    const [gettingImage, setGettingImage] = useState<boolean>(false)
    const [imageUrlType, setImageChoicesUrl] = useState<string>('choices')
    const highlightedTextRef = useRef<string>('');
    const [showText, setShowText] = useState(true);

    useEffect(() => {
      console.log('these are page stuffs ==> ', pageText, imageUrl)
    }, [imageUrl, pageText])


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
  
    const getImage = async() => {
      console.log('imagePrompt', imagePrompt, heroCharacterName, characterDescription)
      setLoading(true)
        // let enhancedPageText = pageText;
        // enhancedPageText = enhancedPageText.replace(new RegExp(heroCharacterName, 'g'), `${heroCharacterName} (${characterDescription})`);
        
        // characters.forEach(character => {
        //     enhancedPageText = enhancedPageText.replace(new RegExp(character.name, 'g'), `${character.name} (${character.description})`);
        // });
        // setLoading(true)
        var data = JSON.stringify({
          // msg: `In the style of Adam Stower illustrate an image for a children's book depicting ${enhancedPageText} `,
          msg: imagePrompt,
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

//   useEffect(() => {
//     setPlaying(true)
//   }, [audioUrl])
//  // Initialize the audio object when the component mounts
// // Initialize the audio object and add the event listener when the component mounts
// useEffect(() => {
//   if (!audioUrl || !audioRef.current) return;

//   audioRef.current.src = audioUrl;

//   const handleAudioEnded = () => {
//     console.log("Audio has finished playing!");
//     // Call your desired function here...
//   };

//   audioRef.current.addEventListener("onEnded", handleAudioEnded);

//   return () => {
//     if (audioRef.current) {
//       audioRef.current.removeEventListener("onEnded", handleAudioEnded);
//     }
//   };
// }, [audioUrl]);



// Cleanup the audio object when the component unmounts
// useEffect(() => {
//   return () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//     }
//   };
// }, []);

// useEffect(() => {
//   if (audioUrl) {
//     audioRef.current = new Audio(audioUrl);
//   }
// }, [audioUrl]);

const play = useCallback(() => {
  // console.log(audioRef, audioUrl)
      setPlaying(true);
}, [audioUrl])

const pause = () => {
  // if (!audioUrl || !audioRef.current) return;
      setPlaying(false);
      // audioRef.current.pause();
      // console.log(audioRef.current.ended)
};

// useEffect(() => {
//   if (!audioUrl || !audioRef.current?.ended) return;
//   if (audioRef.current.ended){
//     setPlaying(false)
//     console.log('FINISHED', storyPages, pageId )
    
//   }
// }, [audioRef.current?.ended])

const playPauseClicked = () => {
  setPlaying(!playing)
}

useEffect(() => {
  console.log(pageId, '--->>', newFontColor)
}, [newFontColor, pageId])

const getSmallImagePrompt = async() => {
  console.log(session, "STORYID",  currentStoryId )
  if (!session || currentStoryId == '') return;
  console.log(session, "STORYID",  currentStoryId )
  setLoading(true)

  const imageDescriptionsPrompt = 
    `
      Given the story: ${story}, generate an image prompt for this page of this illustrated children's storybook: ${pageText}

      This book will show a large image on this page depicting: ${imagePrompt}. 
      
      Your job is to create a second image prompt which will enhance the story telling. You should describe one character or object which is not featured in the first image and will add to the story telling and complement the existing image without being redundant. 

      Only describe the character or image, which should be in detail, but do not describe a background or wider scene. 
  
      Also, suggest an artistic style and color pallete that complements the story's mood and setting for the image.
    `;
  
try{
const response = await fetch('/api/createSmallImagePrompts', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        promptType: 'smallImage', 
        prompt: imageDescriptionsPrompt,
        session: session,
        storyId: currentStoryId , 
        pageId: pageId

    }),
})
  console.log('response from api', response)
  setLoading(false)

}catch(err){
  console.log(err)
  setLoading(false)
}
}

useEffect(() => {
  setHappyToSelectImage('not clicked')
}, [pageId])

return (
  <div className='bg-purple-50 h-full w-full items-center overscroll-none'>
      
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
                  <p className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-50`}>{pageText}</p>
                  {smallRoundImageUrl ?  (
                  <div className='h-1/2 w-1/2 bottom-0 relative mx-auto py-4 z-10 ' >
                    <Image src={smallRoundImageUrl} alt='/' fill className="mx-auto rounded-full" />
                    {/* <img src={smallRoundImageUrl} style={{mask: 'url(#mask)'}} /> */}
                  </div>
                ): 
                    <button   
                      className="bg-purple-500 text-white hover:bg-purple-300 p-4 rounded-lg"
                      onClick={getSmallImagePrompt}
                      >
                        Get small image
                    </button>
                }
              </div>
          }

              

                {audioUrl && (
                <div className="absolute bottom-20 w-full ">
                  {playing ? (
                    <PauseCircleIcon className="h-8 w-8 text-green-500 absolute left-10"  onClick={pause} />
                  ):
                    <PlayCircleIcon className="h-8 w-8 text-green-500 absolute left-10" onClick={play} />
                  }
                  </div>
                  )}

  
 <div className="h-4/5 w-3/5 relative" >
          <div className="border-2 border-gray-300 border-dashed h-full w-full bg-white drop-shadow-md relative">
          {imageUrl &&  (
            <Image src={imageUrl || 'https://media.discordapp.net/attachments/1083423262681350234/1140985949216571463/katy2000_on_a_white_background_draw_two_friendly_aliens_in_the_5a7de73c-0857-4382-9cea-a6b4ade86a5b.png?width=1060&height=1060'} fill alt='/'  />
      
        )}

        {firstImagePromptIdea && !imageUrl && (
        <button className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
        onClick={getImage}
        >
           {firstImagePromptIdea}
           {/* {imagePrompt} */}
        </button>
)}
              </div>
              </div>
        

   
</div>
{/*  
      {showLayoutScrollbar && (
          <LayoutScrollbar />
        )}

          {highlightedText && (
              <button 
                onClick={saveUpdatedText}
                className="text-purple-400 p-4 rounded-lg hover:shadow-xl hover:text-purple-600 border-2 border-purple-400 hover:border-purple-600">
                Update text
              </button>

            )} */}
               {/* {imageUrlType == 'choices' && (
        <SelectImageToUpscaleBar />
      )} */}
      {firstImagePromptIdea && imageUrl && happyToSelectImage == 'not clicked' &&  (
          <div className="w-1/3 bg-fuchsia-400 rounded-sm  drop-shadow-2xl p-6 absolute bottom-10 right-56 ">
            <p className="text-white text-lg">Are you happy to use one of these images? </p>
            <div className="flex gap-4 py-2 mx-10">
              <button className="bg-white text-fuchsia-700 hover:text-white hover:bg-fuchsia-700 rounded-lg hover:drop-shadow-2xl  p-4 " onClick={() => setHappyToSelectImage(true)}>YES!!!!!!</button>
              <button className="bg-white text-fuchsia-700 hover:text-white hover:bg-fuchsia-700 rounded-lg hover:drop-shadow-2xl p-4  " onClick={() => setHappyToSelectImage(false)}>NOOOOO!!</button>
            </div>
          </div>
      )}
      {/* <FlipPage /> */}

      {happyToSelectImage == true && (
           <SelectImageToUpscaleBar />
      )}

      {!happyToSelectImage && (
        <ImproveImagesBox />
      )}

      </div>
    )
  }
  
  export default InsidePage