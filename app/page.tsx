'use client'

import Link from "next/link"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch } from "react-redux" 
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import StoryThumbnail from '../components/StoryThumbnail'
import { addDoc, collection, serverTimestamp, doc } from "firebase/firestore"
import { db } from "../firebase"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import SideBar from "../components/SideBar"
import axios from "axios"
import { setUsername } from "./GlobalRedux/Features/userDetailsSlice"

interface Story {
  id: string,
  image: string,
  baseImagePrompt: string,
  title: string, 
  baseImagePromptCreated: Boolean,
}

function HomePage() {
    const [storyId, setStoryId] = useState<null | string>(null);
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const { data: session } = useSession()


    const createNewStory = async() => {
      const doc = await addDoc(collection(db, "users", session?.user?.email!, 'storys'), {
          userId: session?.user?.email!,
          createdAt: serverTimestamp(), 
          fullImagePrompt: null
      });
      dispatch(setName('create story outline'))
      router.push(`/story/${doc.id}`)
    }

    const [storys, loading, error] = useCollection(
      session && collection(db, 'users', session?.user?.email!, 'storys'),
    )

    const [user, userLoading, userError] = useDocument(
      session?.user?.email
        ? doc(db, 'users', session.user.email,)
        : null
    );

    useEffect(() => {
      const username = user?.data()?.userName;
      if (!username) return;
      if (username){
        dispatch(setUsername(username));
      }
    }, [user, user?.data()?.userName]);
    

  return (
    
    <div className=" grid sm:grid-cols-2 md:grid-cols-5 grid-cols-6 gap-4 min-h-screen overflow-y-scroll p-12 text-white bg-purple-100"> 
    {storys?.docs.map(story => {
        const storyData = story.data();
        const mappedStory: Story = {
          id: story.id,
          image: storyData.image || '',
          baseImagePrompt: storyData.baseImagePrompt || '',
          title: storyData.title || '',
          baseImagePromptCreated: storyData.baseImagePromptCreated || false,
        };
      
        return <StoryThumbnail key={story.id} id={story.id} story={mappedStory} />;
    
      })}     

      <button
        className='w-68 h-48 rounded-lg bg-purple-500 hover:bg-purple-300 flex items-center justify-center text-2xl font-bold transition-colors duration-200'
        onClick={createNewStory}
      >
          Start a new story
      </button>
</div>


  )
}

export default HomePage
