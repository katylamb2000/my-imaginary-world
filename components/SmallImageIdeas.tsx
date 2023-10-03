import { CSSProperties, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../app/GlobalRedux/store'
import { useSession } from 'next-auth/react'
import { SyncLoader } from 'react-spinners'

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


  return (
    <div className="overflow-scroll h-1/3">
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
<>
    <button className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
      onClick={() => getSmallImage(wildcardIdea, 'wildcard')}
      >
        {wildcardIdea}
    </button>
    <button className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
      onClick={() => getSmallImage(characterIdea, 'character')}
      >
        {characterIdea}
    </button>

    <button className="p-4 text-purple-400 hover:underline-offset-1 hover:underline hover:text-purple-600"
      onClick={() => getSmallImage(objectIdea, 'object')}
      >
        {objectIdea}
    </button>
</>
}
    </div>
  )
}

export default SmallImageIdeas