
    'use client'

import Image from "next/image";
import axios from "axios";

import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, useCallback, CSSProperties } from "react";
import { setImageUrl, setEditText, setText, setId , setAudioUrl, setEditBarType, setMidjourneyInitialRequestResponse} from "../app/GlobalRedux/Features/pageToEditSlice";
import { setEditTextPageId } from "../app/GlobalRedux/Features/editTextModalSlice";
import { setPageLoadingMainImage, setStoryId } from "../app/GlobalRedux/Features/viewStorySlice";
import { doc, updateDoc, collection } from "firebase/firestore";

import { db } from "../firebase";

import { SyncLoader } from 'react-spinners'
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";


type Props = {
  storyPages: any
  imageIdeas: any
}

function InsidePageRight() {
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
    const midjourneySuccess = useSelector((state: RootState) => state.pageToEdit.midjourneyInitialRequestResponse)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id )
    const isPageLoading = useSelector((state: RootState) => 
          pageId ? state.viewStory.pagesLoadingMainImage[pageId] : false
      );
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


    const newFontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
    const newFontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
    const newFontStyle = useSelector((state: RootState) => state.pageToEdit.font)

    const rightPageLoading = useSelector((state: RootState) => state.pageToEdit.rightPageLoading)
    const firstImagePromptIdea = useSelector((state: RootState) => state.pageToEdit.firstImagePromptIdea)

    const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
    const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)
    
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
    const storyCharacters = useSelector((state: RootState) => state.viewStory.storyCharacters)

    const textRef = useRef<HTMLParagraphElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [color, setColor] = useState("#c026d3");
    const [enhancedText, setEnhancedText] = useState<string | null>(null);

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

  const updateText = async (text: string) => {

    if (!storyId || !pageId || !session) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
    const updatedPage = await updateDoc(docRef, {
      text: text
    });
  };

useEffect(() => {
    if (fullPageImageUrl) return;

    if (!fullPageImageUrl && !characters.length){
        // fetchStoryCharacters()
    }
}, [fullPageImageUrl, characters])


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

useEffect(() => {
    if (pageText == undefined) return;
      if (pageText.startsWith('undefined')) {
        let text = pageText.replace('undefined', '').trim();
        dispatch(setText(text))
        updateText(text)
    }
}, [pageText])

const editMainImage = () => {
  dispatch(setName('improveRightImage'))
  dispatch(setEditBarType('improveRightImage'))
}

useEffect(() => {
  if (firstImagePromptIdea && storyCharacters.length > 0) {
    let newText = firstImagePromptIdea;

    if (typeof newText !== 'string') {
      console.error('newText is not a string:', newText);
      return;
    }

    storyCharacters.forEach((character) => {
      const cleanName = character.name.trim().replace(',', '');
      const regex = new RegExp(`\\b${cleanName}\\b`, 'g');
      newText = newText.replace(regex, (match) => `${character.description} (${match})`);
    });

    // Trim newText to 1400 characters if it exceeds that length
    if (newText.length > 1400) {
      newText = newText.substring(0, 1400);
      console.log('Trimmed enhanced text to 1400 characters.');
    }

    if (newText !== firstImagePromptIdea) {
      console.log('ENHANCED ===>>', newText)
      setEnhancedText(newText);
    }
  }
}, [firstImagePromptIdea, storyCharacters]);


const getImage = async () => {
    // if (!enhancedText) {
    //     throw new Error("Image prompt is undefined.");
    // }
// if (firstImagePromptIdea && enhancedText){
//   console.log('LENGTH', firstImagePromptIdea.length, 'enhanced ==>', enhancedText,  enhancedText.length, 'fipi ===>', firstImagePromptIdea )
// }

  const data = JSON.stringify({
      msg: enhancedText || firstImagePromptIdea,
      ref: { storyId: storyId, userId: session?.user?.email, action: 'imagine', page: pageId },
      webhookOverride: ""
  });

  const config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/imagine',
      headers: {
          'Authorization': `Bearer ${process.env.next_leg_api_token}`,
          'Content-Type': 'application/json'
      },
      data: data
  };

  try {
      const response = await axios(config);
      console.log("Midjourney Response:", JSON.stringify(response.data));
      const midjourneyResp = JSON.stringify(response.data.success)
      if (!midjourneyResp) return;
      dispatch(setMidjourneyInitialRequestResponse(midjourneyResp))
      console.log("Midjourney Response JSON:", midjourneyResp);
      updatePageWithSuccessMsg()
      dispatch(setPageLoadingMainImage(pageId)); // set the page as loading          // ... handle the response ... 
  } catch (error) {
      console.error("Error sending to Midjourney:", error);
      throw error;  // If you want the main function to catch this error too
  }
};

const updatePageWithSuccessMsg = async() => {
  if (!session?.user?.email || !storyId || !pageId) return;
    
  try{
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId );
    const updatedPage = await updateDoc(docRef, {
      midjourneySuccess: true
    });
  }catch(err){
      console.log(err)
  }
}

