import BookLayoutDoublePage from "./BookLayoutDoublePage"

function BookLayoutScrollBar() {
  return (
    <div className=" w-4/5  border-t border-t-gray-50 justify-center absolute bottom-0">
    <div
        className="h-42 z-50 bg-gray-50  overflow-x-scroll flex space-x-4 mx-auto"
    >

        <BookLayoutDoublePage title="Cover Page"  />
        <BookLayoutDoublePage title="Inside 1" />
        <BookLayoutDoublePage title="Inside 2" />
        <BookLayoutDoublePage title="Inside 3" />
        <BookLayoutDoublePage title="Inside 4" />
        <BookLayoutDoublePage title="Inside 5" />
        <BookLayoutDoublePage title="Inside 6" />
        <BookLayoutDoublePage title="Inside 7" />
        <BookLayoutDoublePage title="Inside 8" />
     
    </div>
    </div>
  )
}

export default BookLayoutScrollBar