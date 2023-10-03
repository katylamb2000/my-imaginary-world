import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import BookLayoutCover from "./BookLayoutCover"
import BookLayoutCoverPage from "./BookLayoutCoverPage"
import BookLayoutDoublePage from "./BookLayoutDoublePage"

type Props = {
  storyPages: any
  imageIdeas: any,
  story: any
}

function BookLayoutScrollBar({ storyPages, imageIdeas, story }: Props) {

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // const pageId = useSelector((state: RootState) => state.pageToEdit.id)
  const pageIdString = useSelector((state: RootState) => state.pageToEdit.id)
  const [completedPages, setCompletedPages] = useState<number>(0);
  const completedPageIds = useRef<Set<string>>(new Set()); // New useRef variable

  const handlePageComplete = (pageId: string) => {
    completedPageIds.current.add(pageId);
    setCompletedPages(completedPageIds.current.size);
  };



  // useEffect(() => {
  //   if (!pageIdString) return;
  //   const match = pageIdString.match(/\d+/);

  //   if (match) {
  //     const pageId = parseInt(match[0], 10);

  //     const currentPageRef = pageRefs.current[pageId] as HTMLDivElement;

  //     // Ensure it's not null or undefined before accessing scrollIntoView
  //     if (currentPageRef) {
  //       currentPageRef.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'start',
  //       });
  //     }
  //   }
  // }, [pageIdString]);

  return (
    // <div className="bg-gray-800 p-6 rounded-lg shadow-lg mx-auto h-screen mt-4 overflow-y-scroll ">
    <div className="bg-white p-6 rounded-sm h-screen overflow-y-scroll drop-shadow-2xl place-content-center">

      <div className="space-y-4 w-full items-center mt-6">
        <BookLayoutCoverPage
           page={story}
           title="Cover Page"
     
            previousPage={null}
           nextPage={1}
           index={0}
           key={0}
           imageIdeas={imageIdeas}
           pageLength={storyPages.length}
           onPageComplete={handlePageComplete}
            pageId={'Cover Page'}
            storyPagesLength={storyPages.length}
           />
        {storyPages.map((page: any, index: number) => {
         
          let previousPage = index > 0 ? storyPages[index - 1] : null;
          let nextPage = index < storyPages.length - 1 ? storyPages[index] : null;
          return (
          
            <div ref={(el) => (pageRefs.current[index + 1] = el)}>
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
                pageId={page.id}
                storyPagesLength={storyPages.length}
              />
            </div>
          );
        })}
      </div>
    </div>

  )
}

export default BookLayoutScrollBar
