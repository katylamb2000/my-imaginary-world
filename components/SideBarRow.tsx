import { useSelector, useDispatch } from "react-redux"
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'

type Props = {
    name: string;
}  



function SideBarRow({ name  }: Props) {
   const dispatch = useDispatch()
   const thisIsChosen = (name: String) => {
    console.log(name)
    dispatch(setName(name));
  
  }
  return (
    <div onClick={() => thisIsChosen(name)}>
        <p className="text-gray-50 hover:text-white hover:font-bold p-4 hover:shadow-xl hover: cursor-pointer">{name}</p>
    </div>
  )
}

export default SideBarRow