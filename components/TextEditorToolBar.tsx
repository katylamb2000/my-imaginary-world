import Draggable from "react-draggable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setFont, setTextSize, setTextColor, setAlignment, setLineSpacing } from "../app/GlobalRedux/Features/pageToEditSlice";

const TextEditorToolBar = () => {
  const dispatch = useDispatch()
  const font = useSelector((state: RootState) => state.pageToEdit.font)
  const fontSize = useSelector((state: RootState) => state.pageToEdit.textSize)
  const lineSpacing = useSelector((state: RootState) => state.pageToEdit.lineSpacing)
  const fontColor = useSelector((state: RootState) => state.pageToEdit.textColor)
  const alignment = useSelector(( state: RootState) => state.pageToEdit.alignment)

 
  return (
   <Draggable>
        <div className="flex justify-around space-x-2 bg-purple-400 m-4 rounded-md shadow-lg  p-4">
        <div>
          <label htmlFor="font-size">Font Size:</label>
          <select
            id="font-size"
            value={fontSize}
            onChange={e => dispatch(setTextSize(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value="text-sm">small</option>
            <option value="text-md">medium</option>
            <option value="text-lg">large</option>
            <option value="text-xl">huge</option>
          </select>
        </div>
        <div>
          <label htmlFor="font-color">Font Color:</label>
           <select
            id="font-color"
            value={fontColor}
            onChange={e => dispatch(setTextColor(e.target.value))}
            className="px-2 py-1 border rounded"
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
            className="px-2 py-1 border rounded"
          >
            <option value="font-mystery">Mystery</option>
            <option value="font-roboto">Roboto</option>
            <option value="font-caesar">Caesar</option>
            <option value="font-handlee">Handlee</option>
            {/* <option value="monospace">Monospace</option> */}
          </select>
        </div>
        <div>
          <label htmlFor="alignment">Alignment:</label>
          <select
            id="alignment"
            value={alignment}
            onChange={e => dispatch(setAlignment(e.target.value as 'left' | 'center' | 'right'))}

            className="px-2 py-1 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label htmlFor="line-spacing">Line Spacing:</label>
          <select
            id="line-spacing"
            value={lineSpacing}
            onChange={e => dispatch(setLineSpacing(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value="leading-normal">Normal</option>
            <option value="leading-4">1.5</option>
            <option value="leading-9">Double</option>
          </select>
        </div>
      </div>
  </Draggable>
  )
}

export default TextEditorToolBar