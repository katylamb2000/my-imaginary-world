// // pages/generate-pdf.tsx

// import { useState } from 'react';
// import { Template, generate, BLANK_PDF } from '@pdfme/generator';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';
// import UploadProgress from './UploadProgress';

//   function generatePDF({ storyId, story}: any) {

//     const { data: session } = useSession()
//     const [uploadProgress, setUploadProgress] = useState<number | null>(null);

//     const createPDFOnServer = async () => {
//       try {
//           const response = await axios.post('/api/generatePDF', {
//               story: story,
//               session: session
//           }, {
//               headers: {
//                   'Content-Type': 'application/json'
//               },
//               onUploadProgress: (progressEvent: any) => {
//                   // Calculate the progress as a percentage and log it
//                   let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//                   console.log(`Upload progress: ${progress}%`);
//               }
//           });
  
//           const responseData = response.data;
//           console.log('responseData', responseData);
//       } catch (err) {
//           console.error(err);
//       }
//   }
  


//   return (
//     <div>
//         {uploadProgress !== null ? <UploadProgress progress={uploadProgress} /> : <button onClick={createPDFOnServer}>generatePDF</button>}
//     </div>
// );

// }

// export default generatePDF


import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import UploadProgress from './UploadProgress';

function GeneratePDF({ storyId, story }: any) {
  const { data: session } = useSession();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const createPDFOnServer = async () => {
    console.log(story[0].data.text)
    try {
      const response = await axios.post('/api/generatePDF', {
        story: story,
        title: 'i am the title',
        session: session
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
      console.error(err);
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
