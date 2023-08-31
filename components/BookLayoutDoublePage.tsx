import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { 
  setId, setText, setImageUrl, setButtonId, setPreviousPageText, setNextPageText, setFormattedText, 
  setAudioUrl, setWildcardIdea, setObjectIdea, setCharacterIdea, setBackgroundIdea, setImagePrompt, 
  setFirstImagePromptIdea, setImprovedImageUrl, setEditBarType, setImageRequestSent, setFinalImageUrl
} from '../app/GlobalRedux/Features/pageToEditSlice'
import { setPageId } from "../app/GlobalRedux/Features/getPageImageModal";

type Props = {
    title: string,
    page: any | null, 
    index: number, 
    previousPage: any | null,
    nextPage: any | null
    imageIdeas: ImageIdea[];
};

type ImageIdea = {
    data: {
      pageNumber: number;
      wildCardImage: string, 
      object: string, 
      characterCloseUp: string, 
      backgroundImage: string
    }}

function BookLayoutDoublePage({ title, page, index, previousPage, nextPage, imageIdeas }: Props) {
    const dispatch = useDispatch()
    const pageActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const currentPageId = useSelector((state: RootState) => state.pageToEdit.id);
    const [active, setActive] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);


    useEffect(() => {
      if (currentPageId !== page.id ) return; 
      if ( page.data.imageUrl){
        dispatch(setImageUrl(page.data.imageUrl))
        dispatch(setButtonId(page.data.buttonMessageId))
      }
    }, [page, currentPageId])

    const viewPage = () => {
        dispatch(setButtonId(page.data.buttonMessageId))
        dispatch(setFinalImageUrl(page.data.finalImage_undefined))
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
        console.log("FIRST IMAGE PROMPT IDeas", page.data.firstImagePromptIdea)
        console.log("IMAGE PROMPT", page.data.details)
        if (index == 0){
          dispatch(setName('CoverPage'))
          dispatch(setEditBarType('editCover'))
          dispatch(setImageUrl(page.data.imageUrl))
          dispatch(setButtonId(page.data.buttonMessageId))
        }
        if (index !== 0){
          dispatch(setName('InsidePage'))
          dispatch(setEditBarType('main'))
        }
        if (!index){
            dispatch(setName('CoverPage'))
            dispatch(setText(page.data.text))
            dispatch(setFormattedText(page.data.formattedText))
            dispatch(setId(page.id))
            dispatch(setImageUrl(page.data.imageUrl))
            dispatch(setButtonId(page.data.buttonMessageId))
            if (url) {
                // dispatch(setImageUrl(url))
                dispatch(setButtonId(page.data.buttonMessageId))
                dispatch(setImageUrl(page.data.imageUrl))
            }
            if (!url) {
                // dispatch(setImageUrl(''))
                dispatch(setButtonId(''))
                dispatch(setImageUrl(page.data.imageUrl))
            }
        }
        else {
            dispatch(setId(page.id))
            dispatch(setText(page.data.text))
            dispatch(setAudioUrl(page.data.audioUrl))
            dispatch(setPreviousPageText(previousPage.data.text))
            dispatch(setNextPageText(previousPage.data.text))
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

  return (
  <div className="transition-all duration-500 ease-in-out transform hover:scale-110 group ml-8">
    <button
      className={`w-24 h-18 mx-auto my-auto p-2 text-center bg-purple-300 hover:bg-purple-400 ${
        active ? 'bg-purple-600' : 'bg-purple-300'
      } transition-colors duration-200 rounded-sm shadow-lg`}
      onClick={viewPage}
    >
      <div className={`flex space-x-1 p-2 border-2 border-transparent transition-all duration-200 ${active ? 'border-purple-700' : ''}`}>
        <div className="w-8 h-8 border border-gray-200 bg-white rounded-sm shadow-md flex items-center justify-center">
          {index !== null && page.data && page.data.page !== '' && <p className="text-gray-400">...</p>}
        </div>

        {index !== null && (
          <div className="w-8 h-8 border border-gray-200 bg-white rounded-sm shadow-md relative">
            {page.data.imageUrl && (
              <Image src={page.data.imageUrl} alt="/" fill className="rounded-lg" />
            )}
          </div>
        )}
      </div>

      <p className={`text-sm ${active ? 'text-white' : 'text-gray-600'} group-hover:text-gray-100 pt-1`}>
        {index == 0 ? title : index}
      </p>
    </button>
  </div>



  )
}

export default BookLayoutDoublePage