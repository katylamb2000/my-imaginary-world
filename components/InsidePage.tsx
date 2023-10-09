'use client'

import Image from "next/image";
import axios from "axios";
import Draggable from "react-draggable";
import dynamic from "next/dynamic";
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback, CSSProperties } from "react";
import { setImageUrl, setEditText, setText, setId , setAudioUrl, setEditBarType} from "../app/GlobalRedux/Features/pageToEditSlice";
import { setEditTextPageId } from "../app/GlobalRedux/Features/editTextModalSlice";
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
import NextImageModal from "./NextImageModal";
import { SyncLoader } from 'react-spinners'
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import NextSmallImageModal from "./NextSmallImageModal";
import GetImageButton from "./GetImageButton";
import GetSmallImagesButton from "./GetSmallImagesButton";
import ImageGridButtons from "./ImageGridButtons";
import { DeliveryReceiptListInstance } from "twilio/lib/rest/conversations/v1/conversation/message/deliveryReceipt";
import { ArrowSmallRightIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { page } from "pdfkit";
import BottomBar from "./BottomBar";
import SmallImageIdeas from "./SmallImageIdeas";
import InsidePageLeft from "./InsidePageLeft";
import InsidePageRight from "./InsidePageRight";

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
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const pageText = useSelector((state: RootState) => state.pageToEdit.text)
    const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
    const audioUrl = useSelector((state: RootState) => state.pageToEdit.audioUrl)
    const characters = useSelector((state: RootState) => state.characters.characters)
    const characterDescription = useSelector((state: RootState) => state.pageToEdit.characterDescription)
    const heroCharacterName = useSelector((state: RootState) => state.pageToEdit.heroCharacterName)
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const improvedImageUrl = useSelector((state: RootState) => state.pageToEdit.improvedImageUrl)
    const imagePrompt = useSelector((state: RootState) => state.pageToEdit.imagePrompt)
    const smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl)
    const finalImageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl)
    const [fullPageImageUrl, setFullPageImage] = useState(null)
    const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1141007317580656672/katy2000_on_a_white_background_in_the_style_of_adam_stower_a_c_863e0d5e-0589-493d-b9bb-211e6caa0ab2.png?width=1060&height=1060')
    // const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1140985949216571463/katy2000_on_a_white_background_draw_two_friendly_aliens_in_the_5a7de73c-0857-4382-9cea-a6b4ade86a5b.png?width=1060&height=1060')
    // const [smallRoundImageUrl, setSmallRoundImageUrl] = useState('https://media.discordapp.net/attachments/1083423262681350234/1140984757778403368/katy2000_on_a_white_background_draw_a_giant_pruple_monster_in__acf329b5-6136-43e1-a2fb-c0b539c32fc8.png?width=1060&height=1060') 
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const smallImageButtonId = useSelector((state: RootState) => state.pageToEdit.smallImageButtonId)
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
    const rightPageLoading = useSelector((state: RootState) => state.pageToEdit.rightPageLoading)
    const firstImagePromptIdea = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)

    const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
    const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)
    const backgroundIdea = useSelector((state: RootState) => state.pageToEdit.backgroundIdea)
    const showLayoutScrollbar = useSelector((state: RootState) => state.pageToEdit.showLayoutScrollbar)
    
    const [happyToSelectImage, setHappyToSelectImage] = useState<boolean | 'not clicked'>('not clicked')

    const [value, setValue] = useState(pageText)
    const [currentQuadrant, setCurrentQuadrant] = useState(1);
    const [btnId, setBtnId] = useState()
    const [textSize, setTextSize] = useState<number>(24)
    const [loading, setLoading] = useState<boolean>(false)
    const [gettingSmallImage, setGettingSmallImage] = useState<boolean>(false)
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
    const [imageBoxHeight, setImageBoxHeight] = useState<string>();

    const [textHeight, setTextHeight] = useState(0);
    const [boxHeight, setBoxHeight] = useState(0);
    const [showGrid, setShowGrid] = useState(false)
    const [showSmallImageGrid, setShowSmallImageGrid] = useState(false)
    const [smallImagePrompt, setSmallImagePrompt] = useState<string | null> (null)

    const textRef = useRef<HTMLParagraphElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [color, setColor] = useState("#c026d3");

    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
      if (!imageUrl && !improvedImageUrl){
        setUrl(null)
      }
      else if (imageUrl && !improvedImageUrl){
        setUrl(imageUrl)
      } else if (improvedImageUrl){
        setUrl(improvedImageUrl)
      }
    }, [improvedImageUrl, imageUrl])


const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#c026d3",
};

