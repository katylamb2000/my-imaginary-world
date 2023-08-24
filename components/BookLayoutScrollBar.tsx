import BookLayoutCover from "./BookLayoutCover"
import BookLayoutDoublePage from "./BookLayoutDoublePage"

type Props = {
  storyPages: any
  imageIdeas: any
}

function BookLayoutScrollBar({ storyPages, imageIdeas }: Props) {
  return (
    // <div className="bg-gray-800 p-6 rounded-lg shadow-lg mx-auto h-screen mt-4 overflow-y-scroll ">
    <div className="bg-white p-6 rounded-sm mx-auto h-screen overflow-y-scroll ml-4 drop-shadow-2xl">

      <div className="space-y-4 w-full items-center mt-6">
        {/* <BookLayoutCover page={storyPages[0]} /> */}
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

  )
}

export default BookLayoutScrollBar