useEffect(() => {
  console.log('midjourneySuccess >>>>>>', midjourneySuccess)
})

const getImageIdea = () => {
  dispatch(setName('getRightImage'))
  dispatch(setEditBarType('getRightImage'))
}

return (
    <div className="h-[450px] w-[450px] relative" >
      <div className="border-2 border-gray-300 border-dashed h-full w-full bg-white drop-shadow-md relative">
      {!url && loading && (
        <div className="w-full h-full items-center justify-center text-center my-24 ">
                  <SyncLoader
                  color={color}
                  loading={loading}
                  cssOverride={override}
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <p className={`text-fuchsia-600`}>Your image is being created</p>
            </div>
      )}
    
    {/* {showGrid && url && !finalImageUrl  && !rightPageLoading && (() => {
        let bgPosition = 'top left';
        switch (currentQuadrant) {
          case 1:
            bgPosition = 'top left';
            break;
          case 2:
            bgPosition = 'top right';
            break;
          case 3:
            bgPosition = 'bottom left';
            break;
          case 4:
            bgPosition = 'bottom right';
            break;
          default:
            bgPosition = 'top left';
        }
        return (
          <div
            className="w-full h-full bg-no-repeat bg-cover rounded-sm cursor-pointer relative" 
            style={{
              backgroundImage: `url(${url})`,
              backgroundPosition: bgPosition,
              backgroundSize: '200% 200%'
            }}>
           <p className="text-white bg-black bg-opacity-50 absolute bottom-4 left-0 w-full text-center text-lg mb-4 px-4 z-25"> 
  {rightPageText}
</p>
          </div>
        );
      })()} */}
    
    
    {imageUrl && !showGrid && !finalImageUrl && !improvedImageUrl && url &&  (
      <div className="h-full w-full relative bg-gray-100">
          <button className="h-full w-full cursor-pointer relative" onClick={editMainImage}>
            <Image className="w-full h-full z-10" fill src={url} alt='/' />
            <p className="text-white bg-black bg-opacity-50 absolute bottom-4 left-0 w-full text-center text-lg mb-4 px-4 z-50"> 
              {rightPageText}
            </p>
          </button>
      </div>
    )}
    
    {!showGrid && !finalImageUrl && improvedImageUrl && !rightPageLoading && (
      <div className="h-full w-full relative bg-gray-100">
        <button className="h-full w-full cursor-pointer relative" onClick={editMainImage}>
          <Image className="w-full h-full z-10" fill src={improvedImageUrl} alt='/' />
          <p className="text-white bg-black bg-opacity-50 absolute bottom-4 left-0 w-full text-center text-lg mb-4 px-4 z-50"> 
            {rightPageText}
          </p>
        </button>
      </div>
    )}
    
      {finalImageUrl && !rightPageLoading && (
          <div className="h-full w-full relative">
              <Image className="w-full h-full z-10 " fill src={finalImageUrl} alt='/' />
              <p className="text-white bg-black bg-opacity-50 absolute bottom-4 left-0 w-full text-center text-lg mb-4 px-4 z-50"> 
                {rightPageText}
              </p>
          </div>
        )}
    
        {rightPageLoading && (
          <div className="w-full h-full items-center text-center ">
            <SyncLoader
               color={color}
               loading={loading}
               cssOverride={override}
               size={15}
               aria-label="Loading Spinner"
               data-testid="loader"
             />
             </div>
        )}

    {!firstImagePromptIdea && !midjourneySuccess && (
      <div className="w-full h-full text-center justify-center">
          <button className=" mx-auto my-24 p-4 border-2 border-purple-400 rounded-lg text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
            onClick={getImageIdea}
            >
               Get an image idea
            </button>
      </div>
  
      )}

{firstImagePromptIdea && midjourneySuccess && (
      <div className="w-full h-full text-center justify-center">
          {/* <button className=" mx-auto my-24 p-4 border-2 border-purple-400 rounded-lg text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
            onClick={getImageIdea}
            > */}
               <p>Your image is being created please be patient</p>
            {/* </button> */}
      </div>
  
      )}
    
    {firstImagePromptIdea && !imageUrl && !midjourneySuccess && (
            <button className="p-4 text-green-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
            onClick={getImage}
            >
               {firstImagePromptIdea}
               {/* {imagePrompt} */}
            </button>
      )}

      {firstImagePromptIdea && !imageUrl && midjourneySuccess && isPageLoading && (
          <div className="w-full h-full items-center text-center ">
                <SyncLoader
                         color={color}
                         loading={loading}
                         cssOverride={override}
                         size={15}
                         aria-label="Loading Spinner"
                         data-testid="loader"
                       />
                <p className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600">Your image is being created</p>
          </div>
    )}
    
          </div>
          </div>
  )
}

export default InsidePageRight