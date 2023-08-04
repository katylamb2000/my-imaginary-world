'use client'

import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState } from "react";
import { EditorState } from "draft-js";

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(module => module.Editor),
  { ssr: false }
)

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState)
    console.log(editorState)
  }

  return (
    <div className="flex flex-1 opacity-100">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker'],
     
          }}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 bg-white shadow-lg"
      />
    </div>
  );
}

export default TextEditor;
