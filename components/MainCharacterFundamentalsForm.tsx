'use client'
import { useState, FormEvent, useEffect, CSSProperties } from 'react';
import Image from 'next/image';
import { HandRaisedIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp, doc  } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { db } from '../firebase'
import SyncLoader from "react-spinners/SyncLoader";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setCharacterId } from '../app/GlobalRedux/Features/viewCharacterSlice'

interface ImageOption {
  uri: string;
  id: string;
}

function MainCharacterFundamentalsForm() {
  const [loading, setLoading] = useState(false)
  const [storyId, setStoryId] = useState<null | string>(null); 
  const [characterName, setCharacterName] = useState('');
  const [setting, setSetting] = useState('')
  const [favouriteThings, setFavouriteThings] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [hairColor, setHairColor] = useState('')
  const [hairStyle, setHairStyle] = useState('')
  const [eyeColor, setEyeColor] = useState('')
  const [skinColor, setSkinColor] = useState('')
  const [clothing, setClothing] = useState('')
  const [imageOptions, setImageOptions] = useState<ImageOption[]>([]);
  const [characterDescription, setCharacterDescription] = useState('')
  const [heroCharacterId, setHeroCharacterId] = useState<null | string>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const dispatch = useDispatch()
  let [color, setColor] = useState("#ffffff");

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const prompts = [
    "a happy pose with a big smile",
    "a sad pose with tears in their eyes",
    "a surprised pose with raised eyebrows and an open mouth",
    "an angry pose with a scowl and clenched fists",
    "a neutral pose with a straight face and relaxed posture"
  ];

  useEffect(() => {
    if (!pathname) return;
    const regex = /^\/story\/([a-zA-Z0-9]+)$/;
    const id = regex.exec(pathname);
  
    if (id) {
      const identifier = id[1];
      setStoryId(identifier);  // Output: 4Hs1V2g0rDZeEut6piJj
    } else {
      console.log("No match");
    }
  }, [pathname])



const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  createNewCharacter()
};


const createNewCharacter = async() => {
  setLoading(true)
  try{
   const doc = await addDoc(collection(db, "users", session?.user?.email!, 'characters' ), {
      userId: session?.user?.email!,
      createdAt: serverTimestamp(), 
      name: characterName, 
      gender: gender,
      hairColor: hairColor, 
      hairStyle: hairStyle,
      eyeColor: eyeColor, 
      skinColor: skinColor, 
      clothing: clothing,
      age: age

  });
  setHeroCharacterId(doc.id)
  console.log('this is the hero id', doc.id)
  dispatch(setCharacterId(doc.id))

}catch(err){
  console.log(err)
}}

useEffect(() => {
  if (!heroCharacterId) return;
  generateCharacter()
}, [heroCharacterId])

// const generateCharacter = async() => {
//   const prompt = `style cartoon ${age} year old ${gender} in ${clothing}, with ${hairColor} ${hairStyle} hair and ${eyeColor} eyes, ethincity ${skinColor} in the style of realistic figures, 2d game art, tim shumate, rounded, alex hirsch, hispanicore, wide angle, whole body, highly detailed face, happy expression, white background -- v5`

// var data = JSON.stringify({
//   cmd: "imagine",
//   msg: prompt,
//   ref: { storyId: storyId, userId: session!.user!.email, action: 'createHero', heroId: heroCharacterId },
//   webhookOverride: ""
// });

// var config = {
//   method: 'post',
//   url: 'https://api.thenextleg.io/api',
//   headers: { 
//     'Authorization': `Bearer ${process.env.next_leg_api_token}`,  
//     'Content-Type': 'application/json'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });
// }             


const generateCharacter = async() => {
  const prompt = `style cartoon ${age} year old ${gender} in ${clothing}, with ${hairColor} ${hairStyle} hair and ${eyeColor} eyes, ethincity ${skinColor} in the style of realistic figures, 2d game art, tim shumate, rounded, alex hirsch, hispanicore, wide angle, whole body, highly detailed face, happy expression, white background -- v5`
  console.log(prompt)
  var data = JSON.stringify({
    msg: prompt,
    ref: { storyId: storyId, userId: session!.user!.email, action: 'createHero', heroId: heroCharacterId },
    webhookOverride: ""
  });
  
  var config = {
    method: 'post',
    url: 'https://api.thenextleg.io/v2/imagine',
    headers: { 
      'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    if (response.data.success === true){ 
      dispatch(setName("hero"));
      dispatch(setCharacterId(heroCharacterId));
    }
    else{ 
      console.log('not going to prograss!')
      setLoading(false)
    }
  })
  .catch(function (error) {
    console.log(error);
    setLoading(false)
  });
}

const getProgress = async(messageId: string) => {
  console.log('getting progress for', messageId)
  var config = {
    method: 'get',
    url: `https://api.thenextleg.io/v2/message/${messageId}`,
    headers: { 
      'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
      'Content-Type': 'application/json'
    },
 
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  
}

return (
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 min-h-screen flex items-center justify-center px-4">
    {imageOptions.length == 0 ? (

  
  <div className="max-w-md w-full space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-white text-center">
        Create your hero
      </h1>
    </div>
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="childsName"
            type="text"
            autoComplete="childsName"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Gender
          </label>
          <input
            id="gender"
            type="text"
            autoComplete="age"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Age
          </label>
          <input
            id="age"
            type="text"
            autoComplete="age"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Hair color
          </label>
          <input
            id="haircolor"
            type="text"
            autoComplete="haircolor"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Hair color"
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Hair style
          </label>
          <input
            id="hairstyle"
            type="text"
            autoComplete="hairstyle"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Hair style"
            value={hairStyle}
            onChange={(e) => setHairStyle(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Eye color
          </label>
          <input
            id="eyecolor"
            type="text"
            autoComplete="eyecolor"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Eye color"
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Clothing
          </label>
          <input
            id="clothing"
            type="text"
            autoComplete="clothing"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Clothing"
            value={clothing}
            onChange={(e) => setClothing(e.target.value)}
          />
        </div>
      </div>


      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            Skin color
          </label>
          <input
            id="age"
            type="text"
            autoComplete="age"
            // required
            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Skin color"
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <LockClosedIcon className='h-4 w-4' />
                </span>
                {loading ?    
                <SyncLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                   : 
                   'Create your hero'
      }
              </button>
              {/* <button onClick={generateCharacter}> generate image of character</button> */}
            </div>
          </form>
        </div>
          ): 
            <div className='grid grid-cols-2 w-3/5 space-4'> 
            {imageOptions.map(image => (
              <img src={image?.uri} key={image?.id} className='h-96 w-96 ' />
             ))}
            </div>
          }
      </div>
)}
export default MainCharacterFundamentalsForm