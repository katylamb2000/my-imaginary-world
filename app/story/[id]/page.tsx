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
import { addDoc, collection, serverTimestamp, updateDoc, doc, QueryDocumentSnapshot, DocumentData, QuerySnapshot, getDocs } from "firebase/firestore"
import { db } from '../../../firebase'
import { useState, useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { RootState } from '../../../app/GlobalRedux/store';
import { useSelector, useDispatch } from "react-redux"
import { setbuttonMsgId, setCharacterDescription, setHeroCharacterName, setStyle } from '../../GlobalRedux/Features/pageToEditSlice'
import { addCharacters, addCharacter } from "../../GlobalRedux/Features/characterSlice"
import { setBaseStoryImagePromptCreated, setTitle, setFullStory, setCoverImage, setStoryComplete, setStoryCharacters } from '../../GlobalRedux/Features/viewStorySlice'
import { setName } from '../../GlobalRedux/Features/storyBuilderActiveSlice'
import SyncLoader from "react-spinners/SyncLoader";
import axios from "axios"
import CharacterScrollBar from "../../../components/CharacterScrollBar"
import BookLayoutScrollBar from "../../../components/BookLayoutScrollBar"
import BookLayoutBuilder from "../../../components/BookLayoutBuilder"
import ImproveImagesModal from "../../../components/ImproveImagesModal"
import BookCover from "../../../components/BookCover"
import InsidePage from "../../../components/InsidePage"
import GetImagesModal from "../../../components/GetImagesModal"
import AddTextModal from "../../../components/AddTextModal"
import EditTextModal from "../../../components/EditTextModal"
import ImproveStoryModal from "../../../components/ImproveStoryModal"
import GetPageImageModal from "../../../components/GetPageImageModal"
import BookPreview from "../../../components/BookPreview"
import TextEditorToolBar from "../../../components/TextEditorToolBar"
import { identityMatrix } from "pdf-lib/cjs/types/matrix"
import { setId } from "../../GlobalRedux/Features/pageToEditSlice"
import LayoutOne from "../../../components/LayoutOne"
import CoverModal from "../../../components/CoverModal"
import ImproveStoryPage from "../../../components/ImproveStoryPage"
import GeneratePDF from "../../../components/generatePDF"

interface PageData {
  id: string | null;
  data: any; // Replace 'any' with the appropriate type for your page data
}

interface ImageData {
  id: string | null;
  data: any; // Replace 'any' with the appropriate type for your page data
}

type Props = {
  sideBarCols: number,
  pageCols: number
}

function StoryPage() {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [storyBaseImagePrompt, setStoryBaseImagePrompt] = useState<null | string>(null)
  const [gettingBasePrompt, setGettingBasePrompt] = useState(false)
  const [docId, setDocId] = useState<null | string>(null)

  const [storyId, setStoryId] = useState<null | string>(null)
  const [readersAge, setReadersAge] = useState('')
  const [heroCharacter, setHeroCharacter] = useState<null | any>(null)
  const [imagePrompts, setImagePrompts] = useState<any[]>([]);
  const [content, setContent] = useState<null | any>(null)
  const [sortedStoryContent, setSortedStoryContent] = useState<PageData[]>([]);
  const [sortedImageIdeas, setSortedImageIdeas] = useState<ImageData[]>([]);
  const [storyContentId, setStoryContentId]= useState<null | string>(null)
  const [editStoryPage, setEditStoryPage] = useState(false)
  const [pagesProcessed, setPagesProcessed] = useState<string[]>([]);
  const pathname = usePathname()
  const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name);
  const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
  const selectedPageText = useSelector((state: RootState) =>  state.pageToEdit.text);
  // const baseStoryImagePrompt = useSelector((state: RootState) => state.viewStory.baseStoryImagePrompt)
  const baseStoryImagePromptCreated = useSelector((state: RootState) => state.viewStory.baseStoryImagePromptCreated)
  const layoutSelected = useSelector((state: RootState) => state.layout.layoutSelected)
  const heroImage = useSelector((state: RootState) => state.viewCharacter.characterImage)
  const editTextId = useSelector((state: RootState) => state.editTextModal.editTextPageId)
  const openEditorToobar = useSelector((state: RootState) => state.editTextModal.editTextPageId)
  const heroImagePrompt = useSelector((state: RootState) => state.viewCharacter.characterImagePrompt)
  const [pageSelected, setPageSelected] = useState<string | null>(null)
  const userEmail = session?.user?.email;
  const storyIdValue = storyId;
  const [sideBarCols, setSideBarCols] = useState(1)
  const [pageCols, setPageCols] = useState(5)


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

  // useEffect(() => {
  //   console.log('inside page ===>>', sideBarCols, pageCols, )
  //   if (storyBuilderActive === 'InsidePage'){
  //       console.log('inside page ===>>', sideBarCols, pageCols)
  //       setPageCols(5)
  //       setSideBarCols(1)
  //   }
  //   else if (storyBuilderActive === 'improveStory'){
  //       setPageCols(3)
  //       setSideBarCols(3)
  //   }
  //   else if (storyBuilderActive === 'CoverPage'){
  //     setPageCols(4)
  //     setSideBarCols(2)
  // }
  //   console.log('inside page ===>>', sideBarCols, pageCols, 'the storyBuilderActive === ', storyBuilderActive)
  // }, [storyBuilderActive, sideBarCols, pageCols])


  
  useEffect(() => {
    console.log(storyBuilderActive, sideBarCols, pageCols)
    switch (storyBuilderActive) {
      case 'CreatePDF':
        setSideBarCols(1);
        setPageCols(5);
        // updateColumnLayout(1, 5);
        break;
      case 'InsidePage':
        setSideBarCols(1);
        setPageCols(5);
        // updateColumnLayout(1, 5);
        break;
      case 'improveStory':
        setSideBarCols(3);
        setPageCols(3);
        // updateColumnLayo
        break;
      case 'CoverPage':
        setPageCols(3);
        setSideBarCols(3);
    
        // updateColumnLayo
        break;
      default:
        // Set default values here if needed
        setSideBarCols(1);
        setPageCols(5);
        break;
    }
    console.log(storyBuilderActive, sideBarCols, pageCols)
  }, [storyBuilderActive]);
  

  let aiAssitantMessages: QuerySnapshot<DocumentData> | undefined;

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail || !storyId) return;
      const messagesRef = collection(db, 'users', userEmail, 'storys', storyId, 'aiMessages');
      const querySnapshot = await getDocs(messagesRef);
      aiAssitantMessages = querySnapshot;
    };
    fetchData();
  }, [storyId, userEmail]);

  useEffect(() => {
    console.log('MESSAGES =====>', aiAssitantMessages?.docs);
  }, [aiAssitantMessages]);

  useEffect(() => {
    console.log("page id ---> ", selectedPageId)
    if (storyBuilderActive == 'InsidePage' && selectedPageId == ''){
      dispatch(setId('page_1'))
    }
  }, [selectedPageId])

  // Rest of your component code

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

