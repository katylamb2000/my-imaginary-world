'use client'

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
            setUrl(null)
    }
    if (!finalSmallImageUrl && !improvedSmallImageUrl && smallImageUrl){
        setUrl(smallImageUrl)
    }
    if (!finalSmallImageUrl && improvedSmallImageUrl){
        setUrl(improvedSmallImageUrl)
    }
    if (finalSmallImageUrl){
        setUrl(finalSmallImageUrl)
    }
  }, [smallImageUrl, finalSmallImageUrl])

  useEffect(() => {

    if (pageText){
    const parsedPages = pageText.split(/Page \d+: /).filter(Boolean);

    if (parsedPages.length <= 1) {
      // If there's only one page after splitting, there's an error

      setHasParsingError(false);
    } else {
      // setPages(parsedPages);
      setHasParsingError(true);

      parsedPages.map((text, index) => {

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
