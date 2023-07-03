import type { RootState } from '../app/GlobalRedux/store';
import {useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setId, setText, setTextColor, setEditText } from '../app/GlobalRedux/Features/pageToEditSlice'
import { setAddTextBox } from '../app/GlobalRedux/Features/addTextBoxSlice';
import { usePathname } from "next/navigation"
import { ArrowDownCircleIcon, ArrowUpCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, PencilIcon, DocumentDuplicateIcon, PhotoIcon, Square2StackIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SketchPicker } from 'react-color'

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
    const [pageId, setPageId] = useState<string | null>(null)
    const [fontSize, setFontSize] = useState<number>(24)
    const [openTextEditor, setOpenTextEditor] = useState<boolean>(false)
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const pathname = usePathname()
    const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const addTextBox = useSelector((state: RootState) =>  state.addTextBox.addTextBox);

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
    dispatch(setAddTextBox(!addTextBox))
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
    }
  return (
    <div className="flex">
        <div className="bg-white w-32 h-screen">
    
        {/* {selectedPageText !== '' && (
            <div className='w-full'> 
                <input value={selectedPageText} onChange={(e) => dispatch(setText(e.target.value))}
                        className='w-full p-4 m-4'
                />
                    <div className='flex'>
                        <button 
                            className='text-white p-4'
                            // onClick={updatePageText}
                            onClick={updatePageTextInDB}
                        >
                                update page text
                        </button>
                        <button 
                            className='text-white p-4'
                            onClick={finishedUpdatingPageText}
                        >
                            DONE
                        </button>
                </div>
           
           <SketchPicker onChange={(e) => dispatch(setTextColor(`[${e.hex}]`))}/>


            <div className='flex bg-white'> 

                <ArrowDownCircleIcon className='h-14 w-14 text-purple-600 hover:opacity-50 hover:shadow-xl' onClick={decreaseTextSize} />
                <ArrowUpCircleIcon className='h-14 w-14 text-purple-600 hover:opacity-50 hover:shadow-xl' onClick={increaseTextSize} />

            </div>
    </div> */}

        {/* )} */}

        <div className='space-y-6 w-full my-12 '>
            <div className='w-full text-center group'>
                <Square2StackIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Add a layer</p>
            </div>
            
            <div className='w-full text-center group' onClick={getImages}>
                <PhotoIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Get Images</p>
            </div>

            <div className='w-full text-center group' onClick={addText}>
                <PencilIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Add Text</p>
            </div>

            <div className='w-full text-center group' onClick={expandEditText}>
                <PencilSquareIcon className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Edit Text</p>
            </div>

            <div className='w-full text-center group'>
                <Squares2X2Icon  className='text-gray-800 h-8 w-8 mx-auto  group-hover:text-purple-600 group-hover:scale-105 ' />
                <p className='group-hover:text-purple-600 group-hover:scale-105 text-gray-600'>Layout</p>
            </div>
      
        </div>

        </div>
        {/* {openTextEditor && (
            <div className="bg-white w-32 h-screen ">
                <div className='flex border border-gray-700 p-4 rounded-lg w-4/5 mx-auto mt-12 space-x-2'>
                    <button className='' onClick={() => setFontSize(fontSize + 1)}>
                        <PlusIcon className='h-4 w-4 text-gray-600' />
                    </button>
                    <p>{fontSize}</p>
                    <button className='rounded-full' onClick={() => setFontSize(fontSize - 1)} >
                        <MinusIcon className='h-4 w-4 text-gray-600 hover:shadow-2xl hover:text-purple-500' />
                    </button>
                </div>
            </div>
        )} */}

    </div>
  )
}

export default EditPageBar