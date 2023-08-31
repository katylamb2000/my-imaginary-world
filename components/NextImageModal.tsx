import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";

function NextImageModal({ nextImage, lastImage, selectImage }: any) {
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const isFullPageWidth = pageId !== 'page_1';

  return (
    <div className={`grid grid-cols-${isFullPageWidth ? "2" : "1"} w-full`}>
      {isFullPageWidth && (
        <div className="col-span-1 " />
      )}
      <div
        className={`col-span-${isFullPageWidth ? "1" : "2"} h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
      >
        <div className="flex justify-between items-center space-x-8">
          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={nextImage}>
            <ArrowLeftIcon className="h-8 w-8 text-purple-500 hover:text-purple-600 font-extrabold" />
          </button>

          <div className="flex flex-col items-center space-y-2">
            <button className="px-6 py-2 rounded-md text-white bg-purple-400 hover:bg-purple-600" onClick={selectImage}>
              Use this image
            </button>
            <button className="px-6 py-2 rounded-md text-purple-400 border border-purple-400 hover:bg-purple-100 hover:text-purple-600">
              Improve this image
            </button>
          </div>

          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={lastImage}>
            <ArrowRightIcon className="h-8 w-8 text-purple-500 hover:text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NextImageModal;
