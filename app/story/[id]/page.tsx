'use client'

import SideBar from "../../../components/SideBar"
import CreatePDF from "../../../components/CreatePDF"
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
import { setBaseStoryImagePromptCreated, setTitle } from "../../GlobalRedux/Features/viewStorySlice"
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios"
import CharacterScrollBar from "../../../components/CharacterScrollBar"
import BookLayoutScrollBar from "../../../components/BookLayoutScrollBar"
import BookLayoutBuilder from "../../../components/BookLayoutBuilder"

import InsidePage from "../../../components/InsidePage"

interface PageData {
  id: string | null;
  
  data: any; // Replace 'any' with the appropriate type for your page data
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
  const [pageSelected, setPageSelected] = useState<string | null>(null)

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
  setStyle(singleDocument.data()!.style)
  setReadersAge(singleDocument.data()!.readersAge)
  const hc = `${singleDocument.data()!.heroCharacter.name} - ${singleDocument.data()!.heroCharacter.imagePrompt}`
  setHeroCharacter(hc)
  
   console.log('singleDocument', singleDocument.data())
}, [singleDocument])

 
useEffect(() => {
    if (!storyContent) return;

    const sortedPages = storyContent.docs
      .map(doc => ({
        id: doc.id,
        data: doc.data(),
      }))
      .sort((a, b) => a.data.pageNumber - b.data.pageNumber);
    setSortedStoryContent(sortedPages);
    console.log('this is sorted pages length', sortedPages.length)
  }, [storyContent]);

  useEffect(() => {
    const storyText = sortedStoryContent.reduce((text, page) => {
      return text + page.data.page;
    }, '');
    setFullStory(storyText)
  }, [sortedStoryContent])



  const switchToEdit = () => {
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

  return (
    <div className="flex w-screen bg-gray-50">

  {storyBuilderActive !== 'create story outline' && (
        <EditPageBar switchToEdit={() => setEditStoryPage(!editStoryPage)} updatePageText={updatePageText}  />

)}
  <div className='w-full h-screen overflow-y-scroll'>

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

        {storyBuilderActive !== 'create story outline' && (
          <BookLayoutScrollBar storyPages={sortedStoryContent} />
        )}

        {storyBuilderActive == 'create story outline' && (
          <CharacterScrollBar characters={characters} />
        )}

        {storyBuilderActive == 'create story outline' && (
          <CreateStoryOutline characters={characters || []} />
        )}

        {/* {storyBuilderActive === 'Cover Page' && (
          <BookLayoutBuilder title={story?.data()?.title} coverImage={story?.data()?.coverImage} story={story?.data()?.story} storyId={storyId} heroDescription={heroCharacter} style={style}  />
        )} */}

        {storyBuilderActive === 'InsidePage' && (
          <InsidePage />
        )} 
     
     

      </div>

    </div>
  )
}

export default StoryPage
