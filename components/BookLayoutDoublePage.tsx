import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setPagesComplete, setStoryComplete, setCompletedPages, setTitleIdeas } from "../app/GlobalRedux/Features/viewStorySlice";
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

function BookLayoutDoublePage({ title, page, index, previousPage, nextPage, imageIdeas, pageLength, onPageComplete, pageId, storyPagesLength }: Props) {
    const dispatch = useDispatch()

    const pageActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const completedPagesArray = useSelector((state: RootState) => state.viewStory.completedPages)
    const pagesComplete = useSelector((state: RootState) => state.viewStory.pagesComplete)
    const currentPageId = useSelector((state: RootState) => state.pageToEdit.id);
    const [active, setActive] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);
    const [incomplete, setIncomplete] = useState<boolean>(true)
    
    useEffect(() => {
      if (currentPageId !== page.id ) return; 
      if ( page.data.imageUrl){
        dispatch(setImageUrl(page.data.imageUrl))
        dispatch(setButtonId(page.data.buttonMessageId))
      }
    }, [page, currentPageId])

    useEffect(() => {
      if (storyPagesLength == completedPagesArray.length){
        dispatch(setStoryComplete(true))
      }
    }, [storyPagesLength, completedPagesArray])

    const viewPage = () => {
      if (page.data.midjourneyInitialRequestResponse){
        dispatch(setMidjourneyInitialRequestResponse(page.data.midjourneyInitialRequestResponse))
      }
      if (!page.data.midjourneyInitialRequestResponse){
        dispatch(setMidjourneyInitialRequestResponse(false))
      }
  
      if (!page.data.rightPageLoading){
        dispatch(setRightPageLoading(false))
      }
      else if (page.data.rightPageLoading){
        dispatch(setRightPageLoading(true))
      }
      if (page.data.tailwindTextColor){
        dispatch(setTextColor(page.data.tailwindTextColor))
      }
      else if (!page.data.tailwindTextColor){
        dispatch(setTextColor('text-pink-500'))
      }
        if (page.data.page && !page.data.text){
          dispatch(setText(page.data.page))
        }
        else if (page.data.text){
          dispatch(setText(page.data.text))
        }
          dispatch(setButtonId(page.data.buttonMessageId))
          if (!page.data.smallRoundImageUrl){
            dispatch(setSmallImageUrl(null))
          }
          dispatch(setSmallImageUrl(page.data.smallRoundImageUrl))
          dispatch(setSmallImageButtonId(page.data.smallImageButtonId))
          dispatch(setImprovedSmallImageUrl(page.data.improvedSmallImageUrl))
          dispatch(setImprovedImageButtonId(page.data.improvedImageButtonMessageId))
          if (!page.data.finalSmallImageUrl){
            dispatch(setFinalSmallImageUrl(null))
          }
          dispatch(setFinalSmallImageUrl(page.data.finalSmallImageUrl))
          dispatch(setFinalImageUrl(page.data.finalImageUrl))
          dispatch(setImageUrl(page.data.imageUrl))
          dispatch(setImprovedImageUrl(page.data.improvedImageUrl))
          dispatch(setImageRequestSent(page.data.imageRequestSent))
          const ideas = imageIdeas.find(imageIdeas => imageIdeas.data.pageNumber === index + 1);
          dispatch(setWildcardIdea(page?.data?.wildCardImage))
          dispatch(setObjectIdea(page?.data.object))
          dispatch(setBackgroundIdea(ideas?.data.backgroundImage))
          dispatch(setCharacterIdea(page?.data.characterCloseUp))
          dispatch(setImagePrompt(page.data.details))
          dispatch(setFirstImagePromptIdea(page.data.firstImagePromptIdea))

        // if (index == 0){
        //   // dispatch(setText(page.data.text))
        //   dispatch(setName('CoverPage'))
        //   dispatch(setEditBarType('editCover'))
        //   dispatch(setImageUrl(page.data.imageUrl))
        //   dispatch(setButtonId(page.data.buttonMessageId))
        // }

      
            dispatch(setName('InsidePage'))
            dispatch(setEditBarType('main'))
       
            dispatch(setId(page.id))
            // dispatch(setText(page.data.text))
            dispatch(setRightPageText(page.data.rightPagetext))
            dispatch(setAudioUrl(page.data.audioUrl))
            if (previousPage){
              dispatch(setPreviousPageText(previousPage.data.text))
            }
            if (nextPage){
              dispatch(setNextPageText(nextPage.data.text))
            }
            dispatch(setName('InsidePage'))
            dispatch(setImageUrl(page.data.imageUrl))
            if (url) {
                dispatch(setImageUrl(url))
                dispatch(setButtonId(page.data.buttonMessageId))    
                dispatch(setImageUrl(page.data.imageUrl))
            }
            if (!url) {
                dispatch(setButtonId(''))
                dispatch(setImageUrl(page.data.imageUrl))
            }
     }

    useEffect(() => {
        if (!page ) return;

        if (page.id == currentPageId) {
            setActive(true)
        }
        if (page.id !== currentPageId) {
            setActive(false)
        }
    }, [currentPageId, page])

    useEffect(() => {
        if (page.data.finalImage){
            setUrl(page.data.finalImage)
        }
        if (page.data.imagePrompt_objectImageChoices){
            setUrl(page.data.imagePrompt_objectImageChoices)
        }
        if (page.data.imagePrompt_characterImageChoices){
            setUrl(page.data.imagePrompt_characterImageChoices)
        }
        if (page.data.imagePrompt_backgroundImageChoices){
            setUrl(page.data.imagePrompt_backgroundImageChoices)
        }
        if (page.data.imagePrompt_wildcardImageChoices){
            setUrl(page.data.imagePrompt_wildcardImageChoices)
        }
        else {
            setUrl(null)
        }
    }, [page])

    useEffect(() => {
      if (page.data.finalImageUrl  == undefined || !page.data.text){
        setIncomplete(true)
      }
      if (page.data.finalImageUrl && page.data.text){
     
          setIncomplete(false)
            dispatch(setCompletedPages(pageId)) // Add the string to the array
        onPageComplete(page.id)
        // dispatch(setPagesComplete(pagesComplete + 1))
      }
    }, [page, pagesComplete])

