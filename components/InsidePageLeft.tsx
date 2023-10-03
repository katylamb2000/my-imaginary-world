// 'use client'

// import Image from "next/image";
// import axios from "axios";
// import Draggable from "react-draggable";
// import dynamic from "next/dynamic";
// import type { RootState } from '../app/GlobalRedux/store';
// import { useSelector, useDispatch } from 'react-redux';
// import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useEffect, useState, useRef, useCallback, CSSProperties } from "react";
// import { setImageUrl, setEditText, setText, setId , setAudioUrl, setEditBarType} from "../app/GlobalRedux/Features/pageToEditSlice";
// import { setEditTextPageId } from "../app/GlobalRedux/Features/editTextModalSlice";
// import { setStoryId } from "../app/GlobalRedux/Features/viewStorySlice";
// import { doc, updateDoc, collection } from "firebase/firestore";
// import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
// import { db } from "../firebase";
// import { updateModalStatus } from "../app/GlobalRedux/Features/improveImagesModalSlice"
// import { updateGetImagesModalStatus } from "../app/GlobalRedux/Features/getImagesModalSlice"
// import { updateGetPageImageModalStatus, setPageId, setPrompt, setType } from "../app/GlobalRedux/Features/getPageImageModal"
// import DragableFontEditor from "./DragableFontEditor";
// import { updateTextString } from "../app/GlobalRedux/Features/dragableFontEditorSlice";
// import { Delta, Sources } from 'quill';
// import TipTap from './TextEditorToolBar'
// import TextEditor from "./TextEditor";
// import TextEditorHeader from "./TextEditorHeader"
// import QuillToolbar from "./QuillToolbar";
// import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
// import Star from '../masks/Star';
// import CustomTextEditor from "./CustomTextEditor";
// import LayoutScrollbar from "./LayoutScrollbar";
// import ReactPlayer from 'react-player'
// import SelectImageToUpscaleBar from "./SelectImageToUpscaleBar";
// import FlipPage from "./FlipPage";
// import ImproveImagesModal from "./ImproveImagesModal";
// import ImproveImagesBox from "./ImproveImagesBox";
// import NextImageModal from "./NextImageModal";
// import { SyncLoader } from 'react-spinners'
// import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
// import NextSmallImageModal from "./NextSmallImageModal";
// import GetImageButton from "./GetImageButton";
// import GetSmallImagesButton from "./GetSmallImagesButton";
// import ImageGridButtons from "./ImageGridButtons";
// import { DeliveryReceiptListInstance } from "twilio/lib/rest/conversations/v1/conversation/message/deliveryReceipt";
// import { ArrowSmallRightIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
// import { page } from "pdfkit";
// import BottomBar from "./BottomBar";
// import SmallImageIdeas from "./SmallImageIdeas";




// type Props = {
//   storyPages: any
//   imageIdeas: any
// }

