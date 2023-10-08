import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/GlobalRedux/store';
import {  setEditBarType } from '../app/GlobalRedux/Features/pageToEditSlice';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

function LeftPage() {
  const dispatch = useDispatch();
  const newFontColor = useSelector((state: RootState) => state.pageToEdit.textColor);
  const newFontSize = useSelector((state: RootState) => state.pageToEdit.textSize);
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl);
  const pageText = useSelector((state: RootState) => state.pageToEdit.text);
  const improvedSmallImageUrl = useSelector((state: RootState) => state.pageToEdit.improvedSmallImageUrl)
  const finalSmallImageUrl = useSelector((state: RootState) => state.pageToEdit.finalSmallImageUrl);

  const [url, setUrl] = useState<string | null>(null)


  const viewRightPage = () => {
    dispatch(setName('editRightPage'));
    dispatch(setEditBarType('editText'));
  };

  
  useEffect(() => {
    if (!finalSmallImageUrl && !smallImageUrl && !improvedSmallImageUrl){
            setUrl(null)
    }
    if (!finalSmallImageUrl && !improvedSmallImageUrl && smallImageUrl){
        setUrl(smallImageUrl)
    }
    if (!finalSmallImageUrl && improvedSmallImageUrl){
        setUrl(improvedSmallImageUrl)
    }
    if (finalSmallImageUrl){
        setUrl(finalSmallImageUrl)
    }
  }, [smallImageUrl, finalSmallImageUrl])

  return (
    <div className="bg-gray-50 h-full w-full justify-center overscroll-none mx-3 ">
    {/* <div className='flex flex-col items-center bg-gray-50 h-full overscroll-none'> */}
      <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6">
        {url && (
          <div className="relative w-1/2 h-1/2 z-50 mx-auto mt-4">
            <Image src={url} alt='/' className="flex-2" fill />
          </div>
        )}
        <button className={`mt-4 mb-6 p-4 font-mystery leading-loose z-10 ${newFontSize} ${newFontColor}`}>{pageText}</button>
      </div>
      <div className="w-full p-2 flex justify-center">
        <button className="group rounded-full h-10 w-10 border-gray-200 bg-white group-hover:bg-purple-500" onClick={viewRightPage}>
          <ArrowRightIcon className='h-8 w-8 text-purple-500 group-hover:text-purple-800'/>
        </button>
      </div>
    </div>
  );
}

export default LeftPage;
