import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice';
import { setEditBarType } from '../app/GlobalRedux/Features/pageToEditSlice';
import { RootState } from '../app/GlobalRedux/store';

function RightPage() {
  const dispatch = useDispatch();
  const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl);
  const improvedImageUrl = useSelector((state: RootState) => state.pageToEdit.improvedImageUrl);
  const finalImageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl);
  const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)

  const viewLeftPage = () => {
    dispatch(setName('editLeft'));
    dispatch(setEditBarType('editText'));
  };

  return (
<div className="bg-gray-50 h-full w-full justify-center overscroll-none">
  <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6">
    
    {imageUrl && !finalImageUrl && !improvedImageUrl && (
      <>
      <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-xl text-white bg-black bg-opacity-50 p-2'>{rightPageText}</p>
      <Image src={imageUrl} alt="/" className="h-full w-full z-10" fill />
      </>
    )}

    {improvedImageUrl && !finalImageUrl && (
      <>
      <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-xl text-white bg-black bg-opacity-50 p-2'>{rightPageText}</p>
      <Image src={improvedImageUrl} alt="/" className="h-full w-full z-10" fill />
      </>
    )}

  </div>


      <div className="w-full p-2 flex justify-center">
        <button className="rounded-full group h-10 w-10 text-center border-gray-200 bg-white group-hover:bg-purple-500" onClick={viewLeftPage}>
          <ArrowLeftIcon className="h-8 w-8 text-purple-500 group-hover:text-purple-800" />
        </button>
      </div>
    </div>
  );
}

export default RightPage;
