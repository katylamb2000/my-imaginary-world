import Image from "next/image"
import Link from "next/link"
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setBaseStoryImagePrompt, setBaseStoryImagePromptCreated } from '../app/GlobalRedux/Features/viewStorySlice'

interface Story {
  id: string,
  image: string,
  baseImagePrompt: string,
  title: string, 
  baseImagePromptCreated: Boolean
}

type Props = {
  id: string,
  story: Story;
}
  
function StoryThumbnail({ id, story }: Props) {
  const dispatch = useDispatch()

  const addStoryDetailsToRedux = () => {
    console.log('STORY ===>', story)
    dispatch(setBaseStoryImagePrompt(story.baseImagePrompt))
    dispatch(setBaseStoryImagePromptCreated(story.baseImagePromptCreated))
  }

  return (
    <Link
      onClick={addStoryDetailsToRedux}
      href={`/story/${id}`}
      >
        {story.image ? (
          <img src={story.image}         
          className="h-48 w-48 rounded-lg cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4" />
        ):
        <div 
          className='w-48 h-48 rounded-lg bg-pink-400 text-center items-center justify-center align-center'>
            <p>{id}</p>
        </div>
}
        {story.title ? (
          <p>{story.title}</p>
        ):
        <p>Story title</p>
}
     </Link>
  )
}

export default StoryThumbnail