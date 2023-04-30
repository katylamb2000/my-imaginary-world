'use client'

import SideBar from "../../../components/SideBar"
import MainCharacterFundamentalsForm from "../../../components/MainCharacterFundamentalsForm"
import CharacterProfilePage from "../../../components/CharacterProfilePage"
import CreateStoryOutline from "../../../components/CreateStoryOutline"
import AllCharacters from "../../../components/AllCharacters"
import ViewStoryPage from "../../../components/ViewStoryPage"
import EditPageBar from "../../../components/EditPageBar"
import Story from "../../../components/Story"
import { useSession } from 'next-auth/react'
import { usePathname } from "next/navigation"
import { addDoc, collection, serverTimestamp, updateDoc, doc, QueryDocumentSnapshot } from "firebase/firestore"
import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { RootState } from '../../../app/GlobalRedux/store';
import { useSelector } from "react-redux"
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios"
import CharacterScrollBar from "../../../components/CharacterScrollBar"

interface PageData {
  id: string;
  data: any; // Replace 'any' with the appropriate type for your page data
  imagePromptCreated: Boolean
}

interface Character {
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
  userId: string;
  id: string;
  heroImage: string;
  age: string
}

function StoryPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fullStory, setFullStory] = useState('')
  const [storyId, setStoryId] = useState<null | string>(null)
  const [heroCharacter, setHeroCharacter] = useState<null | any>(null)
  const [imagePrompts, setImagePrompts] = useState<any[]>([]);
  const [content, setContent] = useState<null | any>(null)
  const [sortedStoryContent, setSortedStoryContent] = useState<PageData[]>([]);
  const [storyContentId, setStoryContentId]= useState<null | string>(null)
  const [editStoryPage, setEditStoryPage] = useState(false)
  const [pagesProcessed, setPagesProcessed] = useState<string[]>([]);
  const pathname = usePathname()
  const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name);
  const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
  const selectedPageText = useSelector((state: RootState) =>  state.pageToEdit.text);
  const baseStoryImagePrompt = useSelector((state: RootState) => state.viewStory.baseStoryImagePrompt)
  const baseStoryImagePromptCreated = useSelector((state: RootState) => state.viewStory.baseStoryImagePromptCreated)
  const heroImage = useSelector((state: RootState) => state.viewCharacter.characterImage)
  const heroImagePrompt = useSelector((state: RootState) => state.viewCharacter.characterImagePrompt)

  const basePrompt = `I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called midjourney. The image should be for a children's book. 

  I will provide you with a the full story and then one specific section of the story and your job is to elaborate these into full, explicit, coherent prompts. prompts involve describing the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. 

  I will give you some examples of the style desired. I will also give you the character i want to use as the key actors in the scene. 
  
  Your focus needs to be on nouns and adjectives. Please define the exact camera that should be used. 
  
  Here is a formula template for you to use: 
  
  IMAGE_TYPE: Macro close-up | GENRE: Fantasy | EMOTION: Quirky | SCENE: A tiny fairy sitting on a mushroom in a magical forest, surrounded by glowing fireflies | ACTORS: Fairy | LOCATION TYPE: Magical forest | CAMERA MODEL: Fujifilm X-T4 | CAMERA LENSE: 100mm f/2.8 Macro | SPECIAL EFFECTS: Infrared photography | TAGS: macro, fantasy, whimsical, fairy, glowing fireflies, magical atmosphere, mushroom, enchanted forest — ar 16:9
  
`

const wholeStoryBasePrompt = `I want you to act as a prompt engineer. You will help me write a base prompt for an ai art generator called midjourney. The base prompt should be describing the style of the images for a children's book. 

I will provide you with a the full story and your job is to create a full, explicit, coherent prompt which i will use as the base for every image produced for this story. prompts involve describing the style of images in concise accurate language. It is useful to be explicit and use strong references to popular culture, artists and mediums so that the styling is consistent for every image produced using this base prompt. There should be very strong focus on the color pallette too.  


Your focus needs to be on nouns and adjectives. 

`

