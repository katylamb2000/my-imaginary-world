'use client'

import ViewStoryPage from "./ViewStoryPage";
import { useEffect, useState, CSSProperties } from "react";
import { db } from '../firebase'
import { collection, updateDoc } from "firebase/firestore";
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import SyncLoader from "react-spinners/SyncLoader";
import { useCollection } from 'react-firebase-hooks/firestore'

type Props = {
    story: any,
    storyId: string,
    storyContentId: string, 
    imagePrompts: any,
    storyBaseImagePrompt: string; // Add this line


};

function Story({ story, storyId, storyContentId, imagePrompts,   storyBaseImagePrompt }: Props) {
    const [title, setTitle] = useState('') 
    const [loading, setLoading] = useState(false)
    const [pages, setPages] = useState([])
    const [imageUris, setImageUris] = useState<string[]>([])
    const [addInput, setAddInput] = useState(false)
    const [text, setText] = useState<null | string>(null)
    const [index, setIndex] = useState<null | string>(null)
    const { data: session } = useSession()
    let [color, setColor] = useState("#ffffff");
    const override: CSSProperties = {
      display: "block",
      margin: "0 auto",
      borderColor: "red",
    };

    const [images, imagesloading, imageserror] = useCollection(
      session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'images') : null,
    
    );

    useEffect(() => {
      let imgs: string[] = [];
      if (!images) return;
      console.log(images.docs)
      images.docs.map(image => {
          imgs.push(image.data().data.images[0].uri)
      })
      setImageUris(imgs)
  })
  

useEffect(() => {
    const title = story.pages[1]
    let newTitle = title.replace(/^Title: /i, "");
    setTitle(newTitle)

}, [story])

useEffect(() => {

  const pages = story.pages
  pages.map((page: string, index: number) => {

    let newPage = page.replace(new RegExp(`^Page : ${index} `, 'i'), "");
    // console.log(newPage)
  })
  
 
    setPages(story.pages)
}, [pages])

const generatePrompts = async () => {
      const imagePromptsPrompt = `create ${pages.length} ai art generator promps for this story. they should all have the same style and characters throughout: ${story.story}
  Your response should be structured in this way
  Title: {{title}}
  
  Page 1:
  {{page1 image prompt}}

  Page 2:
  {{page2 image prompt}}
 
  Page 3:
  {{page3 image prompt}}

  Page 4:
  {{page4 image prompt}}

  Page 5:
  {{page5 image prompt}}

  Page 6:
  {{page6 image prompt}}

  Page 7:
  {{page7 image prompt}}

  Page 8:
  {{page8 image prompt}}

  Page 9:
  {{page9 image prompt}}

  Page 10:
  {{page10 image prompt}}   `
      
          try{
            setLoading(true)
           const response = await fetch('/api/createStoryImagePrompts', {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                prompt: imagePromptsPrompt, 
                model: 'text-davinci-003', 
                session,
                storyId: storyId
              }),
            });
            const data = await response.json();
            console.log('this is the story, need to save title to story', data.answer)
            setLoading(false)
          }catch(err){
            console.log(err)
            setLoading(false)
          }
    }
          
  const editPageContent = (page: string, index: number) => {
    console.log('this is page', page, index)
    setAddInput(true)
    setIndex(index.toString())
    setText(page)
  }

     
  return (

        <div className="w-full h-full flex">
               {loading ? (   
                <SyncLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
  ):
        <button onClick={generatePrompts}>get image prompts</button>
  }

    <div className="overflow-x-scroll h-full w-full bg-pink-300 ">
        {pages.map((page, index) => (
            <ViewStoryPage page={page} key={index} imagePrompts={imagePrompts} storyId={storyId}   storyBaseImagePrompt={storyBaseImagePrompt} />
        ))}
        </div>
        <div className="w-1/4 h-4/5 m-6 bg-green-300 grid grid-cols-2">

          {images &&
          imageUris.map(image => (
            <img 
                src={image}
                className="h-24 w-24 rounded-md cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4"
              />

          ))}
{/*    
            {addInput && (
                <div> 
              <input type='text' value={text} onChange={(e) => setText(e.target.value)} /> 
              <button className="bg-pink-600 text-white p-4 rounded-lg cursor-pointer hover:bg-pink-300">edit text</button>
              </div>
            )} */}

                {/* <button onClick={generatePrompts}>Get image prompts</button> */}

          </div>

        </div>

  )
}

export default Story