import Image from "next/image";
import Draggable from "react-draggable";
import EditTextTopBar from "./EditTextTopBar";

type Props = {
    sortedStoryContent: any,
};

function Inside2({ sortedStoryContent }: Props) {
    return (
      <div className='bg-gray-100 h-full w-full items-center overscroll-none '>
        <EditTextTopBar  fontSize={sortedStoryContent[1].data.fontSize} pageId={'page_1'}/>
      <div className="flex space-x-6 justify-center py-12 ">

            <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md text-center">
                <Draggable bounds='parent'>
                    <p className='font-serif text-purple-600 py-24 text-4xl mx-8'>{sortedStoryContent[1].data.page}</p>
                </Draggable >
            </div>
            <div className="border-2 border-gray-300 border-dashed h-120 w-120 bg-white drop-shadow-md">
                <Image className='w-full h-full' alt="/" src={sortedStoryContent[1].data.imageChoices} width={200} height={200} />
            </div>
          
      </div>

  </div>
    )
  }
  
  export default Inside2