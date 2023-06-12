import { useDispatch } from "react-redux";
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'

type Props = {
    title: string,
};

function BookLayoutDoublePage({ title }: Props) {
    const dispatch = useDispatch()

    const viewPage = () => {
        console.log('title', title)
        dispatch(setName(title))
    }

  return (
    <button className="w-32 h-28 mx-auto my-auto p-2 text-center bg-gray-50 " onClick={viewPage} >

        <div className="flex space-x-1 p-2 hover:border-2 hover:border-blue-500/50">
            <div className="w-12 h-12 border border-t-gray-200 bg-white  ">

            </div>
            <div className="w-12 h-12 border border-gray-200 bg-white  ">

            </div>
        </div>
    <p className="text-sm text-gray-600 pt-2">{title}</p>
    </button>
  )
}

export default BookLayoutDoublePage