import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSession } from 'next-auth/react'
import axios from "axios";
import type { RootState } from '../app/GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setId, setText, setTextColor, setTextSize } from '../app/GlobalRedux/Features/pageToEditSlice'
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore"
import { db } from '../firebase'
import RequestQueue from '../lib/requestQueue'
import Draggable from 'react-draggable';



type Props = {
    page: any,
    storyId: string;
    imagePrompts: any;
    storyBaseImagePrompt: string;
    // createStoryImagePage: any;

};

function ViewStoryPage({ page, imagePrompts, storyId, storyBaseImagePrompt }: Props) {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [editPage, setEditPage] = useState(false)
  const [thumbnailImage, setThumbnailImage] = useState<null | string>(null)
  const [image, setImage] = useState<null | string>(null)
  const [finalImage, setFinalImage] = useState<null | string>(null)
  const [imageMask, setImageMask] = useState<null | string>(null)
  const baseStoryImagePrompt = useSelector((state: RootState) => state.viewStory.baseStoryImagePrompt)
  const baseStoryImagePromptCreated = useSelector((state: RootState) => state.viewStory.baseStoryImagePromptCreated)
  const selectedPageId = useSelector((state: RootState) =>  state.pageToEdit.id);
  const selectedPageTextColor = useSelector((state: RootState) =>  state.pageToEdit.textColor);
  const selectedPageTextSize = useSelector((state: RootState) =>  state.pageToEdit.textSize);
  const [buttons, setButtons] = useState([])
  const [showChoiceButtons, setShowChoiceButtons] = useState<boolean>(false)
  const [imageCommandSent, setImageCommandSent] = useState(false);
  const [color, setColor] = useState('white')
  const requestQueue = new RequestQueue(3); // Initialize the request queue with 3 concurrent requests.

useEffect(() => {
  if (page.data.imageChoices && page.data.buttons[0] == 'U1') {
    setImage(page.data.imageChoices);
    setShowChoiceButtons(true)
  } else if (page.data.imageChoices && page.data.buttons[0] !== 'U1') {
    setImage(page.data.imageChoices);
    setShowChoiceButtons(false)
  }
}, [page, imageCommandSent]);

 useEffect(() => {
  if (!page.data.buttons) return;
  setButtons(page.data.buttons)
 }, [page])

 const buttonClicked = async(button: string) => {
  try {
    var data = JSON.stringify({
      button: button,
      buttonMessageId: page.data.buttonMessageId,
      ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: page.id, },
      webhookOverride: ""
    });

    const config = {
      method: 'post',
      url: 'https://api.thenextleg.io/api',
      headers: {
        Authorization: `Bearer ${process.env.next_leg_api_token}`,
        'Content-Type': 'application/json'
      },
      data: data,
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
 }

 const sendImagineCommand = async() => {
  setLoading(true)
  var data = JSON.stringify({
    msg: `${page.data.imagePrompt} `,
    ref: { storyId: storyId, userId: session!.user!.email, action: 'imagine', page: page.id, },
    webhookOverride: ""
  });
  
  var config = {
    method: 'post',
    url: 'https://api.thenextleg.io/v2/imagine',
    headers: { 
      'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    setLoading(false)
  })
  .catch(function (error) {
    console.log(error);
    setLoading(false)
  });
}

const pageSelected = () => {
  console.log('page selected', page.id)
    // dispatch(setId(page.id));
  }


const editPageText = () => {
  setEditPage(!editPage)
  dispatch(setText(page.data.page));
  dispatch(setId(page.id));
  if (!page.textColor){
    dispatch(setTextColor('text-white'))
  }
  if (page.textColor){
    dispatch(setTextColor(page.textColor))
  }

}

useEffect(() => {
  setColor(selectedPageTextColor)
}, [selectedPageTextColor])



  return (
  <div className="h-full w-full bg-gray-100 flex" >
    <div className="flex-col w-1/6 h-full p-3 mx-auto ">
      <div className="w-full h-1/3 mt-10  items-center justify-evenly space-y-2">
      {showChoiceButtons && (
        <button className= "bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl p-3 hover:text-purple-500 text-purple-300"
            onClick={() => buttonClicked('U1')}
        >
          Use this image
        </button>
      )}
        {/* <button className="bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl  p-3 hover:text-purple-500 text-purple-300"
            onClick={() => buttonClicked('V1')}
        >
            Edit this image
        </button> */}
      </div>
      {showChoiceButtons && (
          <div className="w-full h-1/3 mt-20  items-center justify-evenly space-y-2">
          <button 
              className= "bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl p-3 hover:text-purple-500 text-purple-300"
              onClick={() => buttonClicked('U3')}
          >
              Use this image
          </button>
          {/* <button className="bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl  p-3 hover:text-purple-500 text-purple-300">Edit this image</button> */}
        </div>
      )}
 
    </div>

    <div 
        className={`w-3/5 h-4/5 bg-white rounded-lg border ${page.id === selectedPageId ? 'border-purple-500' : 'border-gray-100'}  shadow-xl mx-auto my-8 text-center relative`} 
        onClick={pageSelected}
    >

{image && !finalImage &&  (
  <Image src={image} 
                    layout="fill"
                    objectFit="cover"
                    alt=''
                    className="rounded-lg z-10"
        /> 
)}


        <Draggable bounds='parent'>
          <button 
              onClick={editPageText}
              className={`text-${color} absolute bottom-10 text-2xl p-4 z-50  hover:scale-110 cursor-text `}  >
              {page.data.page}
          </button>
        </Draggable>


      <div className="grid grid-cols-4">
      {/* <p className='italic text-sm col-span-3 text-blue-600'>{storyBaseImagePrompt}</p> */}

      <p className='italic text-sm col-span-3 text-red-600'>{page.data.imagePrompt}</p>
      {/* <p className='italic text-sm col-span-3 text-blue-600'>{storyBaseImagePrompt}</p> */}
      <button 
          className="bg-pink-600 text-white p-4 mx-2 rounded-lg col-span-1"
          onClick={sendImagineCommand}
        >
        send prompt to midjounrey api
      </button>
      </div>
{/* </div> */}

</div>
<div className="flex-col w-1/6 h-full p-3 mx-auto ">
      <div className="w-full h-1/3 mt-10  items-center justify-evenly space-y-2">
        <button 
            className= "bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl p-3 hover:text-purple-500 text-purple-300"
            onClick={() => buttonClicked('U2')}
        >
          Use this image
        </button>
        {/* <button 
            className="bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl  p-3 hover:text-purple-500 text-purple-300"
            onClick={() => buttonClicked('V2')}
        >
            Edit this image
        </button> */}
      </div>
      <div className="w-full h-1/3 mt-20  items-center justify-evenly space-y-2">
        <button 
            className= "bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl p-3 hover:text-purple-500 text-purple-300"
            onClick={() => buttonClicked('U4')}
            >
              Use this image
            </button>
        {/* <button 
          className="bg-white border-purple-300 rounded-lg hover:purple-500 hover:shadow-xl  p-3 hover:text-purple-500 text-purple-300"
          onClick={() => buttonClicked('V4')}
          >
            Edit this image
          </button> */}
      </div>
    </div>



</div>
  )
}

export default ViewStoryPage