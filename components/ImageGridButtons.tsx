import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import { useSession } from "next-auth/react";

function ImageGridButtons({ nextImage, lastImage, selectImage , setShowGrid, showGrid, setCurrentQuadrant}: any) {
  const dispatch = useDispatch()
  const { data: session } = useSession() 
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const viewPage = useSelector((state: RootState) => state.storyBuilderActive.name)
  const storyId = useSelector((state: RootState) => state.viewStory.storyId)
  const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
  const isFullPageWidth = pageId !== 'page_1' ;

  const openImproveImageSidebar = () => {
    dispatch(setEditBarType('improveRightImage'))
    dispatch(setName('editRightPage'))
  }

  const upscaleChosenImage = async(button: string) => {

console.log('Button', button, buttonId)
    var data = JSON.stringify({
      button: button,
      buttonMessageId: buttonId ,
      ref: { storyId: storyId, userId: session!.user!.email, action: 'upscale', page: pageId },
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

      setCurrentQuadrant(num)
      setShowGrid(true)
  
    })
    .catch(function (error) {
      console.log(error);
  
    });
  }


  return (
    <div className={` w-3/4`}>
      {/* {isFullPageWidth && viewPage !== 'editRightPage' && (
        <div className="col-span-1 " />
      )} */}
      <div
        className={`w-full h-28 flex items-center justify-center shadow-xl rounded-md bg-white`}
      >
    <div className="grid grid-cols-2 gap-4 m-4">
        <button className="w-12 h-12 hover:bg-purple-500 text-black hover:text-white rounded-md text-center flex items-center justify-center"
        onClick={() => upscaleChosenImage('U1')}>U1</button>
        <button className="w-12 h-12 hover:bg-purple-500 text-black hover:text-white rounded-md text-center flex items-center justify-center"
        onClick={() => upscaleChosenImage('U2')}>U2</button>
        <button className="w-12 h-12 hover:bg-purple-500 text-black hover:text-white rounded-md text-center flex items-center justify-center"
        onClick={() => upscaleChosenImage('U3')}>U3</button>
        <button className="w-12 h-12 hover:bg-purple-500 text-black hover:text-white rounded-md text-center flex items-center justify-center"
        onClick={() => upscaleChosenImage('U4')}>U4</button>
    </div>

        {/* <div className="flex justify-between items-center space-x-8">
          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={nextImage}>
            <ArrowLeftIcon className="h-8 w-8 text-purple-500 hover:text-purple-600 font-extrabold" />
          </button>

          <div className={`flex ${viewPage == 'InsidePage' && 'flex-col'} items-center space-y-2`}>
            <button className="px-6 py-2 rounded-md text-white bg-purple-400 hover:bg-purple-600" onClick={() => setShowGrid(!showGrid)}>
              Use on of these images
            </button>
            <button 
              onClick={() => openImproveImageSidebar()}
              className="px-6 py-2 rounded-md text-purple-400 border border-purple-400 hover:bg-purple-100 hover:text-purple-600">
              Improve this image
            </button>
          </div>

          <button className="rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-100 hover:shadow-xl" onClick={lastImage}>
            <ArrowRightIcon className="h-8 w-8 text-purple-500 hover:text-purple-600" />
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default ImageGridButtons;
