import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import BookLayoutCover from "./BookLayoutCover"
import BookLayoutCoverPage from "./BookLayoutCoverPage"
import BookLayoutDoublePage from "./BookLayoutDoublePage"

interface Page {
  id: string | null;
  // data: any; 
  // characterCloseUp: string;
  // object: string;
  // pageNumber: number;
  // text: string;
  // wildCardImage: string;

}

type Props = {

  imageIdeas: any,
  story: any
  storyPages: Page[]; 
}




function BookLayoutScrollBar({ storyPages, imageIdeas, story }: Props) {

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [titlePage, setTitlePage] = useState<Page | null>(null);

  // const pageId = useSelector((state: RootState) => state.pageToEdit.id)
  const pageIdString = useSelector((state: RootState) => state.pageToEdit.id)
  const [completedPages, setCompletedPages] = useState<number>(0);
  const completedPageIds = useRef<Set<string>>(new Set()); // New useRef variable

  const handlePageComplete = (pageId: string) => {
    completedPageIds.current.add(pageId);
    setCompletedPages(completedPageIds.current.size);
  };

  useEffect(() => {
    // Now TypeScript knows the structure of storyPages
    const findTitlePage = (pages: Page[]) => {
      return pages.find(page => page.id === 'title');
    };

    const foundTitlePage = findTitlePage(storyPages);
    if (foundTitlePage){
      setTitlePage(foundTitlePage);
    }
  
  }, [storyPages]);

  return (
    // <div className="bg-gray-800 p-6 rounded-lg shadow-lg mx-auto h-screen mt-4 overflow-y-scroll ">
    <div className="bg-white p-6 rounded-sm h-screen overflow-y-scroll drop-shadow-2xl place-content-center">

      <div className="space-y-4 w-full items-center mt-6">
        <BookLayoutCoverPage
            page={story}
            titlePage={titlePage}
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
                key={index +1 }
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