// function InsidePageLeft() {
//     const dispatch = useDispatch()
//     const pathname = usePathname()
//     const { data: session } = useSession()
//     const [playing, setPlaying] = useState<boolean>(false)
//     // const audioRef = useRef(new Audio());
//     // const audioRef = useRef<HTMLAudioElement | null>(new Audio());
//     const style = useSelector((state: RootState) => state.pageToEdit.style)
//     const pageText = useSelector((state: RootState) => state.pageToEdit.text)
//     const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
//     const audioUrl = useSelector((state: RootState) => state.pageToEdit.audioUrl)
//     const characters = useSelector((state: RootState) => state.characters.characters)
//     const characterDescription = useSelector((state: RootState) => state.pageToEdit.characterDescription)
//     const heroCharacterName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)
//     const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
//     const improvedImageUrl = useSelector((state: RootState) => state.pageToEdit.improvedImageUrl)
//     const imagePrompt = useSelector((state: RootState) => state.pageToEdit.imagePrompt)
//     const smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl)
//     const finalImageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl)
//     const [fullPageImageUrl, setFullPageImage] = useState(null)
//     const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060')
//     // const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1140985949216571463/katy2000_on_a_white_background_draw_two_friendly_aliens_in_the_5a7de73c-0857-4382-9cea-a6b4ade86a5b.png?width=1060&height=1060')
//     // const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1140984757778403368/katy2000_on_a_white_background_draw_a_giant_pruple_monster_in__acf329b5-6136-43e1-a2fb-c0b539c32fc8.png?width=1060&height=1060') 
//     const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
//     const smallImageButtonId = useSelector((state: RootState) => state.pageToEdit.smallImageButtonId)
//     // const editTextSelected = useSelector((state: RootState) => state.pageToEdit.editText)
//     const editTextSelected = useSelector((state: RootState) => state.editTextModal.editTextPageId)
//     const storyId = useSelector((state: RootState) => state.viewStory.storyId)
//     const story = useSelector((state: RootState) => state.viewStory.fullStory)
//     const pageId = useSelector((state: RootState) => state.pageToEdit.id )
//     const selectedText = useSelector((state: RootState) => state.fontEditor.textString)
//     const newFontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
//     const newFontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
//     const newFontStyle = useSelector((state: RootState) => state.pageToEdit.font)
//     const formattedText = useSelector((state: RootState) => state.pageToEdit.formattedText);
//     const rightPageLoading = useSelector((state: RootState) => state.pageToEdit.rightPageLoading)
//     const firstImagePromptIdea = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)

//     const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
//     const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
//     const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)
//     const backgroundIdea = useSelector((state: RootState) => state.pageToEdit.backgroundIdea)
//     const showLayoutScrollbar = useSelector((state: RootState) => state.pageToEdit.showLayoutScrollbar)
    
//     const [happyToSelectImage, setHappyToSelectImage] = useState<boolean | 'not clicked'>('not clicked')

//     const [value, setValue] = useState(pageText)
//     const [currentQuadrant, setCurrentQuadrant] = useState(1);
//     const [btnId, setBtnId] = useState()
//     const [textSize, setTextSize] = useState<number>(24)
//     const [loading, setLoading] = useState<boolean>(false)
//     const [gettingSmallImage, setGettingSmallImage] = useState<boolean>(false)
//     const [addText, setAddText] = useState<boolean>(false)
//     const [updatedPageText, setUpdatedPageText] = useState<string>(pageText)
//     const [currentStoryId, setCurrentStoryId] = useState<string | null>()
//     const [upscaleImage, setUpscaleImage] = useState<string | null>(null)
//     const [highlightedText, setHighlightedText] = useState<string | null>(null)
//     const open = useSelector((state: RootState) =>  state.improveImagesModal.status);
//     const [gettingImage, setGettingImage] = useState<boolean>(false)
//     const [imageUrlType, setImageChoicesUrl] = useState<string>('choices')
//     const highlightedTextRef = useRef<string>('');
//     const [showText, setShowText] = useState(true);
//     const [imageBoxHeight, setImageBoxHeight] = useState<string>();

//     const [textHeight, setTextHeight] = useState(0);
//     const [boxHeight, setBoxHeight] = useState(0);
//     const [showGrid, setShowGrid] = useState(false)
//     const [showSmallImageGrid, setShowSmallImageGrid] = useState(false)
//     const [smallImagePrompt, setSmallImagePrompt] = useState<string | null> (null)

//     const textRef = useRef<HTMLParagraphElement | null>(null);
//     const boxRef = useRef<HTMLDivElement | null>(null);
//     const [color, setColor] = useState("#c026d3");

//     const [url, setUrl] = useState<string | null>(null)

//     const override: CSSProperties = {
//         display: "block",
//         margin: "0 auto",
//         borderColor: "#c026d3",
//       };
      

//     const editText = () => {
//         dispatch(setEditBarType('editText'))
//         dispatch(setName('editLeft'))
//       }

