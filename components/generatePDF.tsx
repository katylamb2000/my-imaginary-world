import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import UploadProgress from './UploadProgress';
import { useSelector } from 'react-redux';
import { RootState } from '../app/GlobalRedux/store';

function GeneratePDF({ storyId, story }: any) {
  const { data: session } = useSession();
  const title = useSelector((state: RootState) => state.viewStory.title)
  // const coverImage = useSelector((state: RootState) => state.viewStory.coverImage)
  const coverImage = useSelector((state: RootState) => state.viewStory.thumbnailImage);
  const signatureLineOne = useSelector((state: RootState) => state.pageToEdit.signatureLineOne)
  const signatureLineTwo = useSelector((state: RootState) => state.pageToEdit.signatureLineTwo)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  console.log( 
    'signatureLineOne:', signatureLineOne,
    'signatureLineTwo:',  signatureLineTwo)

  const createPDFOnServer = async () => {
   console.log( 
    'signatureLineOne:', signatureLineOne,
    'signatureLineTwo:',  signatureLineTwo)
    try {
      const response = await axios.post('/api/generatePDF', {
        story: story,
        title: title, 
        coverImage: coverImage,
        signatureLineOne: signatureLineOne,
        signatureLineTwo: signatureLineTwo,
        session: session, 
        storyId: storyId, 
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'blob', // This will ensure the response is a blob
        onUploadProgress: (progressEvent: any) => {
          let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log(`Upload progress: ${progress}%`);
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.target = '_blank'; // This will open the PDF in a new tab
      link.click();
      URL.revokeObjectURL(link.href); // Clean up the object URL to free resources

    } catch (err) {
      console.error('are we gettting the error here??? ===', err);
    }
  }

  return (
    <div>
      {uploadProgress !== null ? <UploadProgress progress={uploadProgress} /> : <button onClick={createPDFOnServer}>
        Generate PDF
      </button>}
    </div>
  );
}

export default GeneratePDF;
