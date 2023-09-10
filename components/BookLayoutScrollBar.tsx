import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import BookLayoutCover from "./BookLayoutCover"
import BookLayoutDoublePage from "./BookLayoutDoublePage"

type Props = {
  storyPages: any
  imageIdeas: any
}

function BookLayoutScrollBar({ storyPages, imageIdeas }: Props) {

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // const pageId = useSelector((state: RootState) => state.pageToEdit.id)
  const pageIdString = useSelector((state: RootState) => state.pageToEdit.id)
  const [completedPages, setCompletedPages] = useState<number>(0);
  const completedPageIds = useRef<Set<string>>(new Set()); // New useRef variable

  const handlePageComplete = (pageId: string) => {
    completedPageIds.current.add(pageId);
    setCompletedPages(completedPageIds.current.size);
  };

  useEffect(() => {
      console.log('>>>>>>', completedPages)
  }, [completedPages])


  useEffect(() => {
    if (!pageIdString) return;
    const match = pageIdString.match(/\d+/);

    if (match) {
      const pageId = parseInt(match[0], 10);

      const currentPageRef = pageRefs.current[pageId] as HTMLDivElement;

      // Ensure it's not null or undefined before accessing scrollIntoView
      if (currentPageRef) {
        currentPageRef.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [pageIdString]);

  



  return (
    // <div className="bg-gray-800 p-6 rounded-lg shadow-lg mx-auto h-screen mt-4 overflow-y-scroll ">
    <div className="bg-white p-6 rounded-sm mx-auto h-screen overflow-y-scroll ml-4 drop-shadow-2xl">

      <div className="space-y-4 w-full items-center mt-6">
        {/* <BookLayoutCover page={storyPages[0]} /> */}
        {storyPages.map((page: any, index: number) => {
         
          let previousPage = index > 0 ? storyPages[index - 1] : null;
          let nextPage = index < storyPages.length - 1 ? storyPages[index + 1] : null;
          return (
          
            <div ref={(el) => (pageRefs.current[index] = el)}>
              <BookLayoutDoublePage
                title="Cover Page"
                page={page}
                previousPage={previousPage}
                nextPage={nextPage}
                index={index}
                key={index}
                imageIdeas={imageIdeas}
                pageLength={storyPages.length}
                onPageComplete={handlePageComplete}
              />
            </div>
          );
        })}
      </div>
    </div>

  )
}

export default BookLayoutScrollBar