//       const play = useCallback(() => {
//         // console.log(audioRef, audioUrl)
//             setPlaying(true);
//       }, [audioUrl])
      
//       const pause = () => {
//         // if (!audioUrl || !audioRef.current) return;
//             setPlaying(false);
//             // audioRef.current.pause();
//             // console.log(audioRef.current.ended)
//       };

//       useEffect(() => {
//         if (!imageUrl && !improvedImageUrl){
//           setUrl(null)
//         }
//         else if (imageUrl && !improvedImageUrl){
//           setUrl(imageUrl)
//         } else if (improvedImageUrl){
//           setUrl(improvedImageUrl)
//         }
//       }, [improvedImageUrl, imageUrl])
      



//   return (

//     <div
//     ref={boxRef}
//     className={`border-2 border-gray-300 border-dashed h-[450px] w-[450px] bg-white drop-shadow-md ${
//       showText ? 'opacity-100' : 'opacity-0 scale-0 translate-y-[-50%] transition-all duration-300'
//     }`}
//   >
// {showSmallImageGrid && smallImageUrl  && (() => {
// let bgPosition = 'top left';
// switch (currentQuadrant) {
//   case 1:
//     bgPosition = 'top left';
//     break;
//   case 2:
//     bgPosition = 'top right';
//     break;
//   case 3:
//     bgPosition = 'bottom left';
//     break;
//   case 4:
//     bgPosition = 'bottom right';
//     break;
//   default:
//     bgPosition = 'top left';
// }
// return (
//   <div className="relative w-1/2 h-1/2 z-50 mx-auto mt-4" >
//   <div
//     className="w-full h-full bg-no-repeat bg-cover rounded-sm cursor-pointer"
//     style={{
//       backgroundImage: `url(${smallImageUrl})`,
//       backgroundPosition: bgPosition,
//       backgroundSize: '200% 200%'
//     }}
//   />

// </div>
// );
// })()}

// {!showSmallImageGrid && smallImageUrl && smallImageButtonId && url && (
//   <div className="relative w-1/2 h-1/2 z-50 mx-auto mt-4" >
//     <Image src={smallImageUrl} className='w-full h-full' fill alt='/' />
//     {/* <Image src={url} className='w-full h-full' fill alt='/' /> */}
//   </div>
// )}

//         {/* <button onClick={() => dispatch(setEditTextPageId(pageId)) } ref={textRef} className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-50`}>{pageText}</button> */}
// <button onClick={editText} className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-10 mb-6`}>{pageText}</button>
        
        
//   {/* {!smallImageUrl && !gettingSmallImage || !smallImageButtonId && ( */}
//   {!smallImageUrl && (
//     <SmallImageIdeas />
//   )}

//       {gettingSmallImage && (
//         <div className="w-full h-full items-center text-center">
//              <SyncLoader
//           color={color}
//           loading={loading}
//           cssOverride={override}
//           size={15}
//           aria-label="Loading Spinner"
//           data-testid="loader"
//         />
//         <p>Your small image is on its way!</p>
//         </div>
//       )}
 


// {audioUrl && (
// <div className="absolute bottom-20 w-full ">
//   {playing ? (
//     <PauseCircleIcon className="h-8 w-8 text-green-500 absolute left-10"  onClick={pause} />
//   ):
//     <PlayCircleIcon className="h-8 w-8 text-green-500 absolute left-10" onClick={play} />
//   }
// </div>
// )}


// </div>
//   )
// }

// export default InsidePageLeft

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/outline';
import { SyncLoader } from 'react-spinners';
import SmallImageIdeas from "./SmallImageIdeas";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setAudioUrl, setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice";
import { RootState } from "../app/GlobalRedux/store";
import { setUsername } from "../app/GlobalRedux/Features/userDetailsSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";

