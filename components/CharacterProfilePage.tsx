'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { db } from '../firebase'
import { addDoc, collection, serverTimestamp, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { RootState } from '../app/GlobalRedux/store'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import axios from 'axios'

type Props = {
  hero: any;
  storyContent: any;
}

function CharacterProfilePage({ hero }: Props) {
    const [myHero, setMyHero] = useState<null | any>(null)
    const [characterProfile, setCharacterProfile] = useState<null | any>(null)
    const [buttons, setButtons] = useState([])
    const [storyId, setStoryId] = useState<null | string>(null)
    const [heroId, setHeroId] = useState<null | string>(null)
    const { data: session } = useSession()
    const pathname = usePathname()
    const characterId = useSelector((state: RootState) => state.viewCharacter.characterId);

    useEffect(() => {
      if (!characterId.length) return;
      if (characterId.length && !characterProfile)
      console.log(characterId)
      
      // Save the cleanup function returned by getCharacter
      const cleanup = getCharacter();
    
      // Call the cleanup function when the component is unmounted
      return () => {
        if (cleanup) cleanup();
      };
    }, [characterId]);


    const getCharacter = () => {
      if (!session || !session.user || !session.user.email || !characterId) {
        console.error("Session, user email, or characterId is missing");
        return;
      }
      try {
        const docRef = doc(collection(db, "users", session!.user?.email, "characters"), characterId);
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            console.log("This is the character:", docSnap.data());
            setCharacterProfile(docSnap.data());
          } else {
            console.log("No such document!");
          }
        });
    
        // Clean up the listener when the component is unmounted
        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.log(err);
      }
    };
    


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
      if (!myHero) return;
      if (!myHero.buttons) return;
      setButtons(myHero.buttons)
  }, [myHero])

  

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

  const upscaleChosenImage = async(btn: string) => {
    console.log(btn)
    try {
      const data = {
        button: btn,
        buttonMessageId: myHero.buttonMessageId,
        ref: JSON.stringify({ storyId: storyId, userId: session!.user!.email , action: 'upscaleCharacter', heroId: heroId }),
        webhookOverride: ''
      };
  
      const config = {
        method: 'post',
        url: 'https://api.thenextleg.io/api',
        headers: {
          Authorization: `Bearer ${process.env.next_leg_api_token}`,
          'Content-Type': 'application/json'
        },
        data: data,
      };
  
      const response = await axios(config);
      console.log(JSON.stringify(response.data));
      // getHeroSeed()
    } catch (error) {
      console.log(error);
    }
  }


  const getHeroSeed = async() => {
    try {
      const data = {
        buttonMessageId: myHero.buttonMessageId,
        reaction: "✉️",
        ref: JSON.stringify({ storyId: storyId, userId: session!.user!.email , heroId: heroId, action: 'seed' }),
      };
      console.log('this is data', data)
  
      const config = {
        method: 'post',
        url: 'https://api.thenextleg.io/api',
        headers: {
          Authorization: `Bearer ${process.env.next_leg_api_token}`,
          'Content-Type': 'application/json'
        },
        data: data,
      };
  
      const response = await axios(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }

const huntingForSeed = async() => {

const data = JSON.stringify({
  "reaction": "✉️",
  "buttonMessageId": myHero.buttonMessageId,
   ref: JSON.stringify({ storyId: storyId, userId: session!.user!.email , heroId: heroId, action: 'seed' }),
});

const config = {
  method: 'post',
  url: 'https://api.thenextleg.io/api',
  headers: {
    'Authorization': `Bearer ${process.env.next_leg_api_token}`,
    'Content-Type': 'application/json'
  },
  data: data
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}


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

  return (
    <div className='mx-auto my-6 bg-white rounded-lg border border-gray-100 w-4/5 h-4/5 grid grid-cols-4'>
      <div className="col-span-1 mx-auto text-center justify-center align-middle"> 
      

        {characterProfile?.imageChoices ? (

 
        <img src={characterProfile.imageChoices}                       
          className="h-48 w-48  cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4 "
        />
      ):
      <img src={`https://ui-avatars.com/api/?name=${characterProfile?.name}`}                       
        className="h-48 w-48 rounded-full cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4"
       />
      }

      {characterProfile?.heroImage && (
           <img src={characterProfile.heroImage}                       
           className="h-48 w-48  cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4 "
         />
      )}

      {characterProfile?.buttons?.length > 0 && characterProfile?.imageChoices && (
        <div className='flex space-x-4'>
          {characterProfile.buttons.map((btn: string) => (
            <button onClick={() => upscaleChosenImage(btn)}>{btn}</button>
          )
        )}
      </div>
      ) }

      <p>{characterProfile?.name}</p>
      </div>
      <div className="col-span-3"> 
          <div className='mx-auto p-6 space-y-2'>
            <p>{characterProfile?.age}</p>
            <p>{characterProfile?.gender}</p>
            <p>{characterProfile?.hairColor}</p>
            <p>{characterProfile?.hairStyle}</p>
            <p>{characterProfile?.eyeColor}</p>
            <p>{characterProfile?.skinColor}</p>
            <p>{characterProfile?.clothing}</p>
          </div>
    
          <div className='w-full '>
            {!characterProfile?.image && (
            <button 
                onClick={huntingForSeed}
                className='bg-purple-400 p-4 mx-auto text-white rounded-lg cursor-pointer hover:opacity-50 hover:shadow-xl'>
                  generate character seed
            </button>
                )}
      {characterProfile?.buttons?.length > 0 && characterProfile?.heroImage && (
        <div className='flex space-x-4'>
          {buttons.map(btn => (
            <button onClick={() => upscaleChosenImage(btn)}>{btn}</button>
          )
        )}
      </div>
      ) }
          </div>
      </div>
    </div>
  )
}

export default CharacterProfilePage