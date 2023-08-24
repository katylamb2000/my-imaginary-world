'use client'

import Link from "next/link"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch, useSelector } from "react-redux" 
import { RootState } from "./GlobalRedux/store"
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import StoryThumbnail from '../components/StoryThumbnail'
import { addDoc, collection, serverTimestamp, doc } from "firebase/firestore"
import { db } from "../firebase"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import SideBar from "../components/SideBar"
import axios from "axios"
import { setUsername, setIsSubscriber } from "./GlobalRedux/Features/userDetailsSlice"
import { addCharacters } from "./GlobalRedux/Features/characterSlice"


interface Story {
  id: string,
  image: string,
  baseImagePrompt: string,
  title: string, 
  baseImagePromptCreated: Boolean,
}



function HomePage() {
    const [storyId, setStoryId] = useState<null | string>(null);
    const characters = useSelector((state: RootState) => state.characters.characters)
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const { data: session } = useSession()

    const [charactersSnapshot, characterLoading, characterError] = useCollection(
      session && collection(db, 'users', session?.user?.email!, 'characters'),
    );
    
    useEffect(() => {
      if (!charactersSnapshot) return;
    
      const derivedCharacters = charactersSnapshot.docs.map(doc => ({
        name: doc.data().name,
        description: `${doc.data().name} is a ${doc.data().age} year old ${doc.data().gender}. They have ${doc.data().hairColor} ${doc.data().hairStyle} hair, ${doc.data().eyeColor} eyes. They are wearing ${doc.data().clothing}. And they are of ${doc.data().skinColor}`,
      }));
      console.log(derivedCharacters)
      dispatch(addCharacters(derivedCharacters));
    }, [charactersSnapshot]);
    
    const createNewStory = async() => {
      const doc = await addDoc(collection(db, "users", session?.user?.email!, 'storys'), {
          userId: session?.user?.email!,
          createdAt: serverTimestamp(), 
          fullImagePrompt: null
      });
      if (characters.length){
        console.log('characters ==> ', characters)
        dispatch(setName('create story outline'))
        router.push(`/story/${doc.id}`)
      }
      else if (!characters.length){
        console.log('first we need to create a character. ')
      }
    }

    const createFirstCharacter = async() => {
       const doc = await addDoc(collection(db, "users", session?.user?.email!, 'characters'), {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(), 
        fullImagePrompt: null
    });
    router.push(`/character/${doc.id}`)
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
      console.log('checking if subscriber', user?.data())
      const username = user?.data()?.userName;
      const subscriber  = user?.data()?.subsciber
      if (!user) return;
      if (!username) return;
      if (username){
        dispatch(setUsername(username));
        }
      if (subscriber){
        dispatch(setIsSubscriber(subscriber))
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
    {characters.length == 0 ? (
          <button
          className='w-68 h-48 rounded-lg bg-purple-500 hover:bg-purple-300 flex items-center justify-center text-2xl font-bold transition-colors duration-200'
          onClick={createFirstCharacter}
        >
            Create your first character
        </button>
    ):
      <button
        className='w-68 h-48 rounded-lg bg-purple-500 hover:bg-purple-300 flex items-center justify-center text-2xl font-bold transition-colors duration-200'
        onClick={createNewStory}
      >
          Start a new story
      </button>
}
</div>


  )
}

export default HomePage
