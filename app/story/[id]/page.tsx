'use client'

import SideBar from "../../../components/SideBar"
import MainCharacterFundamentalsForm from "../../../components/MainCharacterFundamentalsForm"
import CharacterProfilePage from "../../../components/CharacterProfilePage"
import CreateStoryOutline, { Character } from '../../../components/CreateStoryOutline';
import AllCharacters from "../../../components/AllCharacters"
import ViewStoryPage from "../../../components/ViewStoryPage"
import EditPageBar from "../../../components/EditPageBar"
import Story from "../../../components/Story"
import { useSession } from 'next-auth/react'
import { usePathname } from "next/navigation"
import { addDoc, collection, serverTimestamp, updateDoc, doc, QueryDocumentSnapshot } from "firebase/firestore"
import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { RootState } from '../../../app/GlobalRedux/store';
import { useSelector, useDispatch } from "react-redux"
import { setBaseStoryImagePromptCreated } from "../../GlobalRedux/Features/viewStorySlice"
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios"
import CharacterScrollBar from "../../../components/CharacterScrollBar"

interface PageData {
  id: string;
  data: any; // Replace 'any' with the appropriate type for your page data
  // baseImagePromptCreated: Boolean
  // imagePromptCreated: boolean
}

function StoryPage() {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [storyBaseImagePrompt, setStoryBaseImagePrompt] = useState<null | string>(null)
  const [gettingBasePrompt, setGettingBasePrompt] = useState(false)
  const [docId, setDocId] = useState<null | string>(null)
  const [fullStory, setFullStory] = useState('')
  const [storyId, setStoryId] = useState<null | string>(null)
  const [style, setStyle] = useState('')
  const [readersAge, setReadersAge] = useState('')
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
  // const baseStoryImagePrompt = useSelector((state: RootState) => state.viewStory.baseStoryImagePrompt)
  const baseStoryImagePromptCreated = useSelector((state: RootState) => state.viewStory.baseStoryImagePromptCreated)
  const heroImage = useSelector((state: RootState) => state.viewCharacter.characterImage)
  const heroImagePrompt = useSelector((state: RootState) => state.viewCharacter.characterImagePrompt)


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
    seed: doc.data().seed, // Add this line

})) ?? [];

const [story, storyLoading, storyError] = useDocument(
  session?.user?.email && storyId
    ? doc(db, 'users', session.user.email, 'storys', storyId)
    : null
);

  const [storyContent, storyContentloading, storyContenterror] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyContent') : null,
  );


  const [storyOutline, storyOutlineLoading, storyOutlineError] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyOutline') : null,
  );

  let documentID = "";

if (!storyOutlineLoading && !storyOutlineError && storyOutline) {
  const documents = storyOutline.docs;
  if (documents.length > 0) {

    documentID = documents[0].id;
    // setDocId(documentID)
  }
}

const [singleDocument, singleDocumentLoading, singleDocumentError] = useDocument(
  session?.user?.email && storyId && documentID
    ? doc(db, 'users', session.user.email, 'storys', storyId, 'storyOutline', documentID)
    : null
);

useEffect(() => {
  if (!singleDocument) return;
  console.log(singleDocument.data())
  // setStoryDetails(singleDocument.data())
  setStyle(singleDocument.data()!.style)
  setReadersAge(singleDocument.data()!.readersAge)
  const hc = `${singleDocument.data()!.heroCharacter.name}  ${singleDocument.data()!.heroCharacter.imagePrompt}`
  setHeroCharacter(hc)
  
   console.log('singleDocument', singleDocument.data())
}, [singleDocument])

 
useEffect(() => {
    if (!storyContent) return;
    const sortedPages = storyContent.docs
      .map(doc => ({
        id: doc.id,
        data: doc.data(),
        // imagePromptCreated: doc.data().imagePromptCreated,
        // baseImagePromptCreated: doc.data().baseImagePromptCreated // Add this line
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

  }, [])

  // const createAllImagePromptsInOneFellSwoop = async() => {
  //   console.log('dont create bsae or page prompts do all in one!', story?.data()?.story )
  //   const prompt = `${allThePromptsFromOnePrompt} - the full story is ${story?.data()?.story}. The hero character is ${heroCharacter} The style to be referenced is ${style} `
  
  //   try{
  //    const response = await fetch('/api/createStoryImagePromptsFromSinglePrompt', {
  //       method: 'POST', 
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         prompt: prompt, 
  //         session,
  //         storyId: storyId, 
  
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log('this iss the DATA =>', data)
  //     console.log('if we have prmpts but no images create images next!')
   
  //   }catch(err){
  //     console.log(err)
  //     setGettingBasePrompt(false)
  //   }
  // }


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



    // const sendSms = async () => {
    //   console.log('trying to send sms')
    //   const phoneNumber = '+447309693489'
    //   const message = 'you have a new request for images!'
  
    //   try {
    //     const response = await fetch("/api/sendSms", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ toPhoneNumber: phoneNumber, message }),
    //     });
  
    //     if (response.ok) {
    //       console.log("SMS sent successfully!");
    //     } else {
    //       console.error("Error sending SMS");
    //     }
    //   } catch (error) {
    //     console.error("Error sending SMS:", error);
    //   }
    // };

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
      storyBaseImagePrompt={storyBaseImagePrompt || ''}
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
         <CreateStoryOutline characters={characters || []} />
      )}

      </div>

    </div>
  )
}

export default StoryPage
