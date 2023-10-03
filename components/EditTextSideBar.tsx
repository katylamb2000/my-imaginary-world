import { ArrowLeftIcon as BackOutline, CheckBadgeIcon, CheckCircleIcon } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid, CheckIcon,  CheckCircleIcon as SavedIcon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import { setEditBarType, setSmallImageTop, setText, setRightPageText } from "../app/GlobalRedux/Features/pageToEditSlice"
import { setStoryId } from "../app/GlobalRedux/Features/viewStorySlice"
import { setFont, setTextSize, setTextColor, setAlignment, setLineSpacing } from "../app/GlobalRedux/Features/pageToEditSlice";
import { useEffect, useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { usePathname } from "next/navigation"
import QuillToolbar from "./QuillToolbar"
import TextEditorToolBar from "./TextEditorToolBar"


function EditTextSideBar() {

      const dispatch = useDispatch()
      const { data: session } = useSession()
      const pathname = usePathname()
      const font = useSelector((state: RootState) => state.pageToEdit.font)
      // const fontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
      const lineSpacing = useSelector((state: RootState) => state.pageToEdit.lineSpacing)
      const fontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
      const alignment = useSelector(( state: RootState) => state.pageToEdit.alignment)
      const storyId = useSelector((state: RootState) => state.viewStory.storyId)
      const pageText = useSelector((state: RootState) => state.pageToEdit.text)
      const rightPageText = useSelector((state: RootState) => state.pageToEdit.rightPageText)
      const pageId = useSelector((state: RootState) => state.pageToEdit.id)
      const editBarType = useSelector((state: RootState) => state.pageToEdit.editBarType)
      const [hexColor, setHexColor] = useState<string | null>(null)
      const [tailwindColor, setTailwindColor] = useState<string | null>(null)
      const fontSizeSaved = useSelector((state: RootState) => state.pageToEdit.textSize)
      const [fontSize, setFontSize] = useState('text-md')
      const [textSaved, setTextSaved] = useState<boolean>(false)
      const [rightPageTextSaved, setRightPageTextSaved] = useState<boolean>(false)
    
    const goBack = () => {
        dispatch(setEditBarType('main'))
    }

    const saveText = async () => {
      // console.log(selectedPageText, selectedPageId);
      try{
      if (!storyId || !pageId || !session) return;
      const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
      const updatedPage = await updateDoc(docRef, {
        text: pageText
      });
      console.log('this is the updated', updatedPage);
      setTextSaved(true)
      if (pageId == 'page_1') {
        saveTitle()
      }
      // dispatch(dispatch(setText(updatedPage?.data.text))
    }catch(err){
      console.log(err)
    }}

    const saveTitle = async () => {
      try{
        if (!storyId || !pageId || !session) return;
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId);
        const updatedPage = await updateDoc(docRef, {
          title: pageText
        });
      }catch(err){
        console.log(err)
    }}

    const saveRightPageText = async () => {
      // console.log(selectedPageText, selectedPageId);
      try{
      if (!storyId || !pageId || !session) return;
      const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
      const updatedPage = await updateDoc(docRef, {
        rightPagetext: rightPageText
      });
      console.log(' this is the updated', updatedPage);
      setRightPageTextSaved(true)
      // dispatch(dispatch(setText(updatedPage?.data.text))
    }catch(err){
      console.log(err)
    }}

    const updateTextSize = async(size: string) => {
      try{
        if (!storyId || !pageId || !session) return;
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
        const updatedPage = await updateDoc(docRef, {
          textSize: size
        });
        console.log(' this is the updated', updatedPage);
        // setUpdatedTextSize(true)
        // dispatch(dispatch(setText(updatedPage?.data.text))
      }catch(err){
        console.log(err)
    }}
  

    useEffect(() => {
        console.log('FONTSIZESVED', fontSizeSaved)
    },[fontSizeSaved])

    useEffect(() => {
      if (!pathname) return;
      if (storyId) return;
      const regex = /^\/story\/([a-zA-Z0-9]+)$/;
      const id = regex.exec(pathname);
    
      if (id) {
        const identifier = id[1];
        dispatch(setStoryId(identifier))
      } else {
        console.log("No match");
      }
    }, [pathname])

    const updateTextColor = async(color: string) => {
      
      if (color == 'text-red-500'){
        setHexColor('#ef4444')
        setTailwindColor('text-red-500')
      }
      if (color == 'text-purple-500'){
        setHexColor('#a855f7')
        setTailwindColor('text-purple-500')
      }
      if (color == 'text-green-500'){
        setHexColor('#22c55e')
        setTailwindColor('text-green-500')
      }
      if (color == 'text-orange-500'){
        setHexColor('#f97316')
        setTailwindColor('text-orange-500')
      }
      if (color == 'text-blue-500'){
        setHexColor('#3b82f6')
        setTailwindColor('text-blue-500')
      }
      if (color == 'text-pink-500'){
        setHexColor('#ec4899')
        setTailwindColor('text-pink-500')
      }
      dispatch(setTextColor(color))
    }

    useEffect( () => {
        if (!hexColor || !tailwindColor) return;

        const updateColors = async () => {
          if (!session?.user?.email || !storyId || !pageId) return;
        try{
    
          const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
          const updatedPage = await updateDoc(docRef, {
            tailwindTextColor: tailwindColor,
            hexTextColor: hexColor
          });
          console.log('pageText updated', updatedPage)
        }catch(err){
            console.log(err)
        }
        };
      updateColors()
    }, [hexColor, tailwindColor])

  return (
    <div className="bg-purple-400 h-full overflow-y-scroll ml-2 mr-8">
      <div className=" w-full pt-8">
        {editBarType !== 'editCover' && (
            <div className="flex space-x-2 group cursor-pointer w-full items-center p-2">
              <BackOutline className="h-8 w-8 font-bold text-white group-hover:text-purple-800 " onClick={goBack} />
              <p className="text-sm text-white group-hover:text-purple-800">Go Back</p>
            </div>
        )}
   

        <div className="bg-purple-400 rounded-sm shadow-lg p-4 space-y-6">

          <div className="items-center space-y-2 w-full space-x-6 flex">
            <div className="w-1/5 ">
            <label htmlFor="font-size" className="font-semibold text-md 0">
                Font Size:
              </label>
            </div>
          
              <select
                id="font-size"
                value={fontSizeSaved}
                // onChange={(e) => dispatch(setTextSize(e.target.value))}
                onChange={(e) => updateTextSize(e.target.value)}
                // onChange={(e) => setFontSize(e.target.value)}
                className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5"
              >
                <option value="text-md">small</option>
                <option value="text-xl">medium</option>
                <option value="text-2xl">large</option>
                {/* <option value="text-4xl">huge</option> */}
              </select>

              <div>
                {fontSizeSaved ? (
                <SavedIcon className="w-8 h-8 text-gray-500" />
                ): 
                <CheckCircleIcon className="w-8 h-8 text-gray-500" />
                }

              </div>
          </div>
  
          <div className="items-center space-y-2 w-full space-x-6 flex">
            <div className="w-1/5 ">
            <label htmlFor="font-size" className="font-semibold text-md 0">
              Font Color:
            </label>
            </div>
            <select
              id="font-color"
              value={fontColor}
              onChange={(e) =>  updateTextColor(e.target.value)}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5"
            >
            <option value="text-white">White</option>
            <option value="text-black">Black</option>
            <option value="text-purple-500">Purple</option>   
            <option value="text-red-500">Red</option>
            <option value="text-green-500">Green</option>
            <option value="text-blue-500">Blue</option>
            <option value="text-orange-500">Orange</option>
            <option value="text-pink-500">Pink</option>
            <option value="custom color">Custom color</option>
            </select>
          </div>
      
          <div className="items-center space-y-2 w-full space-x-6 flex">
              <div className="w-1/5 ">
                <label htmlFor="font" className="font-semibold text-md 0">
                Font:
              </label>
            </div>
          <select
            id="font"
            value={font}
            onChange={e => dispatch(setFont(e.target.value))}
            className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5"
          >
            <option value="font-mystery">Mystery</option>
            <option value="font-roboto">Roboto</option>
            <option value="font-caesar">Caesar</option>
            <option value="font-handlee">Handlee</option>
          </select>
        </div>

        <div className="items-center space-y-2 w-full space-x-6 flex">
              <div className="w-1/5 ">
                <label  htmlFor="line-spacing" className="font-semibold text-md 0">
                  Line Spacing:
                </label>
            </div>
            <select
              id="line-spacing"
              value={lineSpacing}
              onChange={(e) => dispatch(setLineSpacing(e.target.value))}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5"
            >
            <option value="leading-normal">Normal</option>
            <option value="leading-4">1.5</option>
            <option value="leading-9">Double</option>
            </select>
        </div>
     
        <div className="items-center space-y-2 w-full space-x-6 flex">
              <div className="w-1/5 ">
                <label className="font-semibold text-md 0">
                  Alignment:
                </label>
              </div>
            <select
              onChange={(e) => dispatch(setSmallImageTop(e.target.value))}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5"
            >
            <option value={'imageTop'}>Image on top</option>
            <option value={'imageBottom'}>Text on Top</option>
            </select>
        </div>
              
    <div className="items-center space-y-2 w-full space-x-6 flex">
       
  
                {pageId == 'page_1' ? (
                  <div className="w-1/5 ">
                  <label  htmlFor="alignment" className="font-semibold text-md 0">
                    Title:
                  </label>
                  </div>
                ): 
                <div className="w-1/5 ">
                  <label  htmlFor="alignment" className="font-semibold text-md 0">
                    Left Page Text:
                 </label>
                </div>
                }
           
 
          {/* <div > */}
            {/* <QuillToolbar /> */}
            {/* <TextEditorToolBar /> */}
            {pageId == 'page_1' ? (
              <input type='text' value={pageText} placeholder={pageText} onChange={(e) => dispatch(setText(e.target.value))} className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5 px-2" aria-multiline />
            ): 
              <textarea value={pageText} placeholder={pageText} onChange={(e) => dispatch(setText(e.target.value))} className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5 h-48 px-2" aria-multiline />
            }
            {/* </div> */}
            {textSaved ? (
                  <SavedIcon className="w-8 h-8 text-green-500" />
                  ): 
                  <CheckCircleIcon className="w-8 h-8 text-gray-400" onClick={saveText} />
            }
     </div>


{pageId !== 'page_1' && (
    <div className="items-center space-y-2 w-full space-x-6 flex">
          <div className="w-1/5 ">
            <label  htmlFor="alignment" className="font-semibold text-md 0">
              Right Page Text:
            </label>
          </div>

        {/* <div className="w-full"> */}
          <textarea value={rightPageText || ''} placeholder={rightPageText || 'Move any text you want on the right page here. '} onChange={(e) => dispatch(setRightPageText(e.target.value))} className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5 h-48 px-2" aria-multiline />
        {/* </div> */}
          {rightPageTextSaved ? (
            <SavedIcon className="w-8 h-8 text-green-500" />
            ): 
            <CheckCircleIcon className="w-8 h-8 text-gray-500" onClick={saveRightPageText} />
          }
    </div>
)}

        <div>
      </div>
    </div>
  </div>
</div>
  )
}

export default EditTextSideBar