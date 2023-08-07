import { useDispatch, useSelector } from "react-redux"
import { setLayoutSelected } from "../app/GlobalRedux/Features/layoutSlice"
import { RootState } from "../app/GlobalRedux/store"

function LayoutScrollbar() {
    const dispatch = useDispatch()
    const layoutSelected = useSelector((state: RootState) => state.layout.layoutSelected)
  return (
    <div className='w-4/5 mx-auto flex space-x-5 h-24 bg-purple-500 mb-20 absolute items-center justify-center'>
        <div className={` ${layoutSelected == 'one' ? 'bg-white' : 'bg-pink-500'}  h-14 w-14 `} onClick={() => dispatch(setLayoutSelected('one'))}></div>
        <div className={` ${layoutSelected == 'two' ? 'bg-white' : 'bg-pink-500'}  h-14 w-14 `} onClick={() => dispatch(setLayoutSelected('two'))}></div>
        <div className={` ${layoutSelected == 'three' ? 'bg-white' : 'bg-pink-500'}  h-14 w-14 `} onClick={() => dispatch(setLayoutSelected('three'))}></div>
        <div className={` ${layoutSelected == 'four' ? 'bg-white' : 'bg-pink-500'}  h-14 w-14 `} onClick={() => dispatch(setLayoutSelected('four'))}></div>

    </div>

  )
}

export default LayoutScrollbar