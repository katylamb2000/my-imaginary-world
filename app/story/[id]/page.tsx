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
import { setBaseStoryImagePromptCreated, setTitle, setFullStory, setCoverImage, setStoryComplete, setStoryCharacters, setTitleIdeas, setThumbnailImage, setPdfUrl } from '../../GlobalRedux/Features/viewStorySlice'
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
import TextPage from "../../../components/LeftPage"
import LeftPage from "../../../components/LeftPage"
import RightPage from "../../../components/RightPage"
import { setIsLoading } from "../../GlobalRedux/Features/pageLoadingSlice"
import GetImagesSideBar from "../../../components/GetImagesSideBar"

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
  const storyComplete = useSelector((state: RootState) => state.viewStory.storyComplete)
  const [pageSelected, setPageSelected] = useState<string | null>(null)
  const userEmail = session?.user?.email;
  const storyIdValue = storyId;
  const [sideBarCols, setSideBarCols] = useState(1)
  const [pageCols, setPageCols] = useState(6)

  useEffect(() => {
    if (!pathname) return;
    const regex = /^\/story\/([a-zA-Z0-9]+)$/;
    const id = regex.exec(pathname);
  
    if (id) {
      const identifier = id[1];
      setStoryId(identifier);  
    } else {
      console.log("No story id");
    }
  }, [pathname])



useEffect(() => {
  dispatch(setIsLoading(false))
}, [])

  useEffect(() => {
    switch (storyBuilderActive) {
      case 'CreatePDF':
        setSideBarCols(1);
        setPageCols(6);
        // updateColumnLayout(1, 5);
        break;
      case 'InsidePage':
        setSideBarCols(1);
        setPageCols(6);
        // updateColumnLayout(1, 5);
        break;
      case 'improveStory':
        setSideBarCols(3);
        setPageCols(4);
        // updateColumnLayo
        break;
      case 'CoverPage':
        setPageCols(3);
        setSideBarCols(4);
        // updateColumnLayo
        break;
      case 'editText':
          setPageCols(3);
          setSideBarCols(4);
          // updateColumnLayo
          break;
        case 'editLeft':
            setPageCols(3);
            setSideBarCols(4);
            // updateColumnLayo
            break;
          case 'editRightPage':
            setPageCols(3);
            setSideBarCols(4);
              // updateColumnLayo
             break;
          case 'leftAndRightPage':
            setPageCols(3);
            setSideBarCols(4);
              // updateColumnLayo
              break;
          case 'improveRightImage':
            setPageCols(3);
            setSideBarCols(4);
                // updateColumnLayo
            break;
          case 'improveLeftImage':
              setPageCols(3);
              setSideBarCols(4);
                  // updateColumnLayo
              break;
          case 'showCreateCharacterForm':
            setPageCols(7);
            setSideBarCols(0);
          case 'getRightImage':
              setPageCols(3);
              setSideBarCols(4);
                  // updateColumnLayo
              break;
      default:
        // Set default values here if needed
        setSideBarCols(1);
        setPageCols(6);
        break;
    }

  }, [storyBuilderActive, sideBarCols, pageCols]);

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
    if (storyBuilderActive == 'InsidePage' && selectedPageId == ''){
      dispatch(setId('page_1'))
    }
  }, [selectedPageId])


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

   
    // const coverImageUrl = story?.data()?.coverImageUrl
    // dispatch(setThumbnailImage(coverImageUrl))

    const pdfUrl = story?.data()?.pdfUrl32FrontPage
    dispatch(setPdfUrl(pdfUrl))
  
    const coverImage = story?.data()?.coverImageUrl
    dispatch(setCoverImage(coverImage))

    const buttonMsgId = story?.data()?.buttonMessageId
    dispatch(setbuttonMsgId(buttonMsgId))

    const titleIdeas = story?.data()?.titleIdeas?.coverImagePrompt
    dispatch(setTitleIdeas(titleIdeas))

    const storyComplete = story?.data()?.storyComplete

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
    dispatch(addCharacters(charactersArray))
  }
}, [supportingCharactersSnapshop])

