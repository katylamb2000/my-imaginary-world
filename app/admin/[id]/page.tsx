// 'use client'
// import Image from "next/image"
// import { addDoc, collection, serverTimestamp, updateDoc, doc, query, getDoc, getDocs } from "firebase/firestore"
// import { CameraIcon } from "@heroicons/react/24/solid"
// import { db, storage } from '../../../firebase'
// import { useState, useEffect, useRef } from 'react'
// import { useCollection } from 'react-firebase-hooks/firestore'
// import { ref, getDownloadURL, uploadString,  } from "@firebase/storage"
// import Story from "../../../components/Story"
// import AdminStoryPage from "../../../components/AdminStoryPage"

// interface StoryData {
//   id: string;
//   page: string;
//   imagePrompt: string;
//   // Add other properties of the story data here
// }

// function AdminPage() {
//     const [request, setRequest] = useState<null | any>(null)
//     const [stories, setStories] = useState<StoryData[]>([]);
//     const [sortedStoryContent, setSortedStoryContent] = useState([]);
//     const [imagePrompts, setImagePrompts] = useState([])
//     const [sortedImagePrompts, setSortedImagePrompts] = useState([])
//     const [storyContent, setStoryContent] = useState([])
//     const [storyOutline, setStoryOutline] = useState([])
//     const [selectedStory, setSelectedStory] = useState<null | any>(null)
//     const [storyRequest, setStoryRequest] = useState<null | any>(null)
//     const [selectedFile, setSelectedFile] = useState<null | any>(null)
//     const [prompt, setPrompt] = useState<null | string>(null)
//     const [loading, setLoading] = useState(false)
//     const imagePickerRef = useRef()

//   const [requests, requestsloading, requestserror] = useCollection(
//      collection(db, 'requests')
//   );

//   const [requestImagesForStory, requestImagesloading, requestImageserror] = useCollection(
//     collection(db, 'requestImagesForStory')
//  );

//  const [storyrequests, storyrequestsloading, storyrequestserror] = useCollection(
//   collection(db, 'storyRequests')
// );

// useEffect(() => {
//   if (!requestImagesForStory) return;

//   requestImagesForStory.docs.map(req => {
//     const userEmail = req.data().userId
//     const id = req.data().storyId
//     getStory(userEmail, id)
//   })
// }, [requestImagesForStory])


// const getStory = async (userEmail: string, id: string) => {
//   try {
//     const docRef = doc(db, "users", userEmail, "storys", id);

//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const storyDataWithId: StoryData = {
//         id: docSnap.id,
//         ...docSnap.data(),
//         page: docSnap.data().page,
//         imagePrompt: docSnap.data().imagePrompt,
//         // Add other properties of the story data here
//       };
//       setStories((prevStories) => [...prevStories, storyDataWithId]);

//     } else {
//       console.log("No such document!");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// useEffect(() => {
//   if (!selectedStory) return;
//     getFullStoryInfo()
//     getStoryOutline()
//     getImagePrompts()
// }, [selectedStory])

// const getFullStoryInfo = async () => {
//   setStoryContent([])
  
//   const storyId = selectedStory.id
//   const userId = selectedStory.userId

//   const colRef = collection(db, "users", userId, "storys", storyId, "storyContent");

//   try {
//     const querySnapshot = await getDocs(colRef);

//     querySnapshot.forEach((doc) => {
//       console.log("storyContent doc:", doc.id, "=>", doc.data());
//       const contentDataWithId = {
//         id: doc.id,
//         ...doc.data(),
//       };
//       setStoryContent((prevContent) => [...prevContent, contentDataWithId]);
      
//     });
//   } catch (error) {
//     console.error("Error fetching storyContent documents:", error);
//   }
// };

// const getStoryOutline = async() => {
//   const storyId = selectedStory.id
//   const userId = selectedStory.userId

//   const colRef = collection(db, "users", userId, "storys", storyId, "storyOutline");

//   try {
//     const querySnapshot = await getDocs(colRef);

//     querySnapshot.forEach((doc) => {
//       console.log("storyOutline doc:", doc.id, "=>", doc.data());
//       const outlineDataWithId = {
//         id: doc.id,
//         ...doc.data(),
//       };
//       setStoryOutline((prevOutline) => [...prevOutline, outlineDataWithId]);
//     });
//   } catch (error) {
//     console.error("Error fetching storyContent documents:", error);
//   }
// }

// const getImagePrompts = async () => {
//   const storyId = selectedStory.id;
//   const userId = selectedStory.userId;

//   const colRef = collection(db, "users", userId, "storys", storyId, "storyContent");

//   try {
//     const querySnapshot = await getDocs(colRef);

//     querySnapshot.forEach(async (doc) => {
//       const imagePromptsColRef = collection(
//         db,
//         "users",
//         userId,
//         "storys",
//         storyId,
//         "storyContent",
//         doc.id,
//         "imagePrompts"
//       );
//       const imagePromptsSnapshot = await getDocs(imagePromptsColRef);
//       console.log("image prompts:", imagePromptsSnapshot.docs.map((doc) => doc.data()));
//       const promptDataWithId = {
//         pageId: doc.id,
//         prompts: imagePromptsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
//       };
//       setImagePrompts((prevImagePrompts) => [...prevImagePrompts, promptDataWithId]);
//     });
//   } catch (error) {
//     console.error("Error fetching image prompts documents:", error);
//   }
// };

