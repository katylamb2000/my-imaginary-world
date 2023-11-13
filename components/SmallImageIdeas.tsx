import { CSSProperties, useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../app/GlobalRedux/store'
import { useSession } from 'next-auth/react'
import { SyncLoader } from 'react-spinners'
import { CloudArrowDownIcon } from '@heroicons/react/24/outline'
import { Face2, Toys, Pets  } from '@mui/icons-material'

function SmallImageIdeas() {
    const { data: session } = useSession()
    const [gettingSmallImage, setGettingSmallImage] = useState(false)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const style = useSelector((state: RootState) => state.pageToEdit.style)
    const wildcardIdea = useSelector((state: RootState) => state.pageToEdit.wildcardIdea)
    const objectIdea = useSelector((state: RootState) => state.pageToEdit.objectIdea)
    const characterIdea = useSelector((state: RootState) => state.pageToEdit.characterIdea)
    const[success, setSuccess] = useState(false)
    const [color, setColor] = useState("#c026d3");
    const [viewedIdea, setViewedIdea] = useState<any>('')
    const imageIdeas = [
      { idea: wildcardIdea, icon: <Toys /> },
      { idea: objectIdea, icon: <Pets /> },
      { idea: characterIdea, icon: <Face2 /> }
    ];
        const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#c026d3",
    };

    const getSmallImage = async(idea: string | null, type: string) => {
        setGettingSmallImage(true)
        const prompt = `in the style of ${style} for a childrens book illustrate ${idea} on a white background`
          var data = JSON.stringify({
            msg: prompt,
            ref: { storyId: storyId, userId: session!.user!.email, action: 'imagineSmallImage', page: pageId, type: type  },
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
            setGettingSmallImage(false)
            setSuccess(true)
          })
          .catch(function (error) {
            console.log(error);
            setGettingSmallImage(false)
            setSuccess(false)
          });
        }

    useEffect(() => {
      console.log(viewedIdea)
    }, [viewedIdea])


  return (
    <div className="w-full text-center">
        {success ? (
        <div className="w-full h-full items-center text-center">
          <SyncLoader
            color={color}
            loading={success}
            cssOverride={override}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <p>Your small image is on its way!</p>
        </div>
      ):

<div className='flex-col w-full justify-evenly relative'>
  <div className='flex w-full justify-evenly'>
  {imageIdeas.map((idea, index) => (
  <button className='group p-2 cursor-pointer' onClick={() => setViewedIdea(idea)} key={index}>
    <div className='text-green-300 h-12 w-12 transition-all duration-300 group-hover:text-green-500 mx-auto'>
      {idea.icon}
    </div>
  </button>
))}

  </div>

    <p className='text-green-300 transition-all duration-300 mt-2'>{viewedIdea.idea}</p>
    {viewedIdea.idea && (
    <button className='p-4 rounded-lg border border-purple-500 text-purple-500'>Get this image</button>

    )}


</div>



}
    </div>
  )
}

export default SmallImageIdeas