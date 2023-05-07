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
  baseImagePromptCreated: Boolean
  imagePromptCreated: boolean
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


  const basePrompt = `I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called midjourney. The image should be for an illustrated children's book. 

  I will provide you with a the full story which will later be divided into pages. Your job is to create a full, explicit, coherent prompt for the overarching theme, style and artistic atttributes of the book. This prompt will include a color theme and specific style of images in concise accurate language.
   Use highly specific and explicit references to popular culture, artists and mediums. 

   The prompt should be a single paragraph which uses natural descriptive language. Do not need to start the prompt with Prompt:, just write it as a regular paragraph

  Your job is not to describe the images in any way just to create the base prompt for the overall style of the images. 
  
  Your focus needs to be on nouns and adjectives. 
  
  Here is a formula template for you to use: 
  
  ARTIST: Adam Stower | AESTHETIC: kidcore| MEDIUM: cartoon | GENRE: Fantasy | EMOTION: Quirky and whimsical | COLOR PALLETE: bright vibrant colors — ar 16:9
  
`

const pageBasePrompt = 
`I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called midjourney.
The image should be for a children's book. 
your job is to describe the a picture which will best fit that page of the story. 
I will also give you the hero character, if you choose to feature this character in the picture you must always also give the character description that I give you.
You must nerver change or edit the chartacter desciption other than to dexcribe the characters pose or expressions etc.  
The prompt should be a single paragraph which uses natural descriptive language. Do not need to start the prompt with Prompt:, just write it as a regular paragraph


`

const allThePromptsFromOnePrompt = 
`I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called midjourney.
The image should be for an illustrated children's book. 
I will give you each page of the story and your job is to describe the a picture which will go with that page of the story. 
Each prompt must be a single paragraph which uses natural descriptive language. Do not need to start the prompt with Prompt:, just write it as a regular paragraph.
Each prompt must first describne the content of the image and then describe the aesthetics and styling. 
The style choices should reference specific media, artists and color palletes. 
The ai art generator will not have access to prompts for prior or subsequent images so you must clearly descrivbe the style and artists to be referenced in each prompt so that the styling is consistent through the whole story. 
I will also give you the hero character, if you choose to feature this character in the picture you must always also include the character description that I give you in the prompt in order to generate consistent characters throughout the story.
You must nerver change or edit the chartacter desciption other than to dexcribe the characters pose or expressions etc.

Structure your anser in the following way:
Title: {{imagePrompt}}
  
    Page 1:
    {{imagePrompt}}
 
    Page 2:
    {{imagePrompt}}
   
    Page 3:
    {{imagePrompt}}

  
    Page 4:
    {{imagePrompt}}

  
    Page 5:
    {{imagePrompt}}

  
    Page 6:
    {{imagePrompt}}

  
    Page 7:
    {{imagePrompt}}

  
    Page 8:
    {{imagePrompt}}

  
    Page 9:
    {{imagePrompt}}

  
    Page 10:
    {{imagePrompt}} 
`

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

  useEffect(() => {
    if (!story) return;

    console.log('storyContent', storyContent?.docs.length) 
    if (!storyContent?.docs.length) return;
      else if (story.data()?.baseImagePrompt?.imagePrompt){
      console.log('got a story base image prompt')
      setStoryBaseImagePrompt(story.data()?.baseImagePrompt.imagePrompt)
    }
    else if (!story.data()!.baseImagePrompt.imagePrompt && storyContent?.docs.length){
      console.log('NO base image prompt!!!!')
      createStoryBaseImagePrompt()
    }
  }, [story, storyContent])

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
        imagePromptCreated: doc.data().imagePromptCreated,
        baseImagePromptCreated: doc.data().baseImagePromptCreated // Add this line
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
    console.log(storyContent?.docs.length, storyBaseImagePrompt)
    if (!storyContent?.docs.length) return;
    if (!storyBaseImagePrompt) return;
    if (storyContent.docs.length && storyBaseImagePrompt ) {
      storyContent.docs.map((page) => {
        // console.log('this is a usefct that will create image prompt for all mapped content', page.data().imagePromptCreated)
        if ( page.data().imagePromptCreated == false){
            createPageImagePrompt(page);
        }

      });
    }
  }, [storyContent, storyBaseImagePrompt]);

  useEffect(() => {

  }, [])

  const createStoryBaseImagePrompt = async () => {

    console.log('creating BASE!!!!!!')
    if (gettingBasePrompt) return;

    setGettingBasePrompt(true)
    const storyBasePrompt = `${basePrompt} - the full story is ${fullStory}.`
  
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
      setGettingBasePrompt(false)
      dispatch(setBaseStoryImagePromptCreated(true))
    }catch(err){
      console.log(err)
      setGettingBasePrompt(false)
    }
  }

  const createPageImagePrompt = async (page: QueryDocumentSnapshot) => {
  console.log("IN CREATE PAGE IMAGE P~R~OMPTS")
  console.log(`${pageBasePrompt} the full story is ${fullStory}.  The page I want you to generate an ai art generator prompt for is ${page.data().page}. This is a childrens story book for a ${readersAge} old child. The hero character is ${heroCharacter}`)
  
  if (page.data().imagePromptCreated) return;
    // if (page!.imagePromptCreated) return;
  
    const pageProcessing = pagesProcessed.find((pageId: string) => pageId === page.id);
    if (pageProcessing) return;

    else if (page.data().imagePromptCreated == false){
      setPagesProcessed(pagesProcessed => [...pagesProcessed, page.id])
    // console.log('creating IP for', sc.id, sc.data().page)
    const pagePrompt = `${pageBasePrompt} the full story is ${fullStory}. The styling must be consistent with ${storyBaseImagePrompt}. The page I want you to generate an ai art generator prompt for is ${page.data().page}. This is a childrens story book for a ${readersAge} old child. The hero character is ${heroCharacter}`
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
          page: page.id
        }),
      });
      const data = await response.json();
      console.log(data.answer)

  }catch(err){
      console.log(err)
}}
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
