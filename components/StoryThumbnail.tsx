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

  console.log('this is the story ----> ', story)

  const addStoryDetailsToRedux = () => {

    console.log('this is the story ----> ', story.title)

    dispatch(setName('CoverPage'))
    dispatch(setId('page_1'))
    dispatch(setTitle(story.title))
    // dispatch(setImageUrl(page.data.imageUrl))
    // dispatch(setButtonId(page.data.buttonMessageId))
    dispatch(setEditBarType('editCover'))
    dispatch(setStoryId(id))
    router.push(`/story/${id}`)

  }

  const addNewTitle = () => {
    setAddTitle(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    console.log(e.target.value)
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
<div className="flex flex-col items-center shadow-lg mx-3 mt-6 rounded-lg overflow-hidden group hover:scale-150 transition-transform duration-200 ease-in-out relative bg-white hover:z-10">
      <div onClick={addStoryDetailsToRedux} className='relative w-full h-3/4 overflow-hidden rounded-t-lg'>
        <div className="absolute inset-0 bg-black opacity-40 hover:opacity-20 transition-opacity duration-200"></div>
        {story.thumbnail ? (
          <Image
            src={story.thumbnail}
            layout="fill"
            className="w-full h-full object-cover"
            alt="/"
          />
        ) : (
          <Image 
            layout="fill"
            alt='/thumbnail'
            className="w-full h-full object-cover"
            src={'https://cdn.discordapp.com/attachments/1103367080088191017/1112776230886965340/JimJ.Martin_Illustrate_Title_Sophia_and_the_Super_Sharky_Mermai_be2f358b-48c8-4fcb-b634-051fc8294d17.png'}
          />
        )}
      </div>
      <div className="p-4 rounded-b-lg text-start w-full">
        {story.title ? (
          <>
         <h3 className="text-md font-bold text-purple-700 truncate group-hover:whitespace-normal group-hover:overflow-visible">{story.title}</h3>
         <h4>{session?.user?.name || 'Authour name'}</h4>
         </>
        ) : addTitle ? (
          <div>
            <form onSubmit={handleSubmit}>
              <input 
                type='text' 
                placeholder='story title' 
                onChange={e => setTitleInput(e.target.value)} 
                value={titleInput} 
                className='w-full bg-transparent border-b border-gray-500 text-purple-700 py-2 mb-3 pl-2'
              />
            </form>
          </div>
        ) : (
          <div>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded" 
              onClick={addNewTitle}
            >
              Add a story title
            </button>
          </div>
        )}

        <div className="absolute top-0 right-0 p-2">
          <XCircleIcon 
            className="text-white hover:text-purple-600 h-5 w-5 cursor-pointer" 
            onClick={deleteStory} 
          />
        </div>
      </div>
    </div>
  )
        }

export default StoryThumbnail