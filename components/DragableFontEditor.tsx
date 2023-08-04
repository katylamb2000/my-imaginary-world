import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent } from "react";
import { RootState } from "../app/GlobalRedux/store";
import Draggable from "react-draggable";
import {
  updateTextSize,
  updateFontStyle,
  updateTextColor,
  updateTextString
} from "../app/GlobalRedux/Features/dragableFontEditorSlice";

function DraggableFontEditor() {
  const dispatch = useDispatch();
  const { textSize, fontStyle, textColor, textString } = useSelector(
    (state: RootState) => state.fontEditor
  );

  const handleTextSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTextSize(Number(e.target.value)));
  };

  const handleFontStyleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateFontStyle(e.target.value));
  };

  const handleTextColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTextColor(e.target.value));
  };

  

  return (
    <Draggable>
      <div className="border border-gray-100 rounded-lg shadow-2xl p-6 bg-white w-1/3">

        <p>{textString}</p>


        <p>Change text size:</p>
        <input
          type="range"
          min="10"
          max="50"
          step="1"
          value={textSize}
          onChange={handleTextSizeChange}
        />

        <p>Change font style:</p>
        <select value={fontStyle} onChange={handleFontStyleChange}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="oblique">Oblique</option>
        </select>

        <p>Change text color:</p>
        <input
          type="color"
          value={textColor}
          onChange={handleTextColorChange}
        />
      </div>
    </Draggable>
  );
}

export default DraggableFontEditor;