return (
<div className={`transition-transform duration-500 ease-in-out transform hover:scale-110 group ${active ? 'bg-purple-500' : 'bg-purple-300'}`}>
  <button
    onClick={viewPage}
    className={`flex flex-col justify-center items-center w-full h-18 mx-auto p-2 text-center ${active ? 'bg-purple-600' : 'bg-purple-300'} hover:bg-purple-400 transition-colors duration-200 rounded-sm`}
  >
    <div className={`flex space-x-1 p-2 border-2 border-transparent transition-all duration-200 ${active ? 'border-purple-700' : ''}`}>
      <div className="flex items-center justify-center w-8 h-8 border border-gray-200 bg-white rounded-sm">
        {index !== null && page.data && page.data.page !== '' && <p className="text-gray-400">...</p>}
      </div>

      {index !== null && (
        <div className="relative w-8 h-8 border border-gray-200 bg-white rounded-sm">
          {page.data.imageUrl && !page.data.finalImageUrl && (
            <Image src={page.data.imageUrl} alt="/" className="rounded-lg object-fill" fill />
          )}
          {page.data.finalImageUrl && (
            <Image src={page.data.finalImageUrl} alt="/" className="rounded-lg object-fill" fill />
          )}
        </div>
      )}
    </div>

    <p className={`text-sm ${active ? 'text-white' : 'text-gray-600'} group-hover:text-gray-100 pt-1`}>
      {/* {index === 0 ? title : index} */}
      {index + 1}
    </p>
    <p className={`text-sm ${active ? 'text-white' : 'text-gray-600'} group-hover:text-gray-100 pt-1`}>
      {incomplete ? 'stuff missing' : 'complete'}
    </p>
  </button>
</div>


  )
}

export default BookLayoutDoublePage