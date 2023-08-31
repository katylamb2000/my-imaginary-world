'use client'
import { useState, FormEvent, useEffect, CSSProperties } from 'react';
import { useCollection } from "react-firebase-hooks/firestore"
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from "next/navigation";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useSession } from 'next-auth/react'
import { addDoc, collection, serverTimestamp,  query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase'
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import SyncLoader from "react-spinners/SyncLoader";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setCharacterImage, setCharacterImagePrompt } from '../app/GlobalRedux/Features/viewCharacterSlice';
// import { toast } from "react-hot-toast";

type SetBookInfo = (info: any) => void;

export interface Character {
  buttonMessageId: string;
  buttons: Array<any>;
  clothing: string;
  eyeColor: string;
  gender: string;
  hairColor: string;
  hairStyle: string;
  imageChoices: string;
  imagePrompt: string;
  name: string;
  skinColor: string;
  age: string;
  userId: string;
  id: string;
  heroImage: string;
  seed: string;
}

type Props = {
    characters: Character[] 
};

type Prompt = {
  prompt: string;
  createdAt: ReturnType<typeof serverTimestamp>;
  user?: { name: string; email: string; image: string };
};

function CreateStoryOutline({ characters  }: Props) {
  // const [storyContent, setStoryContent] = useState<null | string>(null)
  const [title, setTitle] = useState<null | string>(null)
  const [heroCharacterId, setHeroCharacterId] = useState<null | string>(null)
  const [heroCharacter, setHeroCharacter] = useState<null | Character>(null)
  const [allHeros, setAllHeros] = useState([])
  const [secondaryHeros, setSecondaryHeros] = useState([])
  const [childsName, setChildsName] = useState('');
  const [setting, setSetting] = useState('')
  const [favouriteThings, setFavouriteThings] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [genre, setGenre] = useState('')
  const [style, setStyle] = useState('')
  const [characterDescription, setCharacterDescription] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [storyId, setStoryId] = useState<null | string>(null)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  let [color, setColor] = useState("#ffffff");
//   const story = useSelector((state: RootState) => state.story.story)
//   const storyID = useSelector((state: RootState) =>  state.story.storyID);
  const model = 'text-davinci-003';

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  useEffect(() => {
      if (!heroCharacter) return;
      if (heroCharacter == null){
        setHeroDescription('create your own hero character')
    }
    else {
      const description = `a ${heroCharacter.age} years old ${heroCharacter.gender} called ${heroCharacter.name}. They have ${heroCharacter.hairColor} ${heroCharacter.hairStyle} hair, ${heroCharacter.eyeColor} eyes. They are wearing ${heroCharacter.clothing}. And they are of ${heroCharacter.skinColor}`
      console.log(description)
      setHeroDescription(description)
    }
  }, [heroCharacter])

  useEffect(() => {
    if (heroCharacterId && characters) {
      const selectedCharacter = characters.find((character: Character) => character.id === heroCharacterId);
      if (selectedCharacter) {
        dispatch(setCharacterImage(selectedCharacter.heroImage));
        dispatch(setCharacterImagePrompt(selectedCharacter.imagePrompt));
        setHeroCharacter(selectedCharacter)
        console.log(selectedCharacter)
      }
    }
  }, [heroCharacterId, characters]);

  const [storyContent, storyContentloading, storyContenterror] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyContent') : null,
  );

  useEffect(() => {
    if (!storyContent) return;
    if (!storyContent.docs) return;
    if (!storyContent.docChanges.length)return;
      else if (storyContent.docChanges.length){
        dispatch(setName('view story'))
      }
  }, [storyContent])
  
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