useEffect(() => {
  console.log('BSIP', baseStoryImagePrompt, baseStoryImagePromptCreated)
  
  if (baseStoryImagePromptCreated == false && baseStoryImagePrompt.length === 0 && sortedStoryContent && session){
    // console.log('i have to create a baseStoryIMage Prompt after I have created a story of course, and before i create all the other images. ', sortedStoryContent)
    createStoryBaseImagePrompt()
  }
}, [baseStoryImagePrompt, baseStoryImagePromptCreated, session])

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


  const [charactersSnapshot, characterLoading, characterError] = useCollection(
    session && collection(db, 'users', session?.user?.email!, 'characters'),
  )
  
  const characters: Character[] = charactersSnapshot?.docs.map(doc => ({
    ...doc.data(),
    buttonMessageId: doc.data().buttonMessageId,
    buttons: doc.data().buttons,
    clothing: doc.data().clothing,
    eyeColor: doc.data().eyeColor,
    gender: doc.data().gender,
    heroImage: doc.data().heroImage,
    hairColor: doc.data().hairColor,
    hairStyle: doc.data().hairStyle,
    imageChoices: doc.data().imageChoices,
    imagePrompt: doc.data().imagePrompt,
    name: doc.data().name,
    skinColor: doc.data().skinColor,
    userId: doc.data().userId,
    age: doc.data().age,
    id: doc.id,
})) ?? [];


  const [storyContent, storyContentloading, storyContenterror] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyContent') : null,
  );

  useEffect(() => {
    if (!storyContent) return;
    const sortedPages = storyContent.docs
    .map(doc => ({ 
      id: doc.id, 
      data: doc.data(),
      imagePromptCreated: doc.data().imagePromptCreated // Add this line
    }))
    .sort((a, b) => a.data.pageNumber - b.data.pageNumber);
  setSortedStoryContent(sortedPages);
  }, [storyContent]);

  useEffect(() => {
    const storyText = sortedStoryContent.reduce((text, page) => {
      return text + page.data.page;
    }, '');
    setFullStory(storyText)
  }, [sortedStoryContent])


  useEffect(() => {
    if (storyContent && baseStoryImagePromptCreated) {
      storyContent.docs.map((sc) => {
        console.log('this is a usefct that will create image prompt for all mapped content', sc)
        // createPageImagePrompt(sc);
      });
    }
  }, [storyContent]);

  const createStoryBaseImagePrompt = async () => {

    console.log('creating BASE!!!!!!')
    const storyBasePrompt = `${wholeStoryBasePrompt} - the full story is ${fullStory}. The hero character is ${heroCharacter}`
    console.log('storyBasePrompt', storyBasePrompt)
  
    try{
     const response = await fetch('/api/createStoryBaseImagePrompt', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: storyBasePrompt, 
          // model: 'text-davinci-003', 
          session,
          storyId: storyId, 
  
        }),
      });
      const data = await response.json();
      console.log(data)

    }catch(err){
      console.log(err)
    }
  }

  const createPageImagePrompt = async (sc: QueryDocumentSnapshot) => {
    const pageData: PageData = sc.data() as PageData;
  
    if (pageData.imagePromptCreated) return;
  
    const pageProcessing = pagesProcessed.find((pageId: string) => pageId === sc.id);
    if (pageProcessing) return;

    else if (sc.data().imagePromptCreated == false){
      setPagesProcessed(pagesProcessed => [...pagesProcessed, sc.id])
    // console.log('creating IP for', sc.id, sc.data().page)
    const pagePrompt = `${basePrompt} - the full story is ${fullStory}. The page I want you to generate an ai art generator prompt for is ${sc.data().page}. This is a childrens story book for a 4 year old girl. The media you should reference is disney and pixar. The hero character is ${heroCharacter}`
    // console.log('pagePrompt', pagePrompt)
    try{
     const response = await fetch('/api/createStoryImagePrompts', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: pagePrompt, 
          model: 'text-davinci-003', 
          session,
          storyId: storyId, 
          page: sc.id
        }),
      });
      const data = await response.json();
      console.log(data.answer)

    }catch(err){
      console.log(err)

    }
  }
  }

  const switchToEdit = () => {
    console.log("IN SWITCH", editStoryPage)
    setEditStoryPage(!editStoryPage)
  }

  useEffect(() => {
    if (selectedPageId == '') return;
    else if (selectedPageId !== ''){
      setEditStoryPage(true)
    }
  }, [selectedPageId])

  const updatePageText = async () => {
    console.log(selectedPageText, selectedPageId);
    if (!storyId || !selectedPageId) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", selectedPageId);
    const updatedPage = await updateDoc(docRef, {
      page: selectedPageText
    });
    console.log(updatedPage);
  };

  // const startAutomation = async () => {
  //     try {
  //       const response = await axios.post('/api/run_automation', {
  //         storyId: storyId
  //       });
  //       console.log('we are looking for AN response WHATSOEVER!', response.data);
  //     } catch (error) {
  //       console.error('Error starting automation:', error);
  //     }
  //   };

    const sendStoryIdToAdmin = async() => {
      console.log('this is the story id i want to send to admin!', storyId)
        setLoading(true)
        try{
         const doc = await addDoc(collection(db, "requestImagesForStory" ), {
            userId: session?.user?.email!,
            createdAt: serverTimestamp(), 
            storyId: storyId
        });
        sendSms()
      }catch(err){
        console.log(err)
      }
    }

    const sendSms = async () => {
      console.log('trying to send sms')
      const phoneNumber = '+447309693489'
      const message = 'you have a new request for images!'
  
      try {
        const response = await fetch("/api/sendSms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ toPhoneNumber: phoneNumber, message }),
        });
  
        if (response.ok) {
          console.log("SMS sent successfully!");
        } else {
          console.error("Error sending SMS");
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    };

  return (
    <div className="flex w-screen bg-gray-50">

      {editStoryPage ? (
        <EditPageBar switchToEdit={() => setEditStoryPage(!editStoryPage)} updatePageText={updatePageText}  />
      ):
        <SideBar  storyContent={storyContent} switchToEdit={switchToEdit} />
      }


    <div className='w-4/5 h-screen overflow-y-scroll'>
      {storyBuilderActive == 'add character' && (
          <MainCharacterFundamentalsForm />
      )}

      {storyBuilderActive == 'add hero' && (
         <MainCharacterFundamentalsForm  />
      )}

      {storyBuilderActive == 'hero' && (
         <CharacterProfilePage />
      )}

      {storyBuilderActive == 'view characters' && (
         <AllCharacters characters={characters} />
      )}

      {storyBuilderActive == 'add villain' && (
         <p>Add villain</p>
      )}


{storyBuilderActive == 'view story' && sortedStoryContent.map(page => (
  storyId ? (
    <ViewStoryPage
      page={page}
      key={page.id}
      imagePrompts={imagePrompts}

      storyId={storyId}
    />
  ) : null
))}

    {/* {storyBuilderActive == 'view story' && (
      <div className="w-full h-24 items-center justify-center flex space-x-4">
        <button 
          className="bg-pink-500 text-white p-4 rounded-lg hover:bg-pink-300"
          onClick={startAutomation}
        >
          get midjourney images
        </button>
        <button 
          className="bg-pink-500 text-white p-4 rounded-lg  hover:bg-pink-300"
          onClick={sendStoryIdToAdmin}
        >
          request images from admin
        </button>
      </div>
    )} */}

      {storyBuilderActive == 'create story outline' && (
        <CharacterScrollBar characters={characters} />
      )}

      {storyBuilderActive == 'create story outline' && (
         <CreateStoryOutline characters={characters} />
      )}

      </div>

    </div>
  )
}

export default StoryPage
