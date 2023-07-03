import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { setId, setText, setImageUrl, setButtonId } from '../app/GlobalRedux/Features/pageToEditSlice'

type Props = {
    title: string,
    page: any | null, 
    index: number | null
};

function BookLayoutDoublePage({ title, page, index }: Props) {
    const dispatch = useDispatch()
    const pageActive = useSelector((state: RootState) => state.storyBuilderActive.name);
    const currentPageId = useSelector((state: RootState) => state.pageToEdit.id)
    // console.log('Page id ==>', currentPageId)
    const [active, setActive] = useState<boolean>(false)
    const [url, setUrl] = useState<string | null>(null)

    const viewPage = () => {
        if (!index){
            dispatch(setName('Cover Page'))
        }
        
        else {
            // dispatch(setName(index!.toString()))
            dispatch(setId(page.id))
            console.log(page.id, 'should go to redux here')
            dispatch(setText(page.data.page))
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
        console.log('looking for page id ===', currentPageId )
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
        if (page.data.imageChoices){
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
    <button className="w-32 h-28 mx-auto my-auto p-2 text-center bg-gray-50 " onClick={viewPage} >

        <div className={`flex space-x-1 p-2 hover:border-2  hover:border-purple-500/50 ${active && 'border-2'} ${active && 'border-purple-500'}` }>
        
                <div className="w-12 h-12 border border-t-gray-200 bg-white  ">
                {index !== null  && page.data &&  (
                page.data.page !== '' && (
                    <p> ... </p>
                )
    
            )}
                </div>
            
            {index !== null && (
                <div className="w-12 h-12 border border-gray-200 bg-white  ">
                    
                        
                </div>
            )}
         
        </div>
    {/* <p className="text-sm text-gray-600 pt-2">{title}</p> */}
    {index !== null && (
        <p className="text-sm text-gray-600 pt-2">{index + 1}</p>
    )}

    {index == null && (
        <p className="text-sm text-gray-600 pt-2">{title}</p>
    )}
    </button>
  )
}

export default BookLayoutDoublePage