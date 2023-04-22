'use client'

import SideBar from "../../../components/SideBar"
import MainCharacterFundamentalsForm from "../../../components/MainCharacterFundamentalsForm"
import CharacterProfilePage from "../../../components/CharacterProfilePage"
import CreateStoryOutline from "../../../components/CreateStoryOutline"
import ViewStoryPage from "../../../components/ViewStoryPage"
import EditPageBar from "../../../components/EditPageBar"
import Story from "../../../components/Story"
import { useSession } from 'next-auth/react'
import { usePathname } from "next/navigation"
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { RootState } from '../../../app/GlobalRedux/store';
import { useSelector } from "react-redux"
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios"

interface PageData {
  id: string;
  data: any; // Replace 'any' with the appropriate type for your page data
}

function StoryPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fullStory, setFullStory] = useState('')
  const [storyId, setStoryId] = useState<null | string>(null)
  const [heroCharacter, setHeroCharacter] = useState<null | any>(null)
  const [imagePrompts, setImagePrompts] = useState<null | []>(null)
  const [content, setContent] = useState<null | any>(null)
  const [sortedStoryContent, setSortedStoryContent] = useState<PageData[]>([]);
  const [storyContentId, setStoryContentId]= useState<null | string>(null)
  const [editStoryPage, setEditStoryPage] = useState(false)
  const pathname = usePathname()
  const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name);
  const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
  const selectedPageText = useSelector((state: RootState) =>  state.pageToEdit.text);

  const basePrompt = `I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called midjourney. 

  I will provide you with a the full story and then one specific section of the story and your job is to elaborate these into full, explicit, coherent prompts. prompts involve describing the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. 

  I will give you some examples of the style desired. 
  
  Your focus needs to be on nouns and adjectives. Please define the exact camera that should be used. 
  
  Here is a formula for you to use: 
  
  IMAGE_TYPE: Macro close-up | GENRE: Fantasy | EMOTION: Quirky | SCENE: A tiny fairy sitting on a mushroom in a magical forest, surrounded by glowing fireflies | ACTORS: Fairy | LOCATION TYPE: Magical forest | CAMERA MODEL: Fujifilm X-T4 | CAMERA LENSE: 100mm f/2.8 Macro | SPECIAL EFFECTS: Infrared photography | TAGS: macro, fantasy, whimsical, fairy, glowing fireflies, magical atmosphere, mushroom, enchanted forest — ar 16:9
  
  
  
`
// (content insert nouns here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting: reference the lighting here)(colors: reference colors, styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here) 
  
//    when giving a prompt remove the brackets, speak in natural language and be more specific, use precise articulate language. 
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

  const createHero = async() => {
    if (!storyId) return;
    const doc = await addDoc(collection(db, "users", session?.user?.email!, 'storys', storyId!, 'hero'), {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(), 
        name: 'name',
        age: 'age'

    });
  }

  const [hero, heroloading, heroerror] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'hero') : null,
  );

  const [storyContent, storyContentloading, storyContenterror] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyContent') : null,
  );

  useEffect(() => {
    if (!hero) return;
    if (hero?.docs[0]?.data()){
      setHeroCharacter(hero?.docs[0].data())
    }
  }, [hero])

  useEffect(() => {
    if (!storyContent) return;

    storyContent.docs.map(sc => {
      if (sc.data().imagePrompt )return;
      else {
        createStoryImagePrompt(sc)
      }

    })
    // console.log('STORY CONTENT CHECKING FOR IMAGE Prompts ~~~>', storyContent)

  }, [storyContent])

  useEffect(() => {
    if (!storyContent) return;
    const sortedPages = storyContent.docs
      .map(doc => ({ id: doc.id, data: doc.data() }))
      .sort((a, b) => a.data.pageNumber - b.data.pageNumber);
    setSortedStoryContent(sortedPages);
  }, [storyContent]);

  useEffect(() => {
    const storyText = sortedStoryContent.reduce((text, page) => {
      return text + page.data.page;
    }, '');
    setFullStory(storyText)
  }, [sortedStoryContent])


  const createStoryImagePrompt = async(page: PageData) => {
    console.log('creating IP for', page.data.page)
    const pagePrompt = `${basePrompt} - the full story is ${fullStory}. The page I want you to generate an ai art generator prompt for is ${page.data().page}. This is a childrens story book for a 4 year old girl. The media you should reference is disney and pixar. `
    
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
          page: page.id
        }),
      });
      const data = await response.json();
      console.log(data.answer)

    }catch(err){
      console.log(err)
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

  const startAutomation = async () => {
      try {
        const response = await axios.post('/api/run_automation', {
          storyId: storyId
        });
        console.log('we are looking for AN response WHATSOEVER!', response.data);
      } catch (error) {
        console.error('Error starting automation:', error);
      }
    };

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
        <SideBar hero={hero} storyContent={storyContent} switchToEdit={switchToEdit} />
      }


    <div className='w-4/5 h-screen overflow-y-scroll'>
      {storyBuilderActive == 'add character' && (
          <MainCharacterFundamentalsForm />
      )}

      {storyBuilderActive == 'add hero' && (
         <MainCharacterFundamentalsForm />
      )}

      {storyBuilderActive == 'hero' && (
         <CharacterProfilePage hero={hero} storyContent={storyContent} />
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
      // createStoryImagePrompt={() => createStoryImagePrompt(page)}
      storyId={storyId}
    />
  ) : null
))}

    {storyBuilderActive == 'view story' && (
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
    )}

      {storyBuilderActive == 'create story outline' && (
         <CreateStoryOutline  hero={heroCharacter} />
      )}

      </div>

    </div>
  )
}

export default StoryPage
