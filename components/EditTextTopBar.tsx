import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useState, useEffect } from 'react'
import { usePathname } from "next/navigation"
import { useSession } from 'next-auth/react'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'

type Props ={
    fontSize: number,
    pageId: string
}

function EditTextTopBar({ fontSize, pageId }: Props) {
    const [newFontSize, setNewFontSize] = useState<number>(fontSize)
    const pathname = usePathname()
    const { data: session } = useSession()
    const [storyId, setStoryId] = useState<string | null>(null)

    useEffect(() => {
        if (!pathname) return;
        const regex = /^\/story\/([a-zA-Z0-9]+)$/;
        const id = regex.exec(pathname);
      
        if (id) {
          const identifier = id[1];
          setStoryId(identifier);  
        } else {
          console.log("No match");
        }
      }, [pathname])

    useEffect(() => {
        console.log("thisuse effect insnt firing!")
        updateFontSize()
    }, [newFontSize])

    const updateFontSize = async() => {
        // if (!storyId || !selectedPageId || !selectedPageId) return;
        console.log('in update', pageId, session?.user?.email, storyId )
        if (!storyId || !pageId) return;
    
        try{
            const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
            const updated = await updateDoc(docRef, {
              fontSize: newFontSize
            });
            console.log('updated page fontsize:', updated)
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className='top-0 w-full h-14 bg-white flex space-x-6'>

                <div className='flex border border-gray-700 p-4 rounded-lg w-24 h-12 mx-auto space-x-2'>
                    <button className='' onClick={() => setNewFontSize(newFontSize + 1)}>
                        <PlusIcon className='h-4 w-4 text-gray-600' />
                    </button>
                    <p>{newFontSize}</p>
                    <button className='rounded-full' onClick={() => setNewFontSize(newFontSize - 1)} >
                        <MinusIcon className='h-4 w-4 text-gray-600 hover:shadow-2xl hover:text-purple-500' />
                    </button>
                </div>

    </div>
  )
}

export default EditTextTopBar