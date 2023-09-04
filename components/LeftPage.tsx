

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { RootState } from '../app/GlobalRedux/store';
import { setText, setId, setShowInputBox } from '../app/GlobalRedux/Features/pageToEditSlice';
import { updateModalStatus } from '../app/GlobalRedux/Features/improveImagesModalSlice';
import { setStoryId } from '../app/GlobalRedux/Features/viewStorySlice';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon, CheckCircleIcon as CheckDone } from '@heroicons/react/24/solid';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import NextImageModal from './NextImageModal';
import { setEditTextPageId } from '../app/GlobalRedux/Features/editTextModalSlice';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice';

function LeftPage() {
  const dispatch = useDispatch();
  const newFontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
  const newFontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
  const pageId = useSelector((state: RootState) => state.pageToEdit.id)
  const smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl)
  const pageText = useSelector((state: RootState) => state.pageToEdit.text)
  const smallImageTop = useSelector((state: RootState) => state.pageToEdit.smallImageTop)
  const pageView = useSelector((state: RootState) =>  state.storyBuilderActive.name)
  const [showText, setShowText] = useState(true);

useEffect(() => {
  console.log(smallImageTop)
}, [smallImageTop])

const viewRight = () => {
  dispatch(setName('editRightPage'))
}

  return (
    <div className='bg-gray-50 h-full w-full justify-center overscroll-none'>
      <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">
    {/* className={`border-2 border-gray-300 border-dashed h-4/5 w-3/5 bg-white drop-shadow-md ${
      showText ? 'opacity-100' : 'opacity-0 scale-0 translate-y-[-50%] transition-all duration-300'
    }`}
  > */}

    {smallImageTop == 'imageTop' && (
      <button onClick={() => dispatch(setEditTextPageId(pageId)) } className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-10 mb-6`}>{pageText}</button>
    )}
          {/* <button onClick={() => dispatch(setEditTextPageId(pageId)) } className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-10 mb-6`}>{pageText}</button> */}


    {smallImageUrl && (
      <div className="relative w-1/2 h-1/2 z-50 mx-auto mt-4">
        <Image src={smallImageUrl} alt='/' className="flex-2" fill />
      </div>
    )}

      {smallImageTop == 'imageBottom' && (
            <button onClick={() => dispatch(setEditTextPageId(pageId)) } className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-10 mb-6`}>{pageText}</button>
          )} 

  {/* <button onClick={() => dispatch(setEditTextPageId(pageId)) } className={`${newFontSize} ${newFontColor} m-4 p-4 font-mystery leading-loose my-auto z-10 mb-6`}>{pageText}</button> */}
     
  </div>

      {pageView == 'leftAndRightPage' && (
            <div className="w-1/3 mx-auto mt-4 bg-purple-300 rounded-md mb-48 flex justify-evenly h-14 text-center items-center">
              <ArrowLeftIcon className=' h-8 w-8 text-purple-800 hover:text-white'  onClick={viewRight}/>
              <ArrowRightIcon className=' h-8 w-8 text-purple-800 hover:text-white' onClick={viewRight} />
            </div>
        )}
    </div>

  );
}

export default LeftPage;
