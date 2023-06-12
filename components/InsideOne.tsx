import Image from "next/image";
import Draggable from "react-draggable";
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";


type Props = {
    sortedStoryContent: any,
};

function InsideOne({ sortedStoryContent }: Props) {
    // console.log(sortedStoryContent[0].data.fontSize.toString())
    const addText = useSelector((state: RootState) =>  state.addTextBox.addTextBox);

    useEffect(() => {
        console.log('this is addtexxt', addText)
    }, [addText])

    return (
      <div className='bg-gray-100 h-full w-full items-center overscroll-none '>
    
          <div className="flex space-x-6 justify-center py-12 ">
   
                <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md text-center ">
                    <Draggable bounds='parent'>
                        <p className={`font-serif text-purple-600 py-24 text-${sortedStoryContent[0].data.fontSize.toString()} mx-8 cursor-move`}>{sortedStoryContent[0].data.page}</p>
                    </Draggable >
                    {addText && (
                        <Draggable bounds='parent'>
                            <textarea className="border border-purple-500 rounded-lg bg-white z-50" />
                        </Draggable>
                    )}
                </div>
                <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md">
                    {/* {addText && (
                        <Draggable bounds='parent'>
                            <textarea className="border border-purple-500 rounded-lg bg-white h-24 w-48 z-50" />
                        </Draggable>
                    )} */}
                    <Image className='w-full h-full z-10' alt="/" src={sortedStoryContent[0].data.imageChoices} width={200} height={200} />
                </div>
              
          </div>
  
      </div>
    )
  }
  
  export default InsideOne