import { PencilIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { PencilIcon as UnclickedPencil  } from "@heroicons/react/24/outline";
import { useState } from "react";
import { setNextPageText } from "../app/GlobalRedux/Features/pageToEditSlice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";

interface Page {
    id: string | null
    data: any
    // data: () => {
    //   text: string;
    //   // ... other properties
    // };
  }
  
  interface ImproveStoryPageProps {
    storyPages: Page[];
  }
  
function ImproveStoryPage({ storyPages }: ImproveStoryPageProps) {

    const { data: session } = useSession()

    const [pagePencilIconClicked, setPagePencilIconClicked] = useState<string | null>(null)
    const [pageText, setPageText] = useState<string>('')
    const [changesMade, setChangesMade] = useState<boolean>(false)

    const storyId = useSelector((state: RootState) => state.viewStory.storyId)

    const editText = async(page: Page) => {
        setPagePencilIconClicked(page.id)
        if (!page.id) return;
        const pageId = page.id
        if (pagePencilIconClicked == page.id && !changesMade){
          setPagePencilIconClicked(null)
        }
        if (pagePencilIconClicked !== page.id){
        setPageText(page.data.text)
        }

      if (changesMade == true){
          try{
          const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", page.id );
          const updatedPage = await updateDoc(docRef, {
            text: pageText
        })
        setPageText('')
        setPagePencilIconClicked(null)
        setChangesMade(false)
    }
    catch(err){
      console.log(err)
      setPageText('')
      setPagePencilIconClicked(null)
      setChangesMade(false)
    }
  }
}

    const handleChange = (page: Page, text: string) => {
        setPageText(text)
        // setIcon(PaperAirplaneIcon)
        if (text !== page.data.text ){
          setChangesMade(true)
        }

    }

  return (

    <div className="space-y-4 mb-12 mt-4">
        {storyPages.map(page => (
          <div key={page.id} className='bg-white border border-gray-100 rounded-sm drop-shadow-md m-4 p-4 ' >
              {pagePencilIconClicked == page.id ? (
                <textarea value={pageText} className='w-full h-36 p-4' onChange={(e) => handleChange(page, e.target.value)} />
              ):
                <p>{page.data.text}</p>
              }
                <div  className=" h-8 w-8 group-hover:h-12 group-hover:w-12 group-hover:pb-2 items-center align-middle rounded-full group hover:bg-purple-100 absolute right-1 bottom-0 "
                      onClick={() => editText(page)}
                >
                  {pagePencilIconClicked == page.id ? (
                    changesMade ? (
                      <PaperAirplaneIcon className="h-8 w-8 hover mx-auto my-auto text-purple-500 p-1 " />
                    ):
                      <PencilIcon className="h-8 w-8 hover mx-auto my-auto text-purple-500 p-1 " />
                  ):
                  <UnclickedPencil className="h-6 w-6 group-hover:h-8 group-hover:w-8 hover mx-auto my-auto text-purple-200 group-hover:text-purple-500 p-1 " />
                  }
              </div>
          </div>
        ))}
    </div>
  )
}

export default ImproveStoryPage