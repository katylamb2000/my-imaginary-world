'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { db } from '../firebase'
import { addDoc, collection, serverTimestamp, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { RootState } from '../app/GlobalRedux/store'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import axios from 'axios'

type Props = {
  hero: any;
  // storyContent: any;
}

function CharacterProfilePage() {
    const [myHero, setMyHero] = useState<null | any>(null)
    const [characterProfile, setCharacterProfile] = useState<null | any>(null)
    const [messageId, setMessageId] = useState<null | string>(null)
    const [seed, setSeed] = useState<null | string>(null)
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
    }, [characterId, messageId]);

    const getCharacter = () => {
      if (!session || !session.user || !session.user.email || !characterId) {
        return;
      }
      try {
        const docRef = doc(collection(db, "users", session!.user?.email, "characters"), characterId);
        // Listen for real-time updates
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
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
      if (!messageId) return;
    
      const updateCharacter = async () => {
        try {
          const docRef = doc(db, "users", session?.user?.email!, "characters", characterId);
          const updatedCharacter = await updateDoc(docRef, {
            messageId: messageId
          });
        } catch (err) {
          console.log(err);
        }
      };
    
      updateCharacter();
    }, [messageId]);

    useEffect(() => {
      if (!seed) return;
    
      const updateCharacterSeed = async () => {
        try {
          const docRef = doc(db, "users", session?.user?.email!, "characters", characterId);
          const updatedCharacter = await updateDoc(docRef, {
            seed: seed
          });
        } catch (err) {
          console.log(err);
        }
      };
    
      updateCharacterSeed();
    }, [seed]);
    
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

  const upscaleChosenImage = async(btn: string) => {

var data = JSON.stringify({
  button: btn,
  buttonMessageId: characterProfile.buttonMessageId,
  ref: { storyId: storyId, userId: session!.user!.email, action: 'upscaleCharacter', heroId: characterId },
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
  setMessageId(response.data.messageId)
})
.catch(function (error) {
  console.log(error);
}); 
}

  const getHeroSeed = async() => {
    if (!characterProfile.messageId) return;
    var data = JSON.stringify({
      ref: { storyId: storyId, userId: session!.user!.email, action: 'seed', heroId: characterId },
      webhookOverride: ""
    });
    var config = {
      method: 'get',
      url: `https://api.thenextleg.io/v2/seed/${characterProfile.messageId}`,
      headers: { 
        'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      setSeed(response.data.seed)
    })
    .catch(function (error) {
      console.log(error);
    }); 
    
  }



  const generateCharacterImage = async () => {

    if (session && storyId) {
      const requestsRef = collection(db, 'requests');
      const doc = await addDoc(requestsRef, {
        userId: session?.user?.email,
        storyId: storyId,
        createdAt: serverTimestamp(),
        typeOfRequest: 'Character image',
        character: myHero,
        characterId: heroId
      });
    } else {
      console.log('no session')
    }
  }

  return (
    <div className='mx-auto my-6 bg-white rounded-lg border border-gray-100 w-4/5 h-4/5 grid grid-cols-4'>
      <div className="col-span-1 mx-auto text-center justify-center align-middle"> 
        {characterProfile?.imageChoices && !characterProfile.heroImage ? (
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
                onClick={getHeroSeed}
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