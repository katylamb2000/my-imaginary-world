'use client'

import SideBarRow from "./SideBarRow"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import EditPageBar from './EditPageBar'
import EditCoverSideBar from "./EditCoverSideBar";
import ImproveStorySideBar from "./ImproveStorySideBar";
import GetImagesSideBar from "./GetImagesSideBar";
import { RootState } from "../app/GlobalRedux/store";
import EditTextSideBar from "./EditTextSideBar";
import ImproveImageSideBar from "./ImproveImageSideBar";

function SideBar() {

  const show = useSelector((state: RootState) => state.pageToEdit.editBarType )

  return (
    <div className="bg-white h-screen ml-2 mr-8 drop-shadow-2xl w-full">
      
      {show == 'main' && (
          <EditPageBar />
      )}

      {show == 'editCover' && (
          <EditCoverSideBar />
      )}

      {show == 'improveStory' && (
          <ImproveStorySideBar />
      )}

      {show == 'getImages' && (
          <GetImagesSideBar />
      )}

      {show == 'editText' && (
          <EditTextSideBar />
      )}

      {show == 'improveRightImage' && (
        <ImproveImageSideBar />
      )} 

{show == 'improveLeftImage' && (
        <ImproveImageSideBar />
      )} 


    </div>
  )
}

export default SideBar