'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useEffect, useState} from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '../GlobalRedux/store'
import { doc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { db } from '../../firebase'

function OrderSuccessPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const sendOrderToGelato = () => {
     
    }

    useEffect(() => {
        if (!storyId) return;
      
        const docRef = doc(db, "users", session?.user?.email!, "checkout_sessions", storyId);

        console.log(docRef)
      }, [storyId]);

  return (
    <div className='bg-gray-50 h-screen'>
            <main className='max-w-screen-lg mx-auto h-screen '>
                <div className='flex flex-col p-10 bg-white'>
                    <div className='flex items-center space-x-2 mb-5'>
                        <CheckCircleIcon className='text-green-500 h-10' />
                        <h1 className='text-3xl'>
                            Thank you, Your order has been confirmed!
                        </h1>
                    </div>
                    <p>
                        Thank you for shopping with us. We'll send a confirmation once your item has shipped. If you would like to check the status of your order please press the link below. 
                    </p>
                    <button 
                        onClick={() => router.push('/orders')}
                        className='p-4 bg-pink-600 text-white rounded-lg'>Go to my orders</button>
                </div>
            </main>
        <Footer />

    </div> 
  )
}

export default OrderSuccessPage