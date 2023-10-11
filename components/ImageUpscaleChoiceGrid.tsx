import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import { useSession } from "next-auth/react"
import axios from "axios"
import { setImageRequestSent } from "../app/GlobalRedux/Features/pageToEditSlice"

function ImageUpscaleChoiceGrid() {
    const { data: session} = useSession()
    const smallbuttonId = useSelector((state: RootState) => state.pageToEdit.smallImageButtonId)
    const mainButtonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const whichImage = useSelector((state: RootState) => state.storyBuilderActive.name)
    const [action, setAction] = useState<string | null>(null)
    const [btnId, setBtnId] = useState<string | null>(null)
    const [upscaleRequestSuccessfull, setUpscaleRequestSuccessfull] = useState<boolean>(false)

    useEffect(() => {
      setUpscaleRequestSuccessfull
    })

    useEffect(() => {
        if (whichImage == 'improveLeftImage'){
            setAction('upscaleSmallImage')
            setBtnId(smallbuttonId)
        }
        if (whichImage == 'improveRightImage'){
            setAction('upscale')
            setBtnId(mainButtonId)
        }
    }, [whichImage])

    const upscale = async(btn: string) => {
    var data = JSON.stringify({
      button: btn,
      buttonMessageId: btnId ,
      ref: { storyId: storyId, userId: session!.user!.email, action: action, page: pageId },
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
      setUpscaleRequestSuccessfull(true)
    // dispatch(setImageUrl(null))
    })
    .catch(function (error) {
      console.log(error);
    
    //   dispatch(setImageUrl(null))
    });
    }
  return (
    <div className='w-full flex mx-auto '>
      <p>if this is already an improved image chances are the button id is old. </p>
      {upscaleRequestSuccessfull ? (
        <>
        <p>Your final image is on its way!</p>
 
      </>
      ):
        <div className='w-48 h-48 bg-purple-400 grid grid-cols-2 gap-4 rounded-md'>
        <button className='p-2 rounded-md bg-white hover:bg-purple-700 hover:text-white m-4 hover:shadow-xl' onClick={() => upscale('U1')}>U1</button>
        <button className='p-2 rounded-md bg-white hover:bg-purple-700 hover:text-white m-4 hover:shadow-xl' onClick={() => upscale('U2')}>U2</button>
        <button className='p-2 rounded-md bg-white hover:bg-purple-700 hover:text-white m-4 hover:shadow-2xl' onClick={() => upscale('U3')}>U3</button>
        <button className='p-2 rounded-md bg-white hover:bg-purple-700 hover:text-white m-4 hover:shadow-xl' onClick={() => upscale('U4')}>U4</button>
    </div>
      }
    </div>
  )
}

export default ImageUpscaleChoiceGrid