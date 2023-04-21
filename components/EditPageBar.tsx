import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setId, setText, setTextColor } from '../app/GlobalRedux/Features/pageToEditSlice'
import { useEffect } from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/solid';

type Props = {
    updatePageText: any;
    switchToEdit: any;
  
  }
function EditPageBar({switchToEdit, updatePageText}: Props) {
    const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
    const selectedPageText = useSelector((state: RootState) =>  state.pageToEdit.text);
    const selectedPageTextColor = useSelector((state: RootState) =>  state.pageToEdit.textColor);
    const dispatch = useDispatch()

const finishedUpdatingPageText = () => {
    dispatch(setText(''))
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


  return (
    <div className="bg-green-400 w-2/5 h-screen">
    
        {selectedPageText !== '' && (
            <div className='w-full'> 
                <input value={selectedPageText} onChange={(e) => dispatch(setText(e.target.value))}
                        className='w-full p-4 m-4'
                />
                    <div className='flex'>
                        <button 
                            className='text-white p-4'
                            onClick={updatePageText}
                        >
                                update page
                        </button>
                        <button 
                            className='text-white p-4'
                            onClick={finishedUpdatingPageText}
                        >
                            DONE
                        </button>
                </div>

                <div className='grid grid-cols-3 bg-white w-2/3 space-4 mx-auto'>

                    <div className='h-8 w-8 rounded-full bg-white border hover:shadow-2xl' onClick={() => dispatch(setTextColor('text-white'))} />
                    <div className='h-8 w-8 rounded-full bg-black  hover:scale:110' onClick={() => dispatch(setTextColor('text-black'))} />
                    <div className='h-8 w-8 rounded-full bg-red-500  hover:scale:110' onClick={() => dispatch(setTextColor('text-red-500'))} />

                    <div className='h-8 w-8 rounded-full bg-purple-500  hover:scale:110' onClick={() => dispatch(setTextColor('text-purple-500'))} />
                    <div className='h-8 w-8 rounded-full bg-green-500  hover:scale:110' onClick={() => dispatch(setTextColor('text-green-500'))} />
                    <div className='h-8 w-8 rounded-full bg-blue-500  hover:scale:110' onClick={() => dispatch(setTextColor('text-blue-500'))} />

                </div>
           

            <div className='flex bg-white'> 

                <ArrowDownCircleIcon className='h-14 w-14 text-purple-600 hover:opacity-50 hover:shadow-xl' onClick={decreaseTextSize} />
                <ArrowUpCircleIcon className='h-14 w-14 text-purple-600 hover:opacity-50 hover:shadow-xl' onClick={increaseTextSize} />

            </div>


    </div>

        )}

        <div 
            className='absolute bottom-10'
            onClick={() => switchToEdit()} >
            <p className="text-gray-50 hover:text-gray-200 hover:font-bold p-4 hover:shadow-xl hover: cursor-pointer">Main Menu Icon</p>
        </div>
    </div>
  )
}

export default EditPageBar