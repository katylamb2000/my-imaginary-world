import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setId, setText, setImageUrl, setButtonId, setPreviousPageText, setNextPageText, setFormattedText, setAudioUrl, setWildcardIdea, setObjectIdea, setCharacterIdea, setBackgroundIdea } from '../app/GlobalRedux/Features/pageToEditSlice'

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
      wildcardImage: string, 
      objectImage: string, 
      characterCloseUp: string, 
      backgroundImage: string
    }}



function BookLayoutDoublePage({ title, page, index, previousPage, nextPage, imageIdeas }: Props) {
    const dispatch = useDispatch()
    const pageActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const currentPageId = useSelector((state: RootState) => state.pageToEdit.id);
    // console.log('Page id ==>', currentPageId)
    const [active, setActive] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);

    const viewPage = () => {
        console.log(page.data.text, index)

        const ideas = imageIdeas.find(imageIdeas => imageIdeas.data.pageNumber === index + 1);
        dispatch(setWildcardIdea(ideas?.data?.wildcardImage))
        dispatch(setObjectIdea(ideas?.data.objectImage))
        dispatch(setBackgroundIdea(ideas?.data.backgroundImage))
        dispatch(setCharacterIdea(ideas?.data.characterCloseUp))

        if (!index){
            dispatch(setName('CoverPage'))
            dispatch(setText(page.data.text))
            dispatch(setFormattedText(page.data.formattedText))
            dispatch(setId(page.id))

 
            if (url) {
                dispatch(setImageUrl(url))
                dispatch(setButtonId(page.data.buttonMessageId))
            }
            if (!url) {
                dispatch(setImageUrl(''))
                dispatch(setButtonId(''))
            }
        }
        
        else {
            // dispatch(setName(index!.toString()))
            dispatch(setId(page.id))
            // console.log(page.id, 'should go to redux here')
            // console.log('should be page text', page.data.pageRequest.text)
       
            dispatch(setText(page.data.text))
            dispatch(setAudioUrl(page.data.audioUrl))
            dispatch(setPreviousPageText(previousPage.data.text))
            dispatch(setNextPageText(previousPage.data.text))
            dispatch(setName('InsidePage'))
            if (url) {
                dispatch(setImageUrl(url))
                dispatch(setButtonId(page.data.buttonMessageId))
            }
            if (!url) {
                dispatch(setImageUrl(''))
                dispatch(setButtonId(''))
            }
        }
        
     }

    useEffect(() => {
   
        // console.log('looking for page id ===', page.id)
        // console.log('looking for page id ===', currentPageId )
        if (!page ) return;
        // console.log('looking for page id ===', page.id, currentPageId )
        if (page.id == currentPageId) {
            setActive(true)
            // console.log('border should be green')
        }
        if (page.id !== currentPageId) {
            setActive(false)
            // console.log('border should be green')
        }
    }, [currentPageId])

    useEffect(() => {
        // console.log('this is ddata', page.data.imageChoices, '===>', page.data.finalImage)
        if (page.data.finalImage){
            setUrl(page.data.finalImage)
        }
        else if (page.data.imageChoices){
            setUrl(page.data.imageChoices)
        }
        else {
            setUrl(null)
        }
    }, [page])

    // useEffect(() => {
    //     console.log('border should be changing', pageActive, index)
    //     if (pageActive + 1  == index?.toString()){
    //         console.log('border should be green')
    //         setActive(true)
    //     }
    // }, [pageActive] )

  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-110">
        <button 
            className="w-32 h-28 mx-auto my-auto p-2 text-center bg-purple-300 hover:bg-purple-400 active:bg-purple-500 transition-colors duration-200 rounded-lg shadow-lg" 
            onClick={viewPage} 
        >

            <div className={`flex space-x-1 p-2 border-2 border-transparent hover:border-purple-500/50 transition-all duration-200 ${active ? 'border-purple-500' : ''}`}>
                <div className="w-12 h-12 border border-gray-200 bg-white rounded-lg shadow-md">
                    {index !== null && page.data && page.data.page !== '' && <p> ... </p>}
                </div>

                {index !== null && <div className="w-12 h-12 border border-gray-200 bg-white rounded-lg shadow-md"></div>}
            </div>

            <p className="text-sm text-gray-600 pt-2">{index == null ? title : index + 1}</p>
        </button>
    </div>


  )
}

export default BookLayoutDoublePage