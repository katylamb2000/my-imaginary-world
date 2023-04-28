'use client'

import SideBarRow from "./SideBarRow"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

type Props = {
  // hero: any;
  storyContent: any;
  switchToEdit: any;
}

function SideBar({ storyContent, switchToEdit }: Props) {
  // const [myHero, setMyHero] = useState<null | any>(null)
  const [content, setContent] = useState<null | any>(null)

  // useEffect(() => {
  //   if (hero?.docs[0]?.data()){
  //     console.log('got a hero', hero?.docs[0]?.data())
  //     setMyHero(hero?.docs[0]?.data())
  //   }
  //   else{
  //     console.log('no hero')
  //   }
  
  // }, [hero])

  useEffect(() => {
    if (storyContent?.docs[0]?.data()){
      console.log('got story content', storyContent?.docs[0]?.data())
      setContent(storyContent?.docs[0]?.data())
    }
    else{
      console.log('no story content')
    }
  
  }, [storyContent])


  return (
    <div
    className="w-1/5 bg-pink-600 h-screen flex flex-col"
    >
        {/* {myHero ? (
            <SideBarRow name='hero'   />
        ): 
            <SideBarRow name='add hero'    />
         } */}

        <SideBarRow name='add character' />
        <SideBarRow name='add villain' />

        {content ? (
            <SideBarRow name='view story'   />
        ): 
            <SideBarRow  name='create story outline'  />
         }

    <div onClick={() => switchToEdit()}>
        <p className="text-gray-50 hover:text-white hover:font-bold p-4 hover:shadow-xl hover: cursor-pointer">Switch to edit</p>
    </div>
    
    </div>
  )
}

export default SideBar