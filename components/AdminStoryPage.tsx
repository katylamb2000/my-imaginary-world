// import { useRef, useState } from 'react';
// import { CameraIcon } from '@heroicons/react/24/solid';
// import Image from 'next/image';

// function AdminStoryPage({ pageImagePrompts, content }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const imagePickerRef = useRef();

//   const addImageToPage = (e) => {
//     console.log(e);
//     const reader = new FileReader();
//     const file = e.target.files[0];
//     if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
//       // addVideoToPost(e)
//       alert('try uploading an image');
//     }

//     if (e.target.files[0]) {
//       reader.readAsDataURL(e.target.files[0]);
//     }
//     reader.onload = (readerEvent) => {
//       setSelectedFile(readerEvent.target.result);
//     };
//   };

//   return (
//     <div key={content.id} className="my-4 w-4/5 h-4/5 mx-auto bg-green-100">
//       <h2 className="text-xl font-bold mb-2">Page {content.pageNumber}</h2>
//       {selectedFile && (
//         <Image alt="/" src={selectedFile} className="h-48 w-48" width={192} height={192} />
//       )}
//       <h3 className="text-lg font-semibold mb-1">Story:</h3>
//       <p>{content.page}</p>

//       {!selectedFile && (
//         <div>
//           <h3 className="text-lg font-semibold mb-1">Image Prompts:</h3>
//           <ul>
//             <li key={pageImagePrompts[0]?.id} className="text-sm italic">
//               {pageImagePrompts[0]?.imagePrompt}
//             </li>
//           </ul>
//           <input
//             id="gif-picker"
//             ref={imagePickerRef}
//             type="file"
//             accept="image/*"
//             hidden
//             onChange={addImageToPage}
//           />
//           <CameraIcon
//             className="h-8 w-8 text-green-600 cursor-pointer"
//             aria-hidden="true"
//             onClick={() => imagePickerRef.current.click()}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminStoryPage;

import React from 'react'

function AdminStoryPage() {
  return (
    <div>AdminStoryPage</div>
  )
}

export default AdminStoryPage
