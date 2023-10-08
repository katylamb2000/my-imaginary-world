import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import { EditorState, ContentState } from "draft-js"; // Import ContentState
import { useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(module => module.Editor),
  { ssr: false }
);

function TextEditor() {
  const text = useSelector((state: RootState ) => state.pageToEdit.text);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (text.length > 0) {
      const contentState = ContentState.createFromText(text); // Use ContentState.createFromText
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [text]);

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
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
