import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setName } from '../app/GlobalRedux/Features/storyBuilderActiveSlice'
import { RootState } from '../app/GlobalRedux/store'
import NextImageModal from './NextImageModal'

function RightPage() {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.imageUrl)
    const finalImageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl)
    const buttonId = useSelector((state: RootState) => state.pageToEdit.buttonMsgId)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pageId = useSelector((state: RootState) => state.pageToEdit.id)
    const [currentQuadrant, setCurrentQuadrant] = useState(1);

    const viewRight = () => {
        dispatch(setName('editRightPage'))
      }

      const viewLeft = () => {
        dispatch(setName('editLeft'))
      }

      const nextQuadrant = () => {
        setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev + 1));
      };
      
      const lastQuadrant = () => {
        setCurrentQuadrant((prev) => (prev === 4 ? 1 : prev - 1));
      };

      const upscaleChosenImage = async() => {
        
        const button = `U${currentQuadrant}`
        console.log('Button', button)
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
      
        })
        .catch(function (error) {
          console.log(error);
      
        });
          }
      
  return (
    <div className='bg-gray-50 h-full w-full justify-center overscroll-none'>
        {/* <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">
            <Image src={imageUrl} fill  className='h-full w-full' alt='/'/>
        // </div> */}
        
<div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">

{imageUrl && !finalImageUrl && (() => {
          let bgPosition = 'top left';
          switch (currentQuadrant) {
            case 1:
              bgPosition = 'top left';
              break;
            case 2:
              bgPosition = 'top right';
              break;
            case 3:
              bgPosition = 'bottom left';
              break;
            case 4:
              bgPosition = 'bottom right';
              break;
            default:
              bgPosition = 'top left';
          }
          return (
            <div
              className="w-full h-full bg-no-repeat bg-cover rounded-sm cursor-pointer"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: bgPosition,
                backgroundSize: '200% 200%'
              }}
            />
          );
        })()}
    </div>
    
    {imageUrl && !finalImageUrl && (
          <NextImageModal nextImage={nextQuadrant} lastImage={lastQuadrant} selectImage={upscaleChosenImage} />
      )}


         <div className="w-1/3 mx-auto mt-4 bg-purple-300 rounded-md mb-48 flex justify-evenly h-14 text-center items-center">
              <ArrowLeftIcon className=' h-8 w-8 text-purple-800 hover:text-white'  onClick={viewLeft}/>
              <ArrowRightIcon   className=' h-8 w-8 text-purple-800 hover:text-white' onClick={viewRight} />
        </div>

    </div>
  )
}

export default RightPage