const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('story outline ==> ', 'readersAge:', age, 'setting', setting, 'things to include', favouriteThings, 'storyStyle', genre, 'style', style, 'heroCharacter', heroDescription )
    setLoading(true)
    try{
    const outline = await addDoc(collection(db, 'users', session?.user?.email!, 'storys', storyId!, 'storyOutline'),
        {
            readersAge: age,
            setting: setting,
            thingsToInclude: favouriteThings,
            storyStyle: genre,
            style: style,
            heroCharacter: heroDescription
        }
    )
    console.log(outline)
    createStory()
      }catch(err){
        console.log(err)
        setLoading(false)
   
      }
    }
    const createStory = async() => {
      const notification = toast.loading('Hang tight! Your story is being written!')

        try{

          const storyPrompt = `Create a 14 page adventurous and humorous ${genre} story that will captivate a ${age} years old child. The story should embody the whimsical nature of ${style}, be set in the fantastic world of ${setting}, and incorporate ${favouriteThings} as key elements to generate fun and laughter.

          Our hero is ${heroDescription} - a character with a quirky twist that makes them unique and entertaining.

          The story must be structured into exactly 14 pages and a title page. The structure should be as follows:

          Title: 

          Page 1: 

          Page 2: 

          etc
          `;
        const response = await fetch('/api/createStory', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: storyPrompt, 
            session: session,
            storyId: storyId, 
        }),
    })
console.log('response from api', response)
if (response.status == 200) {
  console.log("send api request to get character descriptions. ")
}
    setLoading(false)
    toast.success('Your story has been created', {
            id: notification
        })
if (response)
console.log('RESPONSE', response)
setLoading(false)

dispatch(setName('view story'))
// getImagePrompts()
}catch(err){
  toast.error('FAIL', {
    id: notification
})
  toast.dismiss()
    setLoading(false)
    console.log(err)
  }
}

const getImagePrompts = async() => {
    const imagePromptsPrompt = `create 14 ai art generator promps for this story: ${storyContent?.docs}. The story is for a ${age} year old ${gender}. Once you select the style of the image this should be explicity mentioned on the prompt for each page. Once you have decided how to describe the character  the character hey should all have the same style and characters throughout.
    Your response should be structured in this way
    Title: {{title}}
    
    Page 1:
    {{page1 image prompt}}
  
    Page 2:
    {{page2 image prompt}}
   
    Page 3:
    {{page3 image prompt}}
  
    Page 4:
    {{page4 image prompt}}
  
    Page 5:
    {{page5 image prompt}}
  
    Page 6:
    {{page6 image prompt}}
  
    Page 7:
    {{page7 image prompt}}
  
    Page 8:
    {{page8 image prompt}}
  
    Page 9:
    {{page9 image prompt}}
  
    Page 10:
    {{page10 image prompt}}   `
        
            try{
              setLoading(true)
             const response = await fetch('/api/createStoryImagePrompts', {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  prompt: imagePromptsPrompt, 
                  model: 'text-davinci-003', 
                  session,
                  storyId: storyId
                }),
              });
              const data = await response.json();
              console.log('this is the story, need to save title to story', data.answer)
              setLoading(false)
              dispatch(setName('view story'))
  }catch(err){
    console.log(err)
  }
}

useEffect(() => {
  if (!title) return;
  // updateStoryTitle()
}, [title])


  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 min-h-screen flex items-center justify-center px-4">
    {/* {
    storyContent &&
    storyContent!.docs.length > 0 ? (
      <div className='bg-white rounded-lg p-4 border border-gray-100'>
        <p className='p-4'>Got a  STORY</p>
      </div>
          ):  */}

    <div className="max-w-md w-full space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white text-center">
          Create your story
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">

    <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
            Reader's age
            </label>
            <input
              id="age"
              type="text"
              autoComplete="age"
              // required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Reader's age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>
        

        <select
            className="appearance-none rounded-none relative block w-full px-3 py-2 mt-1 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm border-gray-300"
            onChange={(e) => setHeroCharacterId(e.target.value)}
          >
            <option value="">Select a hero character</option>
            {characters && characters.map((character: Character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>

        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
              Setting
            </label>
            <input
              id="setting"
              type="text"
              autoComplete="setting"
              // required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Describe the setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
            favourite Things
            </label>
            <input
              id="favouriteThings"
              type="text"
              autoComplete="favouriteThings"
              // required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Things you want to be included in the story"
              value={favouriteThings}
              onChange={(e) => setFavouriteThings(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
            Story style
            </label>
            <input
              id="style"
              type="text"
              autoComplete="style"
              // required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Are there any books, authors, TV shows whose style you like? "
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
            Story genre
            </label>
            <input
              id="genre"
              type="text"
              autoComplete="genre"
              // required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="What genre do you want the story to be? "
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
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
                   'Create your story'
      }
              </button>
            </div>
            </form>

          </div>
{/* } */}

        </div>
        
  )
}

export default CreateStoryOutline
