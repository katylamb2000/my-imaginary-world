import type { RootState } from '../app/GlobalRedux/store';
import {useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setId, setText, setTextColor, setEditText } from '../app/GlobalRedux/Features/pageToEditSlice'
import { setAddTextBox } from '../app/GlobalRedux/Features/addTextBoxSlice';
import { updateGetImagesModalStatus } from '../app/GlobalRedux/Features/getImagesModalSlice';
import { updateAddTextModalStatus } from '../app/GlobalRedux/Features/addTextModalSlice';
import { usePathname } from "next/navigation"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, PencilIcon, DocumentDuplicateIcon, PhotoIcon, Square2StackIcon, Squares2X2Icon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SketchPicker } from 'react-color'
import { updateEditTextModalStatus, setEditTextPageId } from '../app/GlobalRedux/Features/editTextModalSlice';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice';
import page from '../app/admin/[id]/page';
import { updateimproveStoryModalStatus } from '../app/GlobalRedux/Features/improveStoryModalSlice';
import Draggable from 'react-draggable';
import EditPageColor from './EditPageColor';

type Props = {
    updatePageText: any;
    switchToEdit: any;

  }

function EditPageBar({switchToEdit, updatePageText}: Props) {
    
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
    const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const addTextBox = useSelector((state: RootState) =>  state.addTextBox.addTextBox);
    const editTextId = useSelector((state: RootState) => state.editTextModal.editTextPageId)

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
        dispatch(setName('preview'))
      }

      const improveStory = async() => {
        dispatch(updateimproveStoryModalStatus(true))
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
        console.log('updated page text:', updatedPage)
    }catch(err){
        console.log(err)
    }
}

useEffect(() => {
    console.log(selectedPageTextColor)
}, [selectedPageTextColor])

const increaseTextSize = () => {
    console.log()
}

const decreaseTextSize = () => {
    console.log()
}

const finishedUpdatingPageText = () => {
    console.log('FINISHED')
}

const addText = () => {
    console.log('add text')
    dispatch(updateAddTextModalStatus(true))
    // dispatch(setAddTextBoxId())
}

const expandEditText = () => {
    console.log('ETS', editTextSelected)
    // if (!selectedPageId.length) return;
    console.log('i want to get the pageID', selectedPageId)
    dispatch(setEditText(selectedPageId))

    // setOpenTextEditor(!openTextEditor)
}

useEffect(() => {

}, [])

useEffect(() => {
    console.log('EDIT TEXT SLEc', editTextSelected)
}, [editTextSelected])

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
    console.log(storyBuilderActive)

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
        console.log("Get images", storyId)
        dispatch(updateGetImagesModalStatus(true))
    }

    const editText = () => {
        console.log('i want to close the text editor tool bar', selectedPageId, editTextId)
        if (selectedPageId == editTextId){
            console.log('i want to close the text editor tool bar')
            dispatch(setEditTextPageId(''))
        }
        // dispatch(updateEditTextModalStatus(true))
        console.log("PAGE ID", pageId)
        if (selectedPageId && selectedPageId !== editTextId){
        dispatch(setEditTextPageId(selectedPageId))
        }
    }

    const openColorPicker = () => {
        setOpenColorEditor(true)
    }

  return (
    // <div className="flex">
       
        <div className="bg-white w-32 h-screen">
    
    <div className='space-y-6 w-full my-12 '>

        <div className='w-full text-center ' >
            <div className='group' onClick={readStory}>
                <PlayIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Read the story</p>
            </div>
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
                    <p className=' text-gray-300'>Improve the story</p>
                </>
                }
            </div>

            <div className='w-full text-center group'>
                <Square2StackIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Add a layer</p>
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

            <div className='w-full text-center'>
                {selectedPageId ? (
                <div className='group'onClick={addText} >
                    <PencilIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                    <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Add Text</p>
                </div>
                ):
                    <>
                    <PencilIcon className='text-gray-300 h-8 w-8 mx-auto ' />
                    <p className='text-gray-300'>Add Text</p>
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

            <div className='w-full text-center group ' onClick={openColorPicker}>
                <Squares2X2Icon  className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Layout</p>
            </div>
      
        </div>

        {openColorEditor && (
            <Draggable>
                <EditPageColor />
            </Draggable>
        )}

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