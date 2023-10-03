import { ArrowLeftIcon as BackOutline, CheckBadgeIcon, CheckCircleIcon } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid, CheckIcon,  CheckCircleIcon as SavedIcon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import { setEditBarType, setSignatureLineOne, setSignatureLineTwo, setSignatureTextColor, setText } from "../app/GlobalRedux/Features/pageToEditSlice"
import { setStoryId, setTitle } from "../app/GlobalRedux/Features/viewStorySlice"
import { setFont, setSignatureTextSize, setTextColor, setAlignment, setLineSpacing } from "../app/GlobalRedux/Features/pageToEditSlice";
import { useEffect, useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { usePathname } from "next/navigation"

function EditTitleBox() {

      const dispatch = useDispatch()
      const { data: session } = useSession()
      const pathname = usePathname()
      const font = useSelector((state: RootState) => state.pageToEdit.font)
      const storyTitle = useSelector((state: RootState) => state.viewStory.title)
      const pageText = useSelector((state: RootState) => state.pageToEdit.text)
      const lineSpacing = useSelector((state: RootState) => state.pageToEdit.lineSpacing)
      const fontColor = useSelector((state: RootState) => state.pageToEdit.signatureTextColor)
      const alignment = useSelector(( state: RootState) => state.pageToEdit.alignment)
      const storyId = useSelector((state: RootState) => state.viewStory.storyId)
      const pageId = useSelector((state: RootState) => state.pageToEdit.id)
      const editBarType = useSelector((state: RootState) => state.pageToEdit.editBarType)
      const [hexColor, setHexColor] = useState<string | null>(null)

      const fontSizeSaved = useSelector((state: RootState) => state.pageToEdit.signatureTextSize)
      const [fontSize, setFontSize] = useState('text-md')
      const [localTitle, setLocalTitle] = useState<string>('')
      const [titleSaved, setTitleSaved] = useState(false)
    
    const goBack = () => {
        dispatch(setEditBarType('main'))
    }


    useEffect(() => {
        console.log('save font size to db', fontSizeSaved)
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


  useEffect(() => {
    console.log(storyTitle, pageText)
    if (!storyTitle && !pageText){
      setLocalTitle('Title')
    }
    if (storyTitle){ 
      setLocalTitle(storyTitle)
    }
    else if (!storyTitle && pageText){
      setLocalTitle(pageText)
    }
  }, [pageText, storyTitle])

    const updateTextColor = async(color: string) => {
      
      if (color == 'text-red-500'){
        setHexColor('#ef4444')
      }
      if (color == 'text-purple-500'){
        setHexColor('#a855f7')
      }
      if (color == 'text-green-500'){
        setHexColor('#22c55e')
      }
      if (color == 'text-orange-500'){
        setHexColor('#f97316')
      }
      if (color == 'text-blue-500'){
        setHexColor('#3b82f6')
      }
      if (color == 'text-pink-500'){
        setHexColor('#ec4899')
      }

      dispatch(setSignatureTextColor(color))
      if (!session?.user?.email || !storyId || !pageId) return;
    
      try{
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId );
        const updatedPage = await updateDoc(docRef, {
          signatureTailwindTextColor: color,
          signatureHexTextColor: hexColor
        });
        console.log('pageText updated', updatedPage)
      }catch(err){
          console.log(err)
      }
    }

    const saveTitle = async() => {
        if (!session?.user?.email || !storyId ) return;
        try{
            const docRef = doc(db, "users", session?.user?.email!, "storys", storyId );
            const updatedPage = await updateDoc(docRef, {
              title: localTitle,
            });
            setTitleSaved(true)
            console.log('pageText updated', updatedPage)
          }catch(err){
              console.log(err)
          }
    }

  return (
    <div className="bg-white h-screen ml-2 mr-8">
    <div className="space-y-6 w-full pt-8">
      {editBarType !== 'editCover' && (
          <div className="flex space-x-2 group cursor-pointer w-full">
            <BackOutline className="h-8 w-8 font-bold text-purple-600 group-hover:text-purple-400 " onClick={goBack} />
            <p className="h-8 w-8 text-sm text-purple-600 group-hover:text-purple-400">Go Back</p>
          </div>
      )}
 
      <div className="bg-purple-400 rounded-sm shadow-lg p-6 space-y-6">

      <div className="items-center space-y-2 w-full space-x-6 flex">
          <div className="w-1/5 ">
          <label htmlFor="font-size" className="font-semibold text-md 0">
              Title:
            </label>
          </div>
          <input className="w-3/5 bg-white rounded-md h-10 p-2" placeholder={localTitle} onChange={(e) => dispatch(setTitle(e.target.value))} value={localTitle} />
          <div>
              {titleSaved ? (
              <SavedIcon className="w-8 h-8 text-green-500" />
              ): 
              <CheckCircleIcon className="w-8 h-8 text-gray-300" onClick={saveTitle} />
              }
          </div>
        </div>

        <div className="items-center space-y-2 w-full space-x-6 flex">
          <div className="w-1/5 ">
          <label htmlFor="font-size" className="font-semibold text-md 0">
              Font Size:
            </label>
          </div>
        
            <select
              id="font-size"
              value={fontSizeSaved}
              onChange={(e) => dispatch(setSignatureTextSize(e.target.value))}
              // onChange={(e) => setFontSize(e.target.value)}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400 w-3/5"
            >
              <option value="text-lg">small</option>
              <option value="text-xl">medium</option>
              <option value="text-2xl">large</option>
              <option value="text-3xl">huge</option>
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

          </div>
      </div>
  </div>
)
}

export default EditTitleBox