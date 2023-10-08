import { ArrowLeftIcon, ArrowRightIcon, PaintBrushIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/GlobalRedux/store";
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import { useSession } from "next-auth/react";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
// import EnhancePhotoIcon from '@mui/icons-material/EnhancePhoto';

function ImageGridButtons({ nextImage, lastImage, selectImage , setShowGrid, showGrid, setCurrentQuadrant}: any) {
  const dispatch = useDispatch()
  const { data: session } = useSession() 
  const pageId = useSelector((state: RootState) => state.pageToEdit.id);
  const viewPage = useSelector((state: RootState) => state.storyBuilderActive.name)
  const storyId = useSelector((state: RootState) => state.viewStory.storyId)
  const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
  const improvedImageButtonId = useSelector((state: RootState) => state.pageToEdit.improvedImageButtonId)
  const isFullPageWidth = pageId !== 'page_1' ;

  const [btnId, setBtnId] = useState<string>()

  useEffect(() => {
    if (!improvedImageButtonId && buttonId){
        setBtnId(buttonId)
    }
    if (improvedImageButtonId){
      setBtnId(improvedImageButtonId)
    }
  }, [])

  const openImproveImageSidebar = () => {
    dispatch(setEditBarType('improveRightImage'))
    dispatch(setName('editRightPage'))
  }

  const upscaleChosenImage = async(button: string) => {
    var data = JSON.stringify({
      button: btnId,
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


        var num = parseInt(button.replace(/\D/g,''));

      setCurrentQuadrant(num)
      setShowGrid(false)
      updatePageLoading()
  
    })
    .catch(function (error) {
      console.log(error);
      console.log(error.response.data)
      setShowGrid(true)
    });
  }

  const updatePageLoading = async() => {
    try{
      if (!storyId || !pageId || !session) return;
      const docRef = doc(db, "users", session?.user?.email!, "storys", storyId, "storyContent", pageId);
      await updateDoc(docRef, {
        rightPageLoading: true
      });
    }catch(err){
      console.log(err)
    }
  }

  const improveImages = () => {
    dispatch(setEditBarType('improveRightImage'))
    dispatch(setName('improveRightImage'))
  }

  return (
<div className="w-3/4 mx-auto my-10">

  <div className="flex items-center justify-center h-28 p-6 bg-white rounded-md shadow-xl">
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
    <button 
    className="p-4 mb-6 text-white bg-purple-300 rounded-full shadow-md hover:bg-purple-600 group hover:shadow-xl"
    onClick={improveImages}
  >
    <PaintBrushIcon className="h-8 w-8 text-white " />
    <p className="hidden group-hover:text-white">Improve images</p>


  </button>
  </div>
</div>

  );
}

export default ImageGridButtons;
