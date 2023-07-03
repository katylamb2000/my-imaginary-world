'use client'

import Image from "next/image"
import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { RootState } from '../app/GlobalRedux/store';
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from 'react-redux';
import { setBaseStoryImagePrompt, setBaseStoryImagePromptCreated } from '../app/GlobalRedux/Features/viewStorySlice'
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface Story {
  id: string,
  image: string,
  baseImagePrompt: string,
  title: string, 
  baseImagePromptCreated: Boolean
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

  const addStoryDetailsToRedux = () => {

    // dispatch(setBaseStoryImagePrompt(story.baseImagePrompt))
    // dispatch(setBaseStoryImagePromptCreated(story.baseImagePromptCreated))
    dispatch(setName('view story'))
    console.log('this is the function to dispatch setName')
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
    <div>
    <button
      onClick={addStoryDetailsToRedux}
      >
      {story.image ? (
          <img src={story.image}         
          className="h-48 w-48 rounded-lg cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4" />
        ):
        // <div 
        //   className='w-48 h-48 rounded-lg bg-pink-400 text-center items-center justify-center align-center'>
        //     <p>{id}</p>
        // </div>
         
    <div className="h-48 w-48 rounded-md cursor-pointer mb-2 hover:opacity-50 mx-auto p-4">

        <Image 
              width={250}
              height={250}
              className="rounded-md"
              alt='/thumbnail'
              src={'https://cdn.discordapp.com/attachments/1103367080088191017/1112776230886965340/JimJ.Martin_Illustrate_Title_Sophia_and_the_Super_Sharky_Mermai_be2f358b-48c8-4fcb-b634-051fc8294d17.png'}
              />
    </div>
}
         </button>


      <div className=" flex mx-24 text-center justify-between">
      {story.title ? (
          <p>{story.title}</p>
        ):
        addTitle ? (
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='story title' onChange={e => setTitleInput(e.target.value)} value={titleInput} className='text-gray-800' />
        </form>
         )
        : <button onClick={addNewTitle}>Add a story title</button>
}
  <div>
  <XCircleIcon className="h-4 w-4 flex-end absolute text-green-300 hover:text-red-600 hover:scale-125" onClick={deleteStory} />
  </div>
  </div>

</div> 

  )
}

export default StoryThumbnail