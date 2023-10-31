'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useEffect, useState} from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../GlobalRedux/store'
import { doc, getDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { db } from '../../firebase'
import { setPdfUrl, setStoryId } from '../GlobalRedux/Features/viewStorySlice'
import { setIsLoading } from '../GlobalRedux/Features/pageLoadingSlice'

function OrderSuccessPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const [sessionId, setSessionId] = useState<null | string>()
    const [paymentSuccessfull, setPaymentSuccessfull] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const pdfUrl = useSelector((state: RootState) => state.viewStory.pdfUrl)
    const sendOrderToGelato = () => {
        
    }

    const savedState = JSON.parse(localStorage.getItem('checkoutData') || '{}');

if (savedState.storyId) {
    let id = savedState.storyId
    console.log('savedState', savedState)
    dispatch(setStoryId(id))
}

if (savedState.pdfUrl) {
    let pdfUrl = savedState.pdfUrl
    console.log('savedState', savedState)
    dispatch(setPdfUrl(pdfUrl))
}

// if (savedState.sessionId) {
//     let checkout_session_id = savedState.sessionId
//     console.log('savedState', savedState)
//     dispatch(setStoryId(id))
// }

    useEffect(() => {
        console.log('we are in the useEffect lookuing for checkout session id', storyId, session)
        setLoading(true)
        if (!storyId || !session) return;
            const docRef = doc(db, "users", session?.user?.email!, "checkout_sessions", storyId);
            getDoc(docRef).then((documentSnapshot) => {
                if (documentSnapshot.exists()) {
                  console.log("Document SNAPSHOT data:", documentSnapshot.data());
                  setSessionId(documentSnapshot.data().lastCheckoutSessionId)
                } else {
                  console.log("No such document!");
                }
              }).catch((error) => {
                console.error("Error getting document:", error);
              });
      }, [storyId, session]);



      useEffect(() => {
        console.log('PDF ===', pdfUrl)
        if (sessionId && pdfUrl) {
    
            console.log('sessionId', sessionId)
          fetch('/api/verify_payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                sessionId: sessionId,
                storyId: storyId,
                userEmail: session?.user?.email,
                pdfUrl: pdfUrl,
                userName: session?.user?.name
            
            })
          })
          .then(response => response.json())
          
          .then(data => {
            console.log("DATA", data)
            if (data.status === 'success') {
              // Handle successful payment verification
              setPaymentSuccessfull(true)
              setLoading(false)
              console.log('Handle successful payment verification')
            } else {
              // Handle unsuccessful payment verification
              console.log('Handle unsuccessful payment verification')
              setPaymentSuccessfull(false)
              setLoading(false)
            }
          })
          .catch(error => {
            // Handle error
            console.log(error)
            setLoading(false)
            setPaymentSuccessfull(false)
          });
        }
      }, [sessionId]);
      

  return (
<div className="bg-gray-100 h-screen flex justify-center">

    {loading ? (
        <p>Confriming your order</p>
    ):
    
    paymentSuccessfull ? (
        <div className="bg-white p-8 mt-12 rounded-lg shadow-md w-full h-2/3 max-w-md">
            <div className="flex justify-center items-center mb-4">
                <CheckCircleIcon className="text-green-500 h-12 w-12" />
                <h2 className="text-2xl font-semibold ml-4">Order Confirmed!</h2>
            </div>

            <p className="mb-6 text-gray-600">
                Thank you for your purchase. A confirmation has been sent to your email. Your item will be shipped shortly. Meanwhile, you can check the status of your order by clicking the link below.
            </p>

            <p className="mb-2 text-gray-500 font-semibold">
                Order Number: <span className="font-normal">#1234567890</span>
            </p>

            <p className="mb-6 text-gray-500 font-semibold">
                Estimated Delivery Date: <span className="font-normal">October 25th, 2023</span>
            </p>

            <button 
                onClick={() => router.push('/orders')}
                className="bg-pink-600 text-white w-full py-2 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50">
                Go to my orders
            </button>
        </div>
    ): 
    <p>Ooops we have a problem!</p>
}
</div>


  )
}

export default OrderSuccessPage