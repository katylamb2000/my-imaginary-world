import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";

const CustomTextEditor = () => {

  const pageText = useSelector((state: RootState) => state.pageToEdit.text)
  const fontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
  const fontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
  const lineSpacing = useSelector((state: RootState) => state.pageToEdit.lineSpacing)
  const font = useSelector((state: RootState) => state.pageToEdit.font)
  const alignment = useSelector((state: RootState) => state.pageToEdit.alignment)


  return (
    <div className={`p-4 bg-purple-500 space-y-2 text-${alignment} w-full h-full`}>

        <p className={`p-4 mt-4 overflow-clip ${font} ${fontColor} ${fontSize} ${lineSpacing}  `} >
              {pageText}
        </p>

    </div>
  );
};

export default CustomTextEditor;
 