useEffect(() => {
  if (!singleDocument) return;
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
    .sort((a, b) => parseInt(a.id.split('_')[1]) - parseInt(b.id.split('_')[1]));
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
    if (!storyId || !selectedPageId) return;
    const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", selectedPageId);
    const updatedPage = await updateDoc(docRef, {
      page: selectedPageText
    });
  };

  return (
    <div className="w-screen bg-gray-50 grid grid-cols-7">
      {/* <div className="w-full "> */}
      {storyBuilderActive !== 'create story outline' && storyBuilderActive !== 'showCreateCharacterForm' && (

        <div className={`col-span-${sideBarCols}`}>
              {/* // <SideBar /> */}
              <BookLayoutScrollBar storyPages={sortedStoryContent} imageIdeas={sortedImageIdeas} story={story} />
       
        </div>
        
        )}
    {storyBuilderActive !== 'create story outline' && storyBuilderActive !== 'showCreateCharacterForm' && (

    <div className={`col-span-${pageCols} overflow-y-scroll bg-gray-50 `}>

        {storyBuilderActive === 'InsidePage' &&  (
          <InsidePage storyPages={sortedStoryContent} imageIdeas={sortedImageIdeas} />
        )} 

        {storyBuilderActive === 'editLeft' && layoutSelected == 'default' && (
          <LeftPage />
        )} 

        {storyBuilderActive === 'editRightPage' && layoutSelected == 'default' && (
          <RightPage />
        )} 

      {storyBuilderActive === 'leftAndRightPage' && layoutSelected == 'default' && (
          <>
          <div className="bg-green-500"> chat with gpt about improving the image</div>
          </>
        )} 

        {storyBuilderActive === 'improveRightImage' && layoutSelected == 'default' && (
          <>
          <RightPage />
          </>
        )} 

        {storyBuilderActive === 'improveLeftImage' && layoutSelected == 'default' && (
          <>
          <LeftPage />
          </>
        )} 

      {storyBuilderActive === 'improveStory' && layoutSelected == 'default' && (
          <ImproveStoryPage storyPages={sortedStoryContent} />
      )} 

      {storyBuilderActive === 'CoverPage' && (
          <BookCover />
        )}
      
      {storyBuilderActive === 'getRightImage' && layoutSelected == 'default' && (
          <>
          <RightPage />
          </>
        )} 

    </div>
    )}

    {storyBuilderActive == 'create story outline' && (
        
        <CreateStoryOutline characters={characters || []} />
     )}

    {storyBuilderActive == 'showCreateCharacterForm' && (
        <MainCharacterFundamentalsForm />
      )}
        
        {/* <div className="col-span-1">
            {storyBuilderActive !== 'create story outline' && (
                <BookLayoutScrollBar storyPages={sortedStoryContent} imageIdeas={sortedImageIdeas} />
            )}
        </div> */}
 
        {/* </div> */}

        {storyBuilderActive == 'editRightPage' && (
          <div className="col-span-3">
          <SideBar />
          </div>
        )}

        {storyBuilderActive == 'editLeft' && (
          <div className="col-span-3">
          <SideBar />
          </div>
        )}

        {storyBuilderActive == 'improveRightImage' && (
          <div className="col-span-3">
          <SideBar />
          </div>
        )}

        {storyBuilderActive == 'getRightImage' && (
          <div className="col-span-3">
          <GetImagesSideBar />
          </div>
        )}

        {storyBuilderActive == 'improveLeftImage' && (
          <div className="col-span-3 bg-gray-50">
          <SideBar />
          </div>
        )}

{storyBuilderActive == 'CoverPage' && (
          <div className="col-span-3 bg-gray-50">
          <SideBar />
          </div>
        )}

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

        {/* {storyBuilderActive == 'create story outline' && (
          <CharacterScrollBar characters={characters} />
        )} */}
{/* 
        {storyBuilderActive == 'createPDF' && storyId && (
          <GeneratePDF story={sortedStoryContent} storyId={storyId} />
        )} */}


    {storyComplete && (
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