const [images, imagesLoading, imagesError] = useCollection(
  session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'images') : null,
);

useEffect(() => {
  if (!images?.docs.length) return;
  const sortedImages = images.docs
    .map(doc => ({
      id: doc.id,
      data: doc.data(),
    }))
    .sort((a, b) => a.data.pageNumber - b.data.pageNumber);

  setSortedImageIdeas(sortedImages)
  sortedImages.map(image => {
    if (!image.data.backgroundImageUrl){
      console.log('no url yet')
    }
  })
}, [images]);

const [story, storyLoading, storyError] = useDocument(
  session?.user?.email && storyId
    ? doc(db, 'users', session.user.email, 'storys', storyId)
    : null
);

useEffect(() => {
  
    // const fullStory = story?.data()?.fullStory;
    // console.log("FULL STORY", fullStory)
    // dispatch(setFullStory(fullStory));

    const coverImage = story?.data()?.coverImage
    dispatch(setCoverImage(coverImage))

    const buttonMsgId = story?.data()?.buttonMessageId
    dispatch(setbuttonMsgId(buttonMsgId))

    const storyComplete = story?.data()?.storyComplete
    // dispatch(setStoryComplete(storyComplete))

}, [story])

  const [storyContent, storyContentloading, storyContenterror] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session?.user.email, 'storys', storyId, 'storyContent') : null,
  );

  const [storyOutline, storyOutlineLoading, storyOutlineError] = useCollection(
    session?.user?.email && storyId ? collection(db, 'users', session?.user.email, 'storys', storyId, 'storyOutline') : null,
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
    ? doc(db, 'users', session?.user.email, 'storys', storyId, 'storyOutline', documentID)
    : null
);

useEffect(() => {
  if (singleDocument){

   }

}, [singleDocument])

useEffect(() => {
  if (!storyOutline?.docs.length) return;

  if (storyOutline?.docs.length){
    dispatch(setStyle(storyOutline?.docs[0].data().style))
  }
}, [storyOutline])

const [supportingCharactersSnapshop, supportingCharactersLoading, supportingCharactersError] = useCollection(
  session?.user?.email && storyId ? collection(db, 'users', session?.user.email, 'storys', storyId, 'characters') : null,
);

useEffect(()=> {
  if (!supportingCharactersSnapshop?.docs.length) return;

  if (supportingCharactersSnapshop?.docs.length){

    const charactersArray = supportingCharactersSnapshop?.docs.map(doc => ({
      name: doc.data().name,
      description: doc.data().description,
    }))

    console.log('charactersArray', charactersArray)
    dispatch(setStoryCharacters(charactersArray))
  }
}, [supportingCharactersSnapshop])

