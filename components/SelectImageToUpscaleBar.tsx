import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { useSession } from "next-auth/react";

function SelectImageToUpscaleBar() {
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const currentStoryId = useSelector((state: RootState) => state.viewStory.storyId)
    const [loading, setLoading] = useState<boolean>(false)
    const [imageRequestSuccessful, setImageRequestSuccessful] = useState<boolean>(false)


    const upscaleChosenImage = async(btn: string) => {
        console.log(btn)
        console.log(buttonId)
    
    var data = JSON.stringify({
      button: btn,
      buttonMessageId: buttonId ,
      ref: { storyId: currentStoryId, userId: session!.user!.email, action: 'upscale', page: pageId },
      webhookOverride: ""
    });
    
    var config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/button',
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
    setImageRequestSuccessful(true)
    // dispatch(setImageUrl(null))
    })
    .catch(function (error) {
      console.log(error);
      setLoading(false)
    //   dispatch(setImageUrl(null))
    });
  }
  
  return (
    <div className='border  border-gray-100 rounded-sm mb-48 w-1/3 h-20 absolute -bottom-24 bg-fuchsia-300 right-56 drop-shadow-2xl'> 
    {imageRequestSuccessful ? (
      <p className="mx-auto p-6 text-fuchsia-900" w-full>Your final image is on its way!</p>
    ):
    <>
      <p className="mx-auto p-6 text-fuchsia-900" w-full>Select Your image</p>
      <div className="mx-auto my-auto bg-fuchsia-200 text-white  grid grid-cols-2">
          <button onClick={() => upscaleChosenImage('U1')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">1</button>
          <button onClick={() => upscaleChosenImage('U2')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">2</button>
          <button onClick={() => upscaleChosenImage('U3')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">3</button>
          <button onClick={() => upscaleChosenImage('U4')} className="text-purple-400  w-10 h-10 rounded-full hover:border hover:bg-purple-600 hover:text-white">4</button>
      </div>
      </>
}
    </div>
  )
}

export default SelectImageToUpscaleBar