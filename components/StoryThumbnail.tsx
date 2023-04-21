import Image from "next/image"
import Link from "next/link"

type Props = {
  id: string,
  story: any
}
  
function StoryThumbnail({ id, story }: Props) {

  return (
    <Link
      href={`/story/${id}`}>
        {story.data().image ? (
          <img src={story.data().image}         
          className="h-48 w-48 rounded-lg cursor-pointer mb-2 hover:opactiy-50 mx-auto p-4" />
        ):
        <div 
          className='w-48 h-48 rounded-lg bg-pink-400 text-center items-center justify-center align-center'>
            <p>{id}</p>
        </div>
}
        {story.data().title ? (
          <p>{story.data().title}</p>
        ):
        <p>Story title</p>
}
     </Link>
  )
}

export default StoryThumbnail