import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setPagesComplete, setStoryComplete, setCompletedPages, setTitleIdeas, setThumbnailImage } from "../app/GlobalRedux/Features/viewStorySlice";
import { 
  setId, setText, setImageUrl, setButtonId, setPreviousPageText, setNextPageText, setFormattedText, 
  setAudioUrl, setWildcardIdea, setObjectIdea, setCharacterIdea, setBackgroundIdea, setImagePrompt, 
  setFirstImagePromptIdea, setImprovedImageUrl, setEditBarType, setImageRequestSent, setFinalImageUrl, 
  setSmallImageUrl, setTextColor, setRightPageText, setImprovedImageButtonId, setImprovedSmallImageUrl,
  setSmallImageButtonId, setRightPageLoading, setMidjourneyInitialRequestResponse, setFinalSmallImageUrl
} from '../app/GlobalRedux/Features/pageToEditSlice'
import { setPageId } from "../app/GlobalRedux/Features/getPageImageModal";

type Props = {
    title: string,
    page: any | null, 
    index: number, 
    previousPage: any | null,
    nextPage: any | null
    imageIdeas: ImageIdea[]
    pageLength: number,
    onPageComplete: (pageId: string) => void;
    pageId: string,
    storyPagesLength: number
};

type ImageIdea = {
    data: {
      pageNumber: number;
      wildCardImage: string, 
      object: string, 
      characterCloseUp: string, 
      backgroundImage: string,
    }}

function BookLayoutCoverPage({ page }: Props) {
    const dispatch = useDispatch()
    const [active, setActive] = useState(false)
    const [incomplete, setIncomplete] = useState(true)
    const coverImage = useSelector((state: RootState) => state.viewStory.thumbnailImage)
    const storyTitle = useSelector((state: RootState) => state.viewStory.title)
    const storyBuilderActive = useSelector((state: RootState) => state.storyBuilderActive.name)

    const viewPage = () => {
        dispatch(setName('CoverPage'))
        setActive(true)
        console.log('go to cover page')
        dispatch(setId(''))
        // dispatch(setThumbnailImage(page.data().thumbnailImage))
        // dispatch(setTitleIdeas(page.data.titleIdeas.coverImagePrompt))
        console.log('title ideas --->>>', page.data())
    }

    useEffect(() => {
      if (storyBuilderActive == 'CoverPage'){
        setActive(true)
      }
    }, [storyBuilderActive])

    useEffect(() => {
      if (coverImage && storyTitle){
        setActive(true)
      }
    }, [coverImage, storyTitle])

return (

<div className={`transition-transform duration-500 ease-in-out transform hover:scale-110 group ${active ? 'bg-purple-500' : 'bg-purple-300'}`}>
  <button
    onClick={viewPage}
    className={` justify-center items-center w-full h-18 mx-auto p-2 text-center ${active ? 'bg-purple-600' : 'bg-purple-300'} hover:bg-purple-400 transition-colors duration-200 rounded-sm`}
  >

<div className={`flex items-center justify-center p-2 border-2 border-transparent transition-all duration-200 ${active ? 'border-purple-700' : ''}`}>
    <div className="relative w-8 h-8 border border-gray-200 bg-white rounded-sm">
        {/* <Image src={page.data().coverImageUrl} alt="/" className="rounded-lg object-fill" fill /> */}
        <Image src={coverImage} alt="/" className="rounded-lg object-fill" fill />

    </div>
</div>

    <p className={`text-sm ${active ? 'text-white' : 'text-gray-600'} group-hover:text-gray-100 pt-1`}>
      Cover Page
    </p>
    <p className={`text-sm ${active ? 'text-white' : 'text-gray-600'} group-hover:text-gray-100 pt-1`}>
      {incomplete ? 'stuff missing' : 'complete'}
    </p>
  </button>
</div>


  )
}

export default BookLayoutCoverPage