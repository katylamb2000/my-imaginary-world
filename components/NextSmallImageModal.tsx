import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, PaintBrushIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { useSession } from "next-auth/react";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice";
import axios from "axios";

function NextSmallImageModal({ nextSmallImage, lastSmallImage, selectSmallImage,  setShowGrid, showSmallImageGrid, setCurrentSmallImageQuadrant }: any) {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const viewPage = useSelector((state: RootState) => state.storyBuilderActive.name)
  const smallImageButtonId = useSelector((state: RootState) => state.pageToEdit.smallImageButtonId)
  const smallImageUrl = useSelector((state: RootState) => state.pageToEdit.smallImageUrl)
  const storyId = useSelector((state: RootState) => state.viewStory.storyId)
  const style = useSelector((state: RootState) => state.pageToEdit.style)
  const [gettingSmallImage, setGettingSmallImage] = useState(false)

  const isFullPageWidth = pageId !== 'page_1' ;

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
        console.log(response);
        console.log(JSON.stringify(response.data));
        setGettingSmallImage(false)
      })
      .catch(function (error) {
        console.log(error);
        setGettingSmallImage(false)
      });
    }

  const upscaleChosenImage = async(button: string) => {
        var data = JSON.stringify({
          button: button,
          buttonMessageId: smallImageButtonId ,
          ref: { storyId: storyId, userId: session!.user!.email, action: 'upscaleSmallImage', page: pageId },
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
    
            var num = parseInt(button.replace(/\D/g,''));
    
            setCurrentSmallImageQuadrant(num)
          setShowGrid(true)
      
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.response.data)
        });
      }

      const improveImages = () => {
        dispatch(setEditBarType('improveRightImage'))
        dispatch(setName('editLeft'))
      }

  return (
    // <div className={`grid grid-cols-${isFullPageWidth ? "2" : "1"} w-full`}>
            <div className='w-3/4'>

      {/* {isFullPageWidth && viewPage !== 'editRightPage' && (
        <div className="col-span-1 " />
      )} */}
{showSmallImageGrid ? (
  <div
  className={` h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
>
  <div className="flex justify-between items-center space-x-8">
    <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={nextSmallImage}>
      <ArrowLeftIcon className="h-8 w-8 text-purple-500 hover:text-purple-600 font-extrabold" />
    </button>

    <div className={`flex ${viewPage == 'InsidePage' && 'flex-col'} items-center space-y-2`}>
      <button className="px-6 py-2 rounded-md text-white bg-purple-400 hover:bg-purple-600" onClick={selectSmallImage}>
        Use this image
      </button>
      <button className="px-6 py-2 rounded-md text-purple-400 border border-purple-400 hover:bg-purple-100 hover:text-purple-600">
        Improve this image
      </button>
    </div>

    <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={lastSmallImage}>
      <ArrowRightIcon className="h-8 w-8 text-purple-500 hover:text-purple-600" />
    </button>
  </div>
</div>
      ): 
      <div className="w-3/4 mx-auto my-10">

      <div className="flex items-center justify-center h-28 p-6 bg-white rounded-md shadow-xl">
        
        
        {smallImageButtonId && smallImageUrl && (
        <div className="grid grid-cols-2 gap-4">
        {['U1', 'U2', 'U3', 'U4'].map((label) => (
          <button 
            key={label}
            className="flex items-center justify-center w-12 h-12 text-black rounded-md hover:bg-purple-500 hover:text-white"
            onClick={() => upscaleChosenImage(label)}
          >
            {label}
          </button>
        ))}
      </div>
        )}

        {!smallImageUrl && !smallImageButtonId &&(
          <button 
            // onClick={getSmallImage}
            className="p-4 mb-6 text-white bg-purple-300 rounded-full shadow-md hover:bg-purple-600 group hover:shadow-xl">
            get small image
          </button>

        )}

        <button 
        className="p-4 mb-6 text-white bg-purple-300 rounded-full shadow-md hover:bg-purple-600 group hover:shadow-xl"
        onClick={improveImages}
      >
        <PaintBrushIcon className="h-8 w-8 text-white " />
        <p className="hidden group-hover:text-white">Improve images</p>
    
    
      </button>
      </div>
    </div>
      }
    

  
    </div>
  );
}

export default NextSmallImageModal;
