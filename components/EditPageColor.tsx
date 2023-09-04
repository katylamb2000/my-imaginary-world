import { SketchPicker } from "react-color"
import { use, useState } from "react";

function EditPageColor() {
    const [color, setColor] = useState('#fff')

    const handleChangeComplete = (color: any) => {
        setColor(color);
        console.log(color.hex); //This will print the hex color when a color is clicked.
      };
    
  return (
      <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
  )
}

export default EditPageColor