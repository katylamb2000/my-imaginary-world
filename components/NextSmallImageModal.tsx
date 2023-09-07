import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";

function NextSmallImageModal({ nextSmallImage, lastSmallImage, selectSmallImage }: any) {
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const viewPage = useSelector((state: RootState) => state.storyBuilderActive.name)
  const isFullPageWidth = pageId !== 'page_1' ;

  return (
    // <div className={`grid grid-cols-${isFullPageWidth ? "2" : "1"} w-full`}>
            <div className='w-3/4'>

      {/* {isFullPageWidth && viewPage !== 'editRightPage' && (
        <div className="col-span-1 " />
      )} */}
      <div
        className={` h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
      >
        <div className="flex justify-between items-center space-x-8">
          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={nextSmallImage}>
            <ArrowLeftIcon className="h-8 w-8 text-purple-500 hover:text-purple-600 font-extrabold" />
          </button>

          <div className={`flex ${viewPage == 'InsidePage' && 'flex-col'} items-center space-y-2`}>
            <button className="px-6 py-2 rounded-md text-white bg-purple-400 hover:bg-purple-600" onClick={selectSmallImage}>
              Use this image
            </button>
            <button className="px-6 py-2 rounded-md text-purple-400 border border-purple-400 hover:bg-purple-100 hover:text-purple-600">
              Improve this image
            </button>
          </div>

          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={lastSmallImage}>
            <ArrowRightIcon className="h-8 w-8 text-purple-500 hover:text-purple-600" />
          </button>
        </div>
      </div>

  
    </div>
  );
}

export default NextSmallImageModal;