useEffect(()=> {
  if (!supportingCharactersSnapshop?.docs.length) return;

  if (supportingCharactersSnapshop?.docs.length){

    const charactersArray = supportingCharactersSnapshop?.docs.map(doc => ({
      name: doc.data().name,
      description: doc.data().description,
    }))

    console.log('charactersArray', charactersArray)
    dispatch(addCharacters(charactersArray))
  }
}, [supportingCharactersSnapshop])

useEffect(() => {
  if (!singleDocument) return;
  console.log(singleDocument.data())
  setStyle(singleDocument.data()!.style)
  setReadersAge(singleDocument.data()!.readersAge)
  const hero = { name:singleDocument.data()!.heroCharacter.name, description: singleDocument.data()!.heroCharacter.name }
  dispatch(addCharacter(hero))
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
  }, [storyContent]);

  useEffect(() => {
    let pageNumber = 1;
    let finalString = '';
  
    sortedStoryContent.forEach(story => {
      finalString += `page_${pageNumber}: ${story.data.text} `;
      pageNumber++;
    });
    dispatch(setFullStory(finalString))
  
  }, [sortedStoryContent]);
  

  // useEffect(() => {
  //     if (!storyContent) return;
  //     storyContent.docs.map(doc => {
  //       if (doc.data().audioUrl) return;
  //       else if (!doc.data().audioUrl){
  //         fetch('/api/elevenLabs', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ message:  doc.data().text, voice: '21m00Tcm4TlvDq8ikWAM', pageId: doc.id, storyId: storyId, session: session })
  //         }).then(async (response) => {
  //           const blob = await response.blob();
    
  //           console.log("I AM BLOB", blob)
  //         }).catch(console.error);
  //       }
  //       console.log('DOC DATA', doc.data().audioUrl)
  //     })

  // }, [storyContent])


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
    // console.log(selectedPageText, selectedPageId);
    if (!storyId || !selectedPageId) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", selectedPageId);
    const updatedPage = await updateDoc(docRef, {
      page: selectedPageText
    });
    console.log(updatedPage);
  };

  useEffect(() => {
    if (storyBuilderActive == 'view story' && !selectedPageId){
      dispatch(setName('CoverPage'))
    }
  }, [storyBuilderActive, selectedPageId ])

  return (
    <div className="w-screen bg-gray-50 ">
      {/* <ImproveImagesModal />
      <ImproveStoryModal  />
      <GetImagesModal />
      <GetPageImageModal />
      <AddTextModal />
      <CoverModal /> */}
      {/* <EditTextModal /> */}

      <div className="w-full grid grid-cols-7">

        <div className={`col-span-${sideBarCols}`}>
          {storyBuilderActive !== 'create story outline' && (
              <SideBar />
            )}
        </div>
        
    <div className={`col-span-${pageCols} h-screen overflow-y-scroll bg-gray-50 `}>
      {/* <div className={`col-span-5 h-screen overflow-y-scroll bg-purple-200 `}> */}
          {/* {editTextId == selectedPageId && openEditorToobar &&   (
              <TextEditorToolBar />
          )} */}
        {storyBuilderActive === 'InsidePage' && layoutSelected == 'default' && (
          <InsidePage storyPages={sortedStoryContent} imageIdeas={sortedImageIdeas} />
        )} 

         {storyBuilderActive === 'improveStory' && layoutSelected == 'default' && (
          <ImproveStoryPage storyPages={sortedStoryContent} />
        )} 

        {storyBuilderActive === 'CoverPage' && (
       
          <BookCover />

        )}

        {/* {storyBuilderActive === 'InsidePage' && layoutSelected == 'one' && (
          <LayoutOne />
        )}  */}

        {storyBuilderActive == 'create story outline' && (
          <CreateStoryOutline characters={characters || []} />
        )}
    </div>
        
        <div className="col-span-1">
            {storyBuilderActive !== 'create story outline' && (
              // <div className="col-span-7 w-full items-center ">
                <BookLayoutScrollBar storyPages={sortedStoryContent} imageIdeas={sortedImageIdeas} />
              // </div>
            )}
        </div>
 
        </div>

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

        {storyBuilderActive == 'create story outline' && (
          <CharacterScrollBar characters={characters} />
        )}

        {storyBuilderActive == 'createPDF' && storyId && (
          <GeneratePDF story={sortedStoryContent} storyId={storyId} />
        )}

    </div>
  )
}

export default StoryPage

// this will stop the glitch on refresh because it gets user before it hits the browser

// export async function getServerSideProps(context) {
//   const session = await getSession(context)
// }

// return {
//   props: {
  // session
// }
// }