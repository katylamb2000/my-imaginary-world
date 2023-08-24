interface Page {
    id: string | null
    data: any
    // data: () => {
    //   text: string;
    //   // ... other properties
    // };
  }
  
  interface ImproveStoryPageProps {
    storyPages: Page[];
  }
  
function ImproveStoryPage({ storyPages }: ImproveStoryPageProps) {
    console.log('story page', storyPages)
  return (

    <div className="space-y-4 mb-12 mt-4">
        {storyPages.map(page => (
            <div key={page.id} className='bg-white border border-gray-100 rounded-sm drop-shadow-md m-4 p-4 ' >
                <p>{page.data.text}</p>
            </div>
        ))}
    </div>
  )
}

export default ImproveStoryPage