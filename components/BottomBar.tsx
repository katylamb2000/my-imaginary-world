import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ExclamationCircleIcon, LanguageIcon, PhotoIcon, PencilIcon, Squares2X2Icon  } from "@heroicons/react/24/solid"
import { setEditBarType } from "../app/GlobalRedux/Features/pageToEditSlice"
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice"
import { RootState } from "../app/GlobalRedux/store"
import GeneratePDF from "./generatePDF"

function BottomBar() {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonId)
    const [showMainRightBar, setShowMainRightBar] = useState(true)
    const storyComplete = useSelector((state: RootState) => state.viewStory.storyComplete)
    const pagesComplete = useSelector((state: RootState) => state.viewStory.pagesComplete)
    

    
    const previousPage = () => {
        console.log('Previous page')
    }

    const getSmallImage = async() => {
      dispatch(setName('improveLeftImage'))
      dispatch(setEditBarType('improveRightImage'))
    }

    const getMainImage = async() => {
      dispatch(setName('improveRightImage'))
      dispatch(setEditBarType('improveRightImage'))
    }

    const editText = () => {
        dispatch(setEditBarType('editText'))
        dispatch(setName('editRightPage'))
    }

    const upscale = async(btn: string) => {    
    var data = JSON.stringify({
      button: btn,
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

    // dispatch(setImageUrl(null))
    })
    .catch(function (error) {
      console.log(error);

    //   dispatch(setImageUrl(null))
    });
  }

    const selectImageToUpscale = () => {
        setShowMainRightBar(false)
    }

  const leftPageButtons = [
    { icon: PhotoIcon, tooltip: 'Get Small Image', click: getSmallImage },
    { icon: ArrowLeftIcon, tooltip: 'Previous Page', click: previousPage },
    { icon: ArrowRightIcon, tooltip: 'Next Page' },
    { icon: PencilIcon, tooltip: 'Edit Text', click: editText },
    { icon: CheckCircleIcon, tooltip: 'Mark as Complete' },
    { icon: ExclamationCircleIcon, tooltip: 'Needs Review' },
    { icon: Squares2X2Icon, tooltip: 'View Image Choices' }
  ];
  const selectImageButtons = [
    { btn: 'U1', click: upscale }, { btn: 'U2', click: upscale }, { btn: 'U3', click: upscale }, { btn: 'U4', click: upscale },
  ]

  const rightPageButtons = [
    { icon: PhotoIcon, tooltip: 'Get Image', click: getMainImage },
    { icon: ArrowLeftIcon, tooltip: 'Previous Page', click: previousPage },
    { icon: ArrowRightIcon, tooltip: 'Next Page' },
    { icon: PencilIcon, tooltip: 'Edit Text', click: editText },
    { icon: CheckCircleIcon, tooltip: 'Mark as Complete' },
    { icon: ExclamationCircleIcon, tooltip: 'Needs Review' },
    { icon: Squares2X2Icon, tooltip: 'View Image Choices', click: selectImageToUpscale }
  ];

  return (<div className="w-3/4 justify-evenly h-48 bg-gray-50 mx-auto flex space-x-6">

    <div className='w/12 flex bg-white mx-auto my-auto gap-6 p-6 items-center overflow-x-scroll border border-gray-300 shadow-xl rounded-md'>
        {leftPageButtons.map((button, index) => (
          <div key={index} className="relative group" >
            <button className="rounded-lg h-10 w-10 text-center border-gray-200 bg-white" onClick={button.click}>
              <button.icon className="text-gray-800 h-8 w-8 mx-auto" />
            </button>
            <div className="absolute bottom-full w-max mb-2 text-sm text-white bg-purple-500 rounded-lg px-2 opacity-0 group-hover:opacity-100">
              {button.tooltip}
            </div>
          </div>
        ))}
    </div>

    <div className='w-1/2 flex bg-white mx-auto my-auto gap-6 p-6 items-center overflow-x-scroll border border-gray-300 shadow-xl rounded-md'>
        {showMainRightBar ? (
        rightPageButtons.map((button, index) => (
        <div key={index} className="relative group">
            <button className="rounded-lg h-10 w-10 text-center border-gray-200 bg-white" onClick={button.click}>
              <button.icon className="text-gray-800 h-8 w-8 mx-auto" />
            </button>
            <div className="absolute bottom-full w-max mb-2 text-sm text-white bg-purple-500 rounded-lg px-2 opacity-0 group-hover:opacity-100">
              {button.tooltip}
            </div>
        </div>
        ))
        ): 
        selectImageButtons.map((button, index) => (
            <div key={index} className="relative group justify-evenly w-full">
            <button className="rounded-full h-10 w-10 text-center border-gray-200 items-center bg-white group-hover:bg-purple-500 " onClick={() => button.click(button.btn)}>
              <p className="text-gray-800 h-8 w-8 mx-auto group-hover:text-white">{button.btn}</p> 
            </button>
            {/* <div className="absolute bottom-full w-max mb-2 text-sm text-white bg-purple-500 rounded-lg px-2 opacity-0 group-hover:opacity-100">
              {button.tooltip}
            </div> */}
          </div>
        ))
        }

   
      </div>
      {storyComplete && (
          // <GeneratePDF />
          <ArrowLeftIcon className="h-8 w-8 text-red-500" />
        )}
    </div>
  )
}

export default BottomBar;







