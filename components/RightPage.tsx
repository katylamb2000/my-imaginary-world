import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../app/GlobalRedux/store'

function RightPage() {
    const imageUrl = useSelector((state: RootState) => state.pageToEdit.finalImageUrl || state.pageToEdit.imageUrl)
  return (
    <div className='bg-gray-50 h-full w-full justify-center overscroll-none'>
        <div className="border-2 border-gray-300 border-dashed h-[600px] w-[600px] bg-white drop-shadow-md text-center items-center relative mt-6 ">
            <Image src={imageUrl} fill  className='h-full w-full' alt='/'/>
        </div>
    </div>
  )
}

export default RightPage