import BookLayoutDoublePage from "./BookLayoutDoublePage"

type Props = {
  storyPages: any
  imageIdeas: any
}

function BookLayoutScrollBar({ storyPages, imageIdeas }: Props) {
  return (
    <div className="flex absolute right-0 top-20 p-4 m-4">
      <div className="bg-purple-300 w-32 h-screen overflow-y-scroll shadow-lg rounded-sm">
        <div className='space-y-2 w-full '>
          {storyPages.map((page: any, index: number) => {
            let previousPage = index > 0 ? storyPages[index - 1] : null;
            let nextPage = index < storyPages.length - 1 ? storyPages[index + 1] : null;
            return (
              <BookLayoutDoublePage 
                title="Cover Page" 
                page={page} 
                previousPage={previousPage}
                nextPage={nextPage}
                index={index} 
                key={index} 
                imageIdeas={imageIdeas}
              />
            );
          })}
        </div>
      </div>
    </div>

  )
}

export default BookLayoutScrollBar
