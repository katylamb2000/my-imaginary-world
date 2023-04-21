'use client'

import Link from "next/link"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import StoryThumbnail from '../components/StoryThumbnail'
import { addDoc, collection, serverTimestamp, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import SideBar from "../components/SideBar"
import axios from "axios"

function HomePage() {
    const [storyId, setStoryId] = useState<null | string>(null);
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()


    const createNewStory = async() => {
      const doc = await addDoc(collection(db, "users", session?.user?.email!, 'storys'), {
          userId: session?.user?.email!,
          createdAt: serverTimestamp() 
      });
      router.push(`/story/${doc.id}`)
    }

    const [storys, loading, error] = useCollection(
      session && collection(db, 'users', session?.user?.email!, 'storys'),
    )

    // const startAutomation = async () => {
    //   try {
    //     const response = await axios.post('/api/run_automation');
    //     console.log('we are looking for AN response WHATSOEVER!', response.data);
    //   } catch (error) {
    //     console.error('Error starting automation:', error);
    //   }
    // };


  return (
    
  
    <div className="bg-purple-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-screen overflow-y-scroll justify-center py-12 px-4 mx-auto text-white text-center flex-col w-full"> 
        {storys?.docs.map(story => (

          <StoryThumbnail key={story.id} id={story.id} story={story}  />
        ))}     

            {/* <Link href="/createMainCharacter">
            <p className="text-xl font-medium text-pink-600 hover:text-purple-900">
               Get started
            </p>
          </Link>  */}

          <button
            className='w-48 h-48 rounded-lg bg-pink-600 text-center items-center justify-center align-center'
            onClick={createNewStory}
          >
              Start a new story
          </button>  

          {/* <button
            className='w-48 h-48 rounded-lg bg-pink-600 text-center items-center justify-center align-center'
            onClick={startAutomation}
          >
              Start automation
          </button>   */}
    </div>

  )
}

export default HomePage