useEffect(() => {
    setShowGrid(false)
}, [pageId])

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

    useEffect(() => {
      const imageHeight = boxHeight - textHeight;
      const int = Math.floor(imageHeight)
      const string = int.toString()
      const ibh = `h-[${string}px]`
      setImageBoxHeight(ibh)
    }, [boxHeight, textHeight, imageBoxHeight])
  
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
      setLoading(true)
        // let enhancedPageText = pageText;
        // enhancedPageText = enhancedPageText.replace(new RegExp(heroCharacterName, 'g'), `${heroCharacterName} (${characterDescription})`);
        
        // characters.forEach(character => {
        //     enhancedPageText = enhancedPageText.replace(new RegExp(character.name, 'g'), `${character.name} (${character.description})`);
        // });
        // setLoading(true)
        var data = JSON.stringify({
          // msg: `In the style of Adam Stower illustrate an image for a children's book depicting ${enhancedPageText} `,
          // msg: imagePrompt,
          msg: firstImagePromptIdea,
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
      }   // let enhancedPageText = pageText;
      // enhancedPageText = enhancedPageText.replace(new RegExp(heroCharacterName, 'g'), `${heroCharacterName} (${characterDescription})`);
      
      // characters.forEach(character => {
      //     enhancedPageText = enhancedPageText.replace(new RegExp(character.name, 'g'), `${character.name} (${character.description})`);
      // });
      // setLoading(true)


      const getSmallImage = async(idea: string | null, type: string) => {
        setGettingSmallImage(true)
        const prompt = `in the style of ${style} for a childrens book illustrate ${idea} on a white background`
          var data = JSON.stringify({
            msg: prompt,
            ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'imagineSmallImage', page: pageId, type: type  },
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
            setGettingSmallImage(false)
          })
          .catch(function (error) {
            console.log(error);
            setGettingSmallImage(false)
          });
        }

  const resetText = () => {
        setUpdatedPageText(pageText)
        dispatch(setEditText(''))
    }


  const updateText = async (text: string) => {

    if (!storyId || !pageId || !session) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
    const updatedPage = await updateDoc(docRef, {
      text: text
    });

    // dispatch(setEditText(''))
  };

useEffect(() => {
    if (fullPageImageUrl) return;

    if (!fullPageImageUrl && !characters.length){
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
    
    dispatch(setEditText(''));
  };

  const handleAudioEnded = () => {
    if (!pageId) return;
    const currentPageNumber = parseInt(pageId.split("_")[1], 10);
    // Increment the currentPageNumber by 1
    const nextPageNumber = currentPageNumber + 1;
    // Construct the next page name
    const nextPageId = `page_${nextPageNumber}`;
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

const getSmallImagePrompt = async() => {
  if (!session || currentStoryId == '') return;

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



useEffect(() => {
    if (textRef.current) {
        setTextHeight(textRef?.current?.getBoundingClientRect().height);
    }
    if (boxRef.current){
      setBoxHeight(boxRef?.current?.getBoundingClientRect().height);
    }
}, [pageText, boxRef]);  // This effect will run every time `pageText` changes.

const nextQuadrant = () => {
  setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev + 1));
};

const lastQuadrant = () => {
  setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev - 1));
};

const nextSmallQuadrant = () => {
  setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev + 1));
};

const lastSmallQuadrant = () => {
  setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev - 1));
};

const upscaleChosenSmallImage = async() => {
        
  const button = `U${currentQuadrant}`
  var data = JSON.stringify({
    button: button,
    buttonMessageId: btnId,
    ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'upscaleSmallImage', page: pageId },
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

  })
  .catch(function (error) {
    console.log(error);

  });
    }

  const editSmallImage = () => {
    dispatch(setEditBarType('getImages'))
    dispatch(setName('editLeft'))
  }

    useEffect(() => {
      if (pageText == undefined) return;
      if (pageText.startsWith('undefined')) {
        let text = pageText.replace('undefined', '').trim();
        dispatch(setText(text))
        updateText(text)
    }
    }, [pageText])

    const switchImages = async() => {
      if (!session || !storyId || !pageId) return;
      try{
      const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
      const updatedPage = await updateDoc(docRef, {
        smallRoundImageUrl: url,
        finalImageUrl: smallImageUrl
      });
      console.log(updatedPage)
    }catch(err){
      console.log(err)
    }
  }

return (
      
  <div className="justify-center h-full w-full bg-gray-50  col-span-6 ">
      <div className="flex space-x-6 h-[500px] pt-6 px-auto bg-gray-50  items-center place-content-center ">
        {/* {audioUrl && playing && (
            <div className="react-player-wrapper" style={{ display: "none" }}>
                <ReactPlayer url={audioUrl} playing={playing} onEnded={handleAudioEnded} />
           </div>
        )} */}
          <InsidePageLeft />
          <InsidePageRight />
      </div>

      <BottomBar />
      
  </div> 


    )
  }
  
  export default InsidePage