function InsidePageLeft() {
  const dispatch = useDispatch();
  const { data: session } = useSession()
  const storyId = useSelector((state: RootState) => state.viewStory.storyId)
  const pageText = useSelector((state: RootState) => state.pageToEdit.text);
  const textColor = useSelector((state: RootState) => state.pageToEdit.textColor)
  const smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl);
  const improvedSmallImageUrl = useSelector((state: RootState) => state.pageToEdit.improvedSmallImageUrl)
  const finalSmallImageUrl = useSelector((state: RootState) => state.pageToEdit.finalSmallImageUrl);
  const audioUrl = useSelector((state: RootState) => state.pageToEdit.audioUrl);
  const [pages, setPages] = useState([]);
  const [hasParsingError, setHasParsingError] = useState(false);
  const [url, setUrl] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false);
  const [color, setColor] = useState("#c026d3");
  const [loading, setLoading] = useState(false);

  const editText = () => {
    dispatch(setEditBarType('editText'));
    dispatch(setName('editLeft'));
  };

  const editImage = () => {
    dispatch(setName('improveLeftImage'))
    dispatch(setEditBarType('improveRightImage'))

  };

  const play = useCallback(() => {
    setPlaying(true);
  }, []);

  const pause = () => {
    setPlaying(false);
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#c026d3",
  };

  useEffect(() => {
    if (!finalSmallImageUrl && !smallImageUrl && !improvedSmallImageUrl){
            console.log('url is null')
            setUrl(null)
    }
    if (!finalSmallImageUrl && !improvedSmallImageUrl && smallImageUrl){
        console.log('url is small image url', smallImageUrl)
        setUrl(smallImageUrl)
    }
    if (!finalSmallImageUrl && improvedSmallImageUrl){
        console.log('url is improveed', improvedSmallImageUrl)
        setUrl(improvedSmallImageUrl)
    }
    if (finalSmallImageUrl){
        console.log('url is final', finalSmallImageUrl)
        setUrl(finalSmallImageUrl)
    }
  }, [smallImageUrl, finalSmallImageUrl])

  useEffect(() => {
    // Split the story based on the "Page X:" pattern
    console.log('PAGE >>>', pageText)
    if (pageText){


    const parsedPages = pageText.split(/Page \d+: /).filter(Boolean);
    console.log(parsedPages)
    
    if (parsedPages.length <= 1) {
      // If there's only one page after splitting, there's an error

      setHasParsingError(false);
      console.log("NOOO parsing error")

    } else {
      // setPages(parsedPages);
      setHasParsingError(true);
      console.log("we have had a parsing error", parsedPages.length)
      parsedPages.map((text, index) => {
        console.log('EACH page', text, index)
        updateStoryPages(text, index)
      })

    }
  }
  }, [pageText]);

  const updateStoryPages = async(text: string, index: number) => {
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", `page_${index + 1}`);
    const updatedPage = await updateDoc(docRef, {
      text: text
    });
  }

  return (
    <div className="border-2 border-gray-300 border-dashed h-[450px] w-[450px] bg-white drop-shadow-md overflow-y-scroll">
        
        {url && (
            <div className="relative w-1/2 h-1/2 z-50 mx-auto mt-4">
                <button onClick={editImage}>
                    <Image src={url} alt='/' className="flex-2" fill />
                </button>
            </div>
        )}  

      <button onClick={editText} className={`m-4 p-4 font-mystery ${textColor} leading-loose my-auto z-10 mb-6`}>{pageText}</button>

      {!smallImageUrl && <SmallImageIdeas />}

      {audioUrl && (
        <div className="absolute bottom-20 w-full ">
          {playing ? (
            <PauseCircleIcon className="h-8 w-8 text-green-500 absolute left-10" onClick={pause} />
          ) : (
            <PlayCircleIcon className="h-8 w-8 text-green-500 absolute left-10" onClick={play} />
          )}
        </div>
      )}
    </div>
  )
}

export default InsidePageLeft;
