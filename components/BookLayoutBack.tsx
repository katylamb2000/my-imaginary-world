import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setId, setText, setImageUrl, setButtonId, setPreviousPageText, setNextPageText, setFormattedText, setAudioUrl, setWildcardIdea, setObjectIdea, setCharacterIdea, setBackgroundIdea } from '../app/GlobalRedux/Features/pageToEditSlice'
import { setPageId } from "../app/GlobalRedux/Features/getPageImageModal";

type Props = {
    page: any | null
}


function BookLayoutBack({ page }: Props) {
    const dispatch = useDispatch()
    const pageActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const currentPageId = useSelector((state: RootState) => state.pageToEdit.id);
    // console.log('Page id ==>', currentPageId)
    const [active, setActive] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!page ) return;

        if (page.id == currentPageId) {
            setActive(true)
        }
        if (page.id !== currentPageId) {
            setActive(false)
            // console.log('border should be green')
        }
    }, [currentPageId, page])

    const viewPage = () => {
        console.log('got to dispatch a lot of stuff in order to back page.  ')
    }

  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-110 group ml-8">
    <button
      className={`w-24 h-18 mx-auto my-auto p-2 text-center bg-purple-300 hover:bg-purple-400 ${
        active ? 'bg-purple-600' : 'bg-purple-300'
      } transition-colors duration-200 rounded-lg shadow-lg`}
      onClick={viewPage}
    >
      <div className={`flex space-x-1 p-2 border-2 border-transparent transition-all duration-200 ${active ? 'border-purple-700' : ''}`}>
        <div className="w-12 h-12 border border-gray-200 bg-white rounded-lg shadow-md flex items-center justify-center">
           <p className="text-gray-400"></p>
        </div>

      
          <div className="w-12 h-12 border border-gray-200 bg-white rounded-lg shadow-md relative">
            {/* {page.data.imageUrl && (
              <Image src={page.data.imageUrl} alt="/" fill className="rounded-lg" />
            )} */}
          </div>

      </div>

      <p className={`text-sm ${active ? 'text-white' : 'text-gray-600'} group-hover:text-gray-100 pt-2`}>
        Back cover
      </p>
    </button>
  </div>
  )
}

export default BookLayoutBack