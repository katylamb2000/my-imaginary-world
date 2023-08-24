import { ArrowLeftIcon as BackOutline } from "@heroicons/react/24/outline" 
import { ArrowLeftIcon as BackSolid } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice"
import { setStoryId } from "../app/GlobalRedux/Features/viewStorySlice"
import { setFont, setTextSize, setTextColor, setAlignment, setLineSpacing } from "../app/GlobalRedux/Features/pageToEditSlice";
import { useEffect, useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { usePathname } from "next/navigation"

function EditTextSideBar() {

      const dispatch = useDispatch()
      const { data: session } = useSession()
      const pathname = usePathname()
      const font = useSelector((state: RootState) => state.pageToEdit.font)
      const fontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
      const lineSpacing = useSelector((state: RootState) => state.pageToEdit.lineSpacing)
      const fontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
      const alignment = useSelector(( state: RootState) => state.pageToEdit.alignment)
      const storyId = useSelector((state: RootState) => state.viewStory.storyId)
      const pageId = useSelector((state: RootState) => state.pageToEdit.id)

      const [hexColor, setHexColor] = useState<string | null>(null)
    
    const goBack = () => {
        dispatch(setEditBarType('main'))
    }

    useEffect(() => {
        console.log(fontColor, 'fontColor')
    },[fontColor])

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
      dispatch(setTextColor(color))
      try{
        const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId );
        const updatedPage = await updateDoc(docRef, {
          tailwindTextColor: color,
          hexTextColor: hexColor
        });
        console.log('pageText updated', updatedPage)
      }catch(err){
          console.log(err)
      }
    }

  return (
    <div className="bg-white h-screen ml-2 mr-8">
      <div className="space-y-6 w-full pt-8">
        <div className="flex space-x-2 group cursor-pointer w-full">
          <BackOutline className="h-8 w-8 font-bold text-purple-600 group-hover:text-purple-400 " onClick={goBack} />
          <p className="h-8 w-8 text-sm text-purple-600 group-hover:text-purple-400">Go Back</p>
        </div>

        <div className="bg-purple-400 rounded-md shadow-lg p-6 space-y-6">

          <div className="items-center space-y-2">
              <label htmlFor="font-size" className="font-semibold text-md">
                Font Size:
              </label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => dispatch(setTextSize(e.target.value))}
                className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400"
              >
                <option value="text-sm">small</option>
                <option value="text-md">medium</option>
                <option value="text-lg">large</option>
                <option value="text-xl">huge</option>
              </select>
          </div>
  
          <div className="items-center space-y-2">
            <label htmlFor="font-color" className="font-semibold">
              Font Color:
            </label>
            <select
              id="font-color"
              value={fontColor}
              onChange={(e) =>  updateTextColor(e.target.value)}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400"
            >
            <option value="text-purple-500">Purple</option>   
            <option value="text-red-500">Red</option>
            <option value="text-green-500">Green</option>
            <option value="text-blue-500">Blue</option>
            <option value="text-orange-500">Orange</option>
            <option value="text-pink-500">Pink</option>
            </select>
          </div>
      
        <div>
          <label htmlFor="font">Font:</label>
          <select
            id="font"
            value={font}
            onChange={e => dispatch(setFont(e.target.value))}
            className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400"
          >
            <option value="font-mystery">Mystery</option>
            <option value="font-roboto">Roboto</option>
            <option value="font-caesar">Caesar</option>
            <option value="font-handlee">Handlee</option>
          </select>
        </div>
   
        <div className="items-center space-y-2">
            <label htmlFor="line-spacing" className="font-semibold">
              Line Spacing:
            </label>
            <select
              id="line-spacing"
              value={lineSpacing}
              onChange={(e) => dispatch(setLineSpacing(e.target.value))}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400"
            >
            <option value="leading-normal">Normal</option>
            <option value="leading-4">1.5</option>
            <option value="leading-9">Double</option>
            </select>
          </div>
     

        <div className="items-center space-y-2">
            <label htmlFor="alignment" className="font-semibold">
              Alignment:
            </label>
            <select
              id="alignment"
              value={alignment}
              onChange={(e) => dispatch(setAlignment(e.target.value as 'left' | 'center' | 'right'))}
              className="py-2 border rounded focus:outline-none focus:ring focus:border-purple-400"

            >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            </select>
          </div>


            </div>
        </div>
    </div>
  )
}

export default EditTextSideBar