import BookLayoutDoublePage from "./BookLayoutDoublePage"

type Props = {
  storyPages: any
}

function BookLayoutScrollBar({ storyPages }: Props) {
  return (
    // <div className=" w-4/5  border-t border-t-gray-50 justify-center absolute bottom-0">
    <div
        className="absolute max-w-6xl bottom-0 h-42 z-50 bg-gray-50  overflow-x-scroll flex space-x-4 mx-6"
    >
        {/* <BookLayoutDoublePage title="Cover Page" page={null} index={null}  /> */}
      {storyPages.map((page: any, index: number) => (
          <BookLayoutDoublePage title="Cover Page" page={page} index={index}  />
      ))}
     
    </div>
    // </div>
  )
}

export default BookLayoutScrollBar