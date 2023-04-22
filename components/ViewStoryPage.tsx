import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSession } from 'next-auth/react'
import axios from "axios";
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setId, setText } from '../app/GlobalRedux/Features/pageToEditSlice'
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore"
import { db } from '../firebase'

type Props = {
    page: any,
    storyId: string;
    imagePrompts: any;
    // createStoryImagePage: any;

};

function ViewStoryPage({ page, imagePrompts, storyId }: Props) {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const [thumbnailImage, setThumbnailImage] = useState<null | string>(null)
  const [image, setImage] = useState<null | string>(null)
  const [imageMask, setImageMask] = useState<null | string>(null)
  const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
  const selectedPageTextColor = useSelector((state: RootState) =>  state.pageToEdit.textColor);
  const selectedPageTextSize = useSelector((state: RootState) =>  state.pageToEdit.textSize);

  // const [imagePrompt, imagePromptLoading, imagePromptError] = useCollection(
  //   session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyContent', page.id, 'imagePrompts') : null,
  // );

  // const [images, imagesLoading, imagesError] = useCollection(
  //   session?.user?.email && storyId ? collection(db, 'users', session.user.email, 'storys', storyId, 'storyContent', page.id, 'images') : null,
  // );

  // useEffect(() => {
  //   if (!imagePrompt) return;
  //   if (!imagePrompt?.docs[0]?.data()){
  //     createStoryImagePrompt(page)
  //   }
  //   else{
  //     checkForImageUri()
  //   }
  // }, [imagePrompt])

  // const checkForImageUri = () => {
  //   if (!images) return;
  //   if (!images?.docs[0]?.data()){
  //     createImage()
  //   }
  //   if (images?.docs[0]?.data().data.images[0].uri){
  //     setImage(images?.docs[0]?.data().data.images[0].uri)
  //   }
  //   if (images?.docs[0]?.data().data.images[0].maskUri){
  //     setImageMask(images?.docs[0]?.data().data.images[0].maskUri)
  //   }
  // }

  const createImage = async() => {
    const prompt = imagePrompts?.docs[0].data().imagePrompt
    try{

      const response = await fetch('/api/leapImage', {
         method: 'POST', 
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           prompt: prompt,
           session,
           storyId: storyId,
           page: page.id
         }),
       });
       const data = await response.json();
       console.log('THIs is the URI from leAp', data.answer.images[0].uri)

     }catch(err){
       alert(err)
     }
  }


//   const updateStoryThumbnailImage = async(uri: string) => {
//     try{
//         if (!storyId) return;
//         const story =  await updateDoc(doc(db, 'users', session?.user?.email, 'storys', storyId ), {
//             image: thumbnailImage
//         })
//         console.log(story)
//     } catch(err){
//         console.log(err)
//     }
// }

const sendPromptToMidJourneyApi = () => {
  console.log(page.data.imagePrompt?.imagePrompt)
}


const sendImagineCommand = async () => {
  try {
    const data = {
      cmd: 'imagine',
      msg: page.data.imagePrompt?.imagePrompt,
      ref: '',
      webhookOverride: ''
    };

    const config = {
      method: 'post',
      url: 'https://api.thenextleg.io/api',
      headers: {
        Authorization: `Bearer ${process.env.next_leg_api_token}`,
        'Content-Type': 'application/json'
      },
      data: data
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
};


const pageSelected = () => {
    dispatch(setId(page.id));
  }

const editPageContent = () => {
  console.log(page.data.page)
  dispatch(setText(page.data.page));
}

  return (
    <div 
        className={`w-3/5 h-4/5 bg-white rounded-lg border ${page.id === selectedPageId ? 'border-purple-500' : 'border-gray-100'}  shadow-xl mx-auto my-8 text-center relative`} 
        onClick={pageSelected}
    >

{image &&  (
  <Image src={image} 
                    layout="fill"
                    objectFit="cover"
                    alt=''
                    className="rounded-lg"
        /> 
)}

{imageMask && (
  <Image src={'https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/whiteBottomCloudBorder.png?alt=media&token=97b97e01-2f13-4f28-b758-0d6d3f304372'} 
                    layout="fill"
                    objectFit="cover"
                    alt=''
                    className="rounded-lg z-10 blur-sm "
        /> 
)}   


<div className="bg-red-400 z-50"> 
      {selectedPageId == page.id ? (
        <p className={`cursor-pointer ${selectedPageTextColor === '' ? 'text-purple-600' : `${selectedPageTextColor}` } text-2xl absolute bottom-10 p-4 z-50`}
            // onClick={() => editPageContent(page)}
          >{page.data.page}
        </p>
        ): 
        <p  className=" text-purple-400 absolute bottom-10 text-2xl p-4 z-50  " >
            {page.data.page}
        </p>
      }
      <div className="grid grid-cols-4">
      <p className='italic text-sm col-span-3'>{page.data.imagePrompt?.imagePrompt}</p>
      <button 
          className="bg-pink-600 text-white p-4 mx-2 rounded-lg col-span-1"
          onClick={sendImagineCommand}
        >
        send prompt to midjounrey api
      </button>
      </div>
</div>

</div>
  )
}

export default ViewStoryPage