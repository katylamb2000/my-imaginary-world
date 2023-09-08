

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { RootState } from '../app/GlobalRedux/store';
import { setText, setId, setShowInputBox } from '../app/GlobalRedux/Features/pageToEditSlice';
import { updateModalStatus } from '../app/GlobalRedux/Features/improveImagesModalSlice';
import { setStoryId } from '../app/GlobalRedux/Features/viewStorySlice';
import { usePathname } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckDone } from '@heroicons/react/24/solid';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import NextImageModal from './NextImageModal';

function BookCover() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pageText = useSelector((state: RootState) => state.pageToEdit.text);
  const storyTitle = useSelector((state: RootState) => state.viewStory.title);
  const textColor = useSelector((state: RootState) => state.pageToEdit.titleColor);
  const signatureTextColor = useSelector((state: RootState) => state.pageToEdit.signatureTextColor);
  const textSize = useSelector((state: RootState) => state.pageToEdit.titleSize);
  const signatureTextSize = useSelector((state: RootState) => state.pageToEdit.signatureTextSize)
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl);
  const coverImage = useSelector((state: RootState) => state.viewStory.coverImage);
  const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>();
  const showInputBox = useSelector((state: RootState) => state.pageToEdit.showInputBox);
  const finalImageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl);
  const signatureLineOne = useSelector((state: RootState) => state.pageToEdit.signatureLineOne)
  const signatureLineTwo = useSelector((state: RootState) => state.pageToEdit.signatureLineTwo)

  const [title, setTitle] = useState('')

  const [titleUpdated, setTitleUpdated] = useState<boolean>(false);
  const storyId = useSelector((state: RootState) => state.viewStory.storyId);
  const { data: session } = useSession();
  const [currentQuadrant, setCurrentQuadrant] = useState(1);

  useEffect(() => {
    console.log('i am BOOKCOVER!!!!!!', 'st', storyTitle, 't', title,'pt',  pageText)
  }, [title, storyTitle, pageText]
  )

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
        console.log(button, 'id', buttonId, currentStoryId, session?.user?.email, pageId)
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
    console.log("dispatch edit text stuff and open and input b0ox etc")
    dispatch(setShowInputBox(true))
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

  return (
    <div className='bg-gray-50 h-full w-full justify-center overscroll-none'>
      <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">
        {showInputBox === false ? (
          <h1 className={`${textSize} font-bold font-roboto ${textColor} mx-auto my-auto relative z-20 cursor-pointer`}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            // onClick={editText}
            >
            {title}
          </h1>
        ) : (
          <div className='mx-auto my-[250px] z-20 cursor-pointer flex items-center justify-center'>
            <textarea
              placeholder={title || 'title'}
              className={`placeholder:text-4xl placeholder:font-bold placeholder:${textColor} pl-12 h-96 text-4xl ${textColor} font-bold `}
              value={title}
              onChange={(e) => dispatch(setText(e.target.value))}
            />
            {titleUpdated ? (
              <CheckDone className='text-green-500 h-8 w-8' />
            ) : (
              <CheckCircleIcon className='text-gray-200 h-8 w-8 hover:text-green-200' onClick={saveTitle} />
            )}
          </div>
        )}

        {/* {!finalImageUrl && (() => { */}
        { (() => {
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
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: bgPosition,
                backgroundSize: '200% 200%'
              }}
            />
          );
        })()}

      <div className='w-full h-24 items-center absolute bottom-3 '>
          <p className={`mx-auto my-auto ${signatureTextSize} ${signatureTextColor}`}>
              {signatureLineOne.length > 0 ? signatureLineOne : (session?.user?.name ? `Written and illustrated by ${session?.user?.name}` : session?.user?.email)}
          </p>
          <p className={`mx-auto my-auto ${signatureTextSize} ${signatureTextColor}`}>
              {signatureLineTwo.length > 0 ? signatureLineTwo :  'With a bit of help from A.I.'}
          </p>
      </div>

      </div>
      {!finalImageUrl && imageUrl && (
         <NextImageModal nextImage={nextQuadrant} lastImage={lastQuadrant} selectImage={upscaleChosenImage} />
      )}
      {/* <button >Go to next image</button> */}

    </div>
  );
}

export default BookCover;
