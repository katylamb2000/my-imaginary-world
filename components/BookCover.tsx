

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { RootState } from '../app/GlobalRedux/store';
import { setText, setId, setShowInputBox, setEditBarType } from '../app/GlobalRedux/Features/pageToEditSlice';
import { updateModalStatus } from '../app/GlobalRedux/Features/improveImagesModalSlice';
import { setSelectedTitle, setStoryId } from '../app/GlobalRedux/Features/viewStorySlice';
import { usePathname } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowDownCircleIcon, CheckCircleIcon as CheckDone } from '@heroicons/react/24/solid';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import NextImageModal from './NextImageModal';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice';

function BookCover() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pageText = useSelector((state: RootState) => state.pageToEdit.text);
  const storyTitle = useSelector((state: RootState) => state.viewStory.title);
  const textColor = useSelector((state: RootState) => state.viewStory.titleTextColor);
  const signatureTextColor = useSelector((state: RootState) => state.pageToEdit.signatureTextColor);
  const textSize = useSelector((state: RootState) => state.pageToEdit.titleSize);
  const signatureTextSize = useSelector((state: RootState) => state.pageToEdit.signatureTextSize)
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl);
  const thumbnailImage = useSelector((state: RootState) => state.viewStory.thumbnailImage)
  const finalImageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl);
  const improvedImageUrl = useSelector((state: RootState) => state.pageToEdit.improvedImageUrl);
  const coverImage = useSelector((state: RootState) => state.viewStory.thumbnailImage);
  const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>();
  const showInputBox = useSelector((state: RootState) => state.pageToEdit.showInputBox);
  const titleIdeas = useSelector((state: RootState) => state.viewStory.titleIdeas)
  const signatureLineOne = useSelector((state: RootState) => state.pageToEdit.signatureLineOne)
  const signatureLineTwo = useSelector((state: RootState) => state.pageToEdit.signatureLineTwo)

  const [title, setTitle] = useState('')
  const [showGrid, setShowGrid] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [introduction, setIntroduction] = useState()
  const [titleSuggestions, setTitleSuggestions] = useState<any>(null)

  const [titleUpdated, setTitleUpdated] = useState<boolean>(false);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0)
  const storyId = useSelector((state: RootState) => state.viewStory.storyId);
  const { data: session } = useSession();
  const [currentQuadrant, setCurrentQuadrant] = useState(1);

  useEffect(() => {
      if (coverImage && !finalImageUrl && !improvedImageUrl){
        setUrl(coverImage)
      }
      if (imageUrl && !finalImageUrl && improvedImageUrl){
        setUrl(improvedImageUrl)
      }
      if (imageUrl && finalImageUrl && improvedImageUrl){
        setUrl(finalImageUrl)
      }
      if (!coverImage  && !finalImageUrl && !improvedImageUrl){
        setUrl(null)
      }
  }, [imageUrl, finalImageUrl, improvedImageUrl, coverImage])

  useEffect(() => {
    if (!storyTitle && !pageText) return;
    if (storyTitle){ 
      setTitle(storyTitle)
    }
    else if (!storyTitle && pageText){
      setTitle(pageText)
    }
  }, [pageText, storyTitle])

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
  }, [pathname]);

  const nextQuadrant = () => {
    setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev + 1));
  };

  const lastQuadrant = () => {
    setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev - 1));
  };

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

    const openAIAssistant = () => {
            dispatch(updateModalStatus(true))
            dispatch(setStoryId(currentStoryId))
            dispatch(setId(pageId))   
    }

    const upscaleChosenImage = async() => {
        const button = `U${currentQuadrant}`
        var data = JSON.stringify({
          button: button,
          buttonMessageId: buttonId ,
          ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'upscale', page: pageId },
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

  const editText = () => {
    dispatch(setShowInputBox(true))
  }

  const editMainImage = () => {
    // dispatch(setName('improveRightImage'))
    dispatch(setEditBarType('improveRightImage'))
  }

  const saveTitle = async() => {
    try{ 
      if (!storyId) return;
      const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", 'page_1');
      const updatedPage = await updateDoc(docRef, {
        text: title
      });
      setTitleUpdated(true)
      dispatch(setShowInputBox(false))
    }catch(err){
      console.log(err)
      dispatch(setShowInputBox(false))
    }
  }

  const editTitle = () => {

  }

//   useEffect(() => {
//     if (titleIdeas) {
//     const suggestionArray = titleIdeas.match(/(\d\..*?)(?=\d\.|$)/gs);

//     if (suggestionArray) {
//         setTitleSuggestions(suggestionArray.map(suggestion => suggestion.trim()));
//     }
//     }
// }, [titleIdeas]);

useEffect(() => {
  if (titleIdeas) {
      const suggestionArray = titleIdeas.match(/(\d\..*?)(?=\d\.|$)/gs);

      if (suggestionArray) {
          const cleanedSuggestions = suggestionArray.map(suggestion => {
              // Remove the starting number and dot (e.g., "0. ")
              const withoutNumber = suggestion.replace(/^\d\.\s*/, "");
              
              // Remove comma at the end, if it exists
              const cleanedSuggestion = withoutNumber.replace(/,$/, "").trim();

              return cleanedSuggestion;
          });
          setTitleSuggestions(cleanedSuggestions);
      }
  }
}, [titleIdeas]);

const goToNextSuggestion = () => {
  if (suggestionIndex !== 9){
    setSuggestionIndex(suggestionIndex + 1)
  }
 else if (suggestionIndex == 9){
  setSuggestionIndex(0)
 }
}

useEffect(() => {
  if (!titleSuggestions) return;
  dispatch(setSelectedTitle(titleSuggestions[suggestionIndex]))
}, [titleSuggestions])

console.log("Story title", storyTitle, "PAGE ID", pageId, 'Title suggestions', titleSuggestions)

return (
    <div className='bg-gray-50 h-full w-full justify-center overscroll-none'>
      <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">
        
        {/* <h1 className={`${textSize} font-bold font-roboto ${textColor} mx-auto my-auto relative z-20 cursor-pointer`} */}
        {!titleIdeas && (
          <button onClick={editTitle}>
            <h1 className={`${textSize} font-bold font-roboto ${textColor} mx-auto my-auto relative z-20 cursor-pointer`}

                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                // onClick={editText}
                >
                {storyTitle || 'No Title yet'}
              </h1>
            </button>
        )}

        {titleIdeas && storyTitle && (
          <button onClick={editTitle}>
            <h1 className={`${textSize} font-bold font-roboto ${textColor} mx-auto my-auto relative z-20 cursor-pointer`}

                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                // onClick={editText}
                >
                {storyTitle || 'No Title yet'}
              </h1>
            </button>
        )}

        {titleSuggestions && !storyTitle && (
            <button className='flex' onClick={goToNextSuggestion}> 
                <p className={`${textSize} font-bold font-roboto ${textColor} mx-auto my-auto relative z-20 cursor-pointer`}
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                  >{titleSuggestions[suggestionIndex]}
                </p>    
            </button>
        )}


        {/* {!finalImageUrl && (() => { */}
        {/* {showGrid && (() => {
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
              className="w-full h-full bg-no-repeat bg-cover rounded-sm cursor-pointer"
              style={{
                backgroundImage: `url(${url})`,
                backgroundPosition: bgPosition,
                backgroundSize: '200% 200%'
              }}
            />
          );
        })()} */}


          {url && (
     
     <div className="h-full w-full relative bg-gray-100">
       <button className='w-full h-full cursor-pointer' onClick={editMainImage}>
     <Image className="w-full h-full z-10" fill src={url} alt='/' />
     </button>
   </div>

 )}

      <div className='w-full h-24 items-center absolute bottom-3 '>
          <p className={`mx-auto my-auto ${signatureTextSize} ${signatureTextColor}`}>
              {signatureLineOne.length > 0 ? signatureLineOne : (session?.user?.name ? `Written and illustrated by ${session?.user?.name}` : session?.user?.email)}
          </p>
          <p className={`mx-auto my-auto ${signatureTextSize} ${signatureTextColor}`}>
              {signatureLineTwo.length > 0 ? signatureLineTwo :  'With a bit of help from A.I. :)'}
          </p>
      </div>

      </div>

    </div>
  );
}

export default BookCover;