// const getImagePromptsForPage = (pageId) => {
//   const pageImagePrompts = imagePrompts.find((item) => item.pageId === pageId);
//   return pageImagePrompts ? pageImagePrompts.prompts : [];
// };


//   const showRequestForm = (request) => {
//     setRequest(request)
//     console.log('this is request data', request.data())
//   }

//   const showStoryRequestForm = (story) => {
//     console.log('we are trying to show story')
//     setStoryRequest(story.data().response)
//     console.log(story.data().response)
//   }

//     console.log(requests)

//     useEffect(() => {
//         if (!request) return;
//         const character = request.data().character
//         const prompt = `animation character poses and props for an illustratede children's book of a cartoon ${character.gender} who is two years old with  ${character.hairColor} ${character.hairStyle} hair and ${character.eyeColor} eyes in a ${character.clothing}, in the style of white background, 
//         rtx, caricature faces, cildo meireles, alex hirsch, high quality, george stefanescu`
//         setPrompt(prompt)
//     })

//     const addImageToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const reader = new FileReader();
//         if (e.target.files) {
//           const file = e.target.files[0]
//           if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
//             alert('try uploading an image')
//           }   
//           if (e.target.files[0]) {
//             reader.readAsDataURL(e.target.files[0])
//           }
//           reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
//             if (readerEvent.target) {
//               setSelectedFile(readerEvent.target.result as string);
//             }
//           };
//         }
//       }

//     const upload = async() => {
//         if (loading) return;
//         setLoading(true)

//         console.log('this is request', request.data())
 
//         const { storyId, userId, typeOfRequest, characterId } = request.data()
//         try{
//         const imageRef = ref(storage, `${typeOfRequest}/${userId}/${storyId}/${characterId}`);

//         if (selectedFile) {
//             await uploadString(imageRef, selectedFile, "data_url" ).then(async snapshot => {

//                 const downloadURL = await getDownloadURL(imageRef);
//                 console.log('this is url', downloadURL)
    
//                 await updateDoc(doc(db, 'users', userId, 'storys', storyId, 'hero', characterId), {
//                     image: downloadURL
//                 })
//             });
//         }
//         setLoading(false)
//     }
//         catch(err){
//             console.log("failed", err)
//             setLoading(false)
//         }
//     }


//     const addImageToPost = (e) => {

//       // setSelectedFileType('image')
//       const reader = new FileReader();
//       const file = e.target.files[0]
// if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
//   // addVideoToPost(e)
//   alert('try uploading an image')
// }

//       if (e.target.files[0]) {
//           reader.readAsDataURL(e.target.files[0])
//       }
//       reader.onload = (readerEvent) => {

//           setSelectedFile(readerEvent.target.result)
//       }
//   }

//   useEffect(() => {
//     if (!selectedStory) return;
//     const sorted =  storyContent.sort((a, b) => parseInt(a.pageNumber) - parseInt(b.pageNumber));
//     setSortedStoryContent(sorted)
//     const sortedIps = imagePrompts.sort((a, b) => parseInt(a.pageId) - parseInt(b.pageId));
//     setSortedImagePrompts(sortedIps)
//   }, [selectedStory])


//     // const sortedStoryContent = storyContent.sort((a, b) => parseInt(a.pageNumber) - parseInt(b.pageNumber));
//     // const sortedImagePrompts = imagePrompts.sort((a, b) => parseInt(a.pageId) - parseInt(b.pageId));

//     return (
//       <div className="h-screen overflow-scroll flex">
//         <div className="p-4 space-y-4 w-1/5 h-full bg-pink-500">
//           {stories?.map((story) => (
//             <p
//               onClick={() => setSelectedStory(story)}
//               className="text-white cursor-pointer p-4 hover:opacity-50 hover:shadow-xl"
//             >
//               {story.title}
//             </p>
//           ))}
//         </div>
    
//         {selectedStory && (
//           <div className="w-4/5 h-screen bg-white overflow-y-scroll">
//             <h1>{selectedStory.title}</h1>
//             <div>
//         {sortedStoryContent.map((content) => {
//         const pageImagePrompts = getImagePromptsForPage(content.id);
//         return (
//           <AdminStoryPage content={content} pageImagePrompts={pageImagePrompts} />
//       // <div key={content.id} className="my-4 w-4/5 h-4/5 mx-auto">
//       //   <h2 className="text-xl font-bold mb-2">Page {content.pageNumber}</h2>
//       //   <h3 className="text-lg font-semibold mb-1">Story:</h3>
//       //   <p>{content.page}</p>

//       //   <h3 className="text-lg font-semibold mb-1">Image Prompts:</h3>
//       //   <ul>
//       //     {pageImagePrompts.map((prompt) => (
//       //       <li key={prompt.id} className='text-sm italic'>{prompt.imagePrompt}</li>
//       //     ))}
//       //   </ul>
//       //   <input
//       //       id="gif-picker"
//       //       ref={imagePickerRef}
//       //       type="file"
//       //       accept="image/"
//       //       hidden
//       //       onChange={addImageToPage}
//       //     />
//       //     <CameraIcon className="h-8 w-8 text-green-600 cursor-pointer" aria-hidden="true" onClick={() => imagePickerRef.current.click()} />

//       // </div>
//   );
// })}

//             </div>
//           </div>
//         )}
//       </div>
//     );
    
// }

// export default AdminPage

import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page