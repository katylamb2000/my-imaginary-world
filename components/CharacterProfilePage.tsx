'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { db } from '../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { usePathname } from 'next/navigation'

type Props = {
  hero: any;
  storyContent: any;
}

function CharacterProfilePage({ hero }: Props) {
    const [myHero, setMyHero] = useState<null | any>(null)
    const [storyId, setStoryId] = useState<null | string>(null)
    const [heroId, setHeroId] = useState<null | string>(null)
    const { data: session } = useSession()
    const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return;
    const regex = /^\/story\/([a-zA-Z0-9]+)$/;
    const id = regex.exec(pathname);
  
    if (id) {
      const identifier = id[1];
      setStoryId(identifier);  
    } else {
      console.log("No match");
    }
  }, [pathname])

  useEffect(() => {
    console.log('the chosen one', hero?.docs[0]?.data())
    if (hero?.docs[0]?.data()){
      console.log('got a hero', hero?.docs[0]?.data())
      setMyHero(hero?.docs[0]?.data())
      setHeroId(hero?.docs[0]?.id)
    }
    else{
      console.log('no hero')
    }
  
  }, [hero])

  const generateCharacterImage = async () => {

    if (session && storyId) {
      const requestsRef = collection(db, 'requests');
      console.log(requestsRef)
      const doc = await addDoc(requestsRef, {
        userId: session?.user?.email,
        storyId: storyId,
        createdAt: serverTimestamp(),
        typeOfRequest: 'Character image',
        character: myHero,
        characterId: heroId
      });

      console.log(doc)
    } else {
      console.log('no session')
    }
  }

  const handleGenerateCharacterImage = () => {
    generateCharacterImage();
  }

  return (
    <div className='mx-auto my-6 bg-white rounded-lg border border-gray-100 w-4/5 h-4/5 grid grid-cols-4'>
      <div className="col-span-1 mx-auto text-center justify-center align-middle"> 
      {myHero?.image ? (
        <img src={myHero.image}                       
          className="h-48 w-48 rounded-full cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4 border border-purple-500"
        />
      ):
      <img src={`https://ui-avatars.com/api/?name=${myHero?.name}`}                       
        className="h-48 w-48 rounded-full cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4"
       />
      }
      <p>{myHero?.name}</p>
      </div>
      <div className="col-span-3"> 
          <div className='mx-auto p-6 space-y-2'>
            <p>{myHero?.age}</p>
            <p>{myHero?.gender}</p>
            <p>{myHero?.hairColor}</p>
            <p>{myHero?.hairStyle}</p>
            <p>{myHero?.eyeColor}</p>
            <p>{myHero?.skinColor}</p>
            <p>{myHero?.clothing}</p>
          </div>
    
          <div className='w-full '>
            {!myHero?.image && (
            <button 
                onClick={handleGenerateCharacterImage}
                className='bg-purple-400 p-4 mx-auto text-white rounded-lg cursor-pointer hover:opacity-50 hover:shadow-xl'>
                  generate character image
            </button>
                )}
          </div>
      </div>
    </div>
  )
}

export default CharacterProfilePage