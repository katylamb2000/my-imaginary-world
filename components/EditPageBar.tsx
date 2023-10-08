import type { RootState } from '../app/GlobalRedux/store';
import {useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setId, setText, setTextColor, setEditText, setShowLayoutScrollbar, setEditBarType,  } from '../app/GlobalRedux/Features/pageToEditSlice'
import { setAddTextBox } from '../app/GlobalRedux/Features/addTextBoxSlice';
import { updateGetImagesModalStatus } from '../app/GlobalRedux/Features/getImagesModalSlice';
import { updateAddTextModalStatus } from '../app/GlobalRedux/Features/addTextModalSlice';
import { usePathname, useRouter } from "next/navigation"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, PencilIcon, DocumentDuplicateIcon, PhotoIcon, Square2StackIcon, Squares2X2Icon, BookOpenIcon, PlayIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SketchPicker } from 'react-color'
import { updateEditTextModalStatus, setEditTextPageId, setOpenEditorToolbar } from '../app/GlobalRedux/Features/editTextModalSlice';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice';
import page from '../app/admin/[id]/page';
import { updateimproveStoryModalStatus } from '../app/GlobalRedux/Features/improveStoryModalSlice';
import { setDesignCoverModalStatus, setType } from '../app/GlobalRedux/Features/designCoverModalSlice';
import { setStartReading, setCurrentPage, setCurrentPageText, setPaused } from '../app/GlobalRedux/Features/readStorySlice';
import Draggable from 'react-draggable';
import EditPageColor from './EditPageColor';
import { setLayoutSelected } from '../app/GlobalRedux/Features/layoutSlice';

type Props = {
    updatePageText: any;
    switchToEdit: any;
  }

function EditPageBar() {
    const router = useRouter()
    const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
    const editTextSelected = useSelector((state: RootState) =>  state.pageToEdit.editText);
    const selectedPageText = useSelector((state: RootState) =>  state.pageToEdit.text);
    const selectedPageTextColor = useSelector((state: RootState) =>  state.pageToEdit.textColor);
    const [storyId, setStoryId] = useState<string | null>(null)
    const [openColorEditor, setOpenColorEditor] = useState(false)
    const [pageId, setPageId] = useState<string | null>(null)
    const [fontSize, setFontSize] = useState<number>(24)
    const [openTextEditor, setOpenTextEditor] = useState<boolean>(false)
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const pathname = usePathname()
    const coverModalStatus = useSelector((state: RootState) => state.designCoverModal.status)
    const coverModalType = useSelector((state: RootState) => state.designCoverModal.type)
    const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const addTextBox = useSelector((state: RootState) =>  state.addTextBox.addTextBox);
    const editTextId = useSelector((state: RootState) => state.editTextModal.editTextPageId)
    const showLayoutScrollbar = useSelector((state: RootState) => state.pageToEdit.showLayoutScrollbar)
    const toggleGetImagesModuleStatus = useSelector((state: RootState) => state.getImagesModal.status)
    const subscriber = useSelector((state: RootState) => state.userDetails.isSubscriber)
    const storyComplete = useSelector((state: RootState) => state.viewStory.storyComplete)
    const pagesComplete = useSelector((state: RootState) => state.viewStory.pagesComplete)



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

      const readStory = () => {
        // read story and also get the suggestions for improvements. 
        dispatch(setName('InsidePage'))
        dispatch(setStartReading(true))
        dispatch(setPaused(false))
        dispatch(setCurrentPage('page_2'))
        dispatch(setCurrentPageText(selectedPageText))
        dispatch(setId('page_2'))
        dispatch(setText(selectedPageText))
      }

      const improveStory = async() => {
        dispatch(updateimproveStoryModalStatus(true))
        dispatch(setEditBarType('improveStory'))
        dispatch(setName('improveStory'))
        // open the ai module to discuss how to improve the story with the author. 
      }

const updatePageTextInDB = async() => {
    // dispatch(setText(''))
    if (!storyId || !selectedPageId || !selectedPageId) return;
    try{
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", selectedPageId);
        const updatedPage = await updateDoc(docRef, {
          page: selectedPageText
        });
    }catch(err){
        console.log(err)
    }
}

useEffect(() => {
    updateFontSize()
}, [fontSize])

useEffect(() => {
    if (storyBuilderActive == 'Inside 1'){
        setPageId("page_1")
    }
}, [storyBuilderActive])

const updateFontSize = async() => {
    // if (!storyId || !selectedPageId || !selectedPageId) return;
    if (!storyId || !pageId) return;
    try{
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
        const updatedPage = await updateDoc(docRef, {
          fontSize: fontSize
        });
        console.log('updated page fontsize:', updatedPage)
    }catch(err){
        console.log(err)
    }
}

    const getImages = () => {
        dispatch(setEditBarType('getImages'))
        dispatch(setName('leftAndRightPage'))
    }

    const editText = () => {
        dispatch(setEditBarType('editText'))
        dispatch(setName('editLeft'))
    }

    const openColorPicker = () => {
        setOpenColorEditor(true)
    }

    const openLayoutScrollbar = () => {
        dispatch(setShowLayoutScrollbar(!showLayoutScrollbar))
        if (!showLayoutScrollbar){
            dispatch(setLayoutSelected('default'))
        }
    }

    const designBookCover = () => {
        dispatch(setEditBarType('editCover'))
        dispatch(setName('CoverPage'))
    }

    const goToCheckOut = () => {
     
        // router.push('/orders')
    }



    const createPDF = () => {
        dispatch(setName('createPDF'))
    }
  return (

       
 <div className="bg-white h-screen ml-2 mr-8">

    <div className='space-y-6 w-full pt-8 '>

        {subscriber && (
            <div className='w-full text-center ' >
                <div className='group' onClick={readStory}>
                    <PlayIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                    <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Read the story</p>
                </div>
            </div>
        )}

        <div className='w-full text-center' >
                {storyId ? (
                    <div className='group' onClick={designBookCover}>
                        <BookOpenIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                        <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Design Cover</p>
                    </div>
                ):
                <>
                    <BookOpenIcon className='text-gray-300 h-8 w-8 mx-auto  ' />
                    <p className=' text-gray-300'>Design Cover</p>
                </>
                }
        </div>
   
        <div className='w-full text-center ' >
                {storyId ? (
                    <div className='group' onClick={improveStory}>
                        <BookOpenIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                        <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Improve the story</p>
                    </div>
                ):
                <>
                    <BookOpenIcon className='text-gray-300 h-8 w-8 mx-auto  ' />
                    <p className=' text-gray-300 sm:hidden'>Improve the story</p>
                </>
                }
            </div>
            
            <div className='w-full text-center ' >
                {selectedPageId ? (
                    <div className='group' onClick={getImages}>
                        <PhotoIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                        <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Get Images</p>
                    </div>
                ):
                <>
                    <PhotoIcon className='text-gray-300 h-8 w-8 mx-auto  ' />
                    <p className=' text-gray-300'>Get Images</p>
                </>
}
            </div>


            <div className='w-full text-center' >
                {selectedPageId ? (
                    <div className='group' onClick={editText} >
                        {/* // <div className='group' onClick={expandEditText} > */}
                        <PencilSquareIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                        <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Edit Text</p>
                    </div>
                ):
                    <>
                        <PencilSquareIcon className='text-gray-300 h-8 w-8 mx-auto ' />
                        <p className='text-gray-300'>Edit Text</p>
                    </>
                }
            </div>
      
      <div className='w-full text-center ' >
                {storyComplete ? (
                    <div className='group' onClick={createPDF}>
                        <DocumentCheckIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                        <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Create PDF</p>
                    </div>
                ):
                <div className='group'>
                    <DocumentCheckIcon className='text-gray-300 h-8 w-8 mx-auto ' />
                    <p className='text-gray-100'>Create PDF</p>
                </div>
}
            </div>

        <div className='w-full text-center ' >
                {storyComplete ? (
                    <div className='group' onClick={goToCheckOut}>
                        <ArrowDownCircleIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                        <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Order your booK</p>
                    </div>
                ):
                <div className='group'>
                    <ArrowDownCircleIcon className='text-gray-300 h-8 w-8 mx-auto ' />
                    <p className='text-gray-100'>Order your book</p>
                </div>
}
            </div>
            </div>
        </div>
        // {/* {openTextEditor && (
        //     <div className="bg-white w-32 h-screen ">
        //         <div className='flex border border-gray-700 p-4 rounded-lg w-4/5 mx-auto mt-12 space-x-2'>
        //             <button className='' onClick={() => setFontSize(fontSize + 1)}>
        //                 <PlusIcon className='h-4 w-4 text-gray-600' />
        //             </button>
        //             <p>{fontSize}</p>
        //             <button className='rounded-full' onClick={() => setFontSize(fontSize - 1)} >
        //                 <MinusIcon className='h-4 w-4 text-gray-600 hover:shadow-2xl hover:text-purple-500' />
        //             </button>
        //         </div>
        //     </div>
        // )} */}

    // </div>
  )
}

export default EditPageBar