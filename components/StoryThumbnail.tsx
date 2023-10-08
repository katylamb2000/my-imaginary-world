'use client'

import Image from "next/image"
import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { RootState } from '../app/GlobalRedux/store';
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from 'react-redux';
import { setBaseStoryImagePrompt, setBaseStoryImagePromptCreated, setStoryId, setTitle } from '../app/GlobalRedux/Features/viewStorySlice'
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { setEditBarType, setId, setImageUrl } from "../app/GlobalRedux/Features/pageToEditSlice"
import { setIsLoading } from "../app/GlobalRedux/Features/pageLoadingSlice"


interface Story {
  id: string,
  image: string,
  baseImagePrompt: string,
  title: string, 
  baseImagePromptCreated: Boolean,
  thumbnail: string | null
}

type Props = {
  id: string,
  story: Story;
}
  
function StoryThumbnail({ id, story }: Props) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const [addTitle, setAddTitle] = useState<boolean>(false)
  const [titleInput, setTitleInput] = useState<string>('')
  const defaultImage = 'https://cdn.discordapp.com/attachments/1124681343457050714/1152232800964059206/ZoeBarrett_Scene_of_Bodi_and_Buzz_travelling_through_the_stars__268d7f42-6521-4e02-a3b7-f0ec8628baa7.png'

  const addStoryDetailsToRedux = () => {
    dispatch(setName('CoverPage'))
    dispatch(setId('Cover Page'))
    dispatch(setTitle(story.title))
    // dispatch(setImageUrl(page.data.imageUrl))
    // dispatch(setButtonId(page.data.buttonMessageId))
    dispatch(setEditBarType('editCover'))
    dispatch(setStoryId(id))
    dispatch(setIsLoading(true))
    router.push(`/story/${id}`)
  }

  const addNewTitle = () => {
    setAddTitle(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
  }
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const docRef = doc(db, "users", session?.user?.email!, 'storys', id);
      await updateDoc(docRef, {
        title: titleInput
      });
    try{    
    }catch(err){
      console.log(err)
    }
  }

  const deleteStory = async() => {
    try{
      const docRef = doc(db, "users", session?.user?.email!, 'storys', id);
      await deleteDoc(docRef)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className={`flex flex-col items-center shadow-lg mx-3 mt-6 rounded-sm overflow-hidden transform hover:scale-105 transition-transform ease-in-out relative bg-white hover:z-10 w-64 h-80`}>
        <div onClick={addStoryDetailsToRedux} className='relative w-full h-2/3 overflow-hidden rounded-t-lg'>
            <Image src={story.thumbnail ? story.thumbnail : defaultImage } alt="Story Thumbnail" fill className="w-full h-full object-center object-contain pt-2"/>
        </div>
      <div className={`p-4 rounded-b-lg text-start w-full`}>
          <h3 className={`text-md font-bold text-purple-700 truncate `}>{story.id}</h3>
          {story.title ? (
              <>
                  <h3 className={`text-md font-bold text-purple-700 truncate hover:whitespace-normal hover:overflow-visible`}>{story.title}</h3>
                  <h4 className={`text-sm text-gray-600`}>{session?.user?.name || 'Author name'}</h4>
              </>
          ) : addTitle ? (
              <div className="story-form">
                  <form onSubmit={handleSubmit}>
                      <input type='text' placeholder='Story title' onChange={e => setTitleInput(e.target.value)} value={titleInput} className='w-full bg-transparent border-b border-gray-500 text-purple-700 py-2 mb-3 pl-2'/>
                  </form>
              </div>
          ) : (
              <div className="story-add-title">
                  <button className={`bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded`} onClick={addNewTitle}>Add a story title</button>
              </div>
          )}
          <div className={`absolute top-2 right-2 text-white hover:text-purple-600 h-5 w-5 cursor-pointer`}>
              <XCircleIcon onClick={deleteStory} />
          </div>
      </div>
  </div>
  )
}

export default StoryThumbnail