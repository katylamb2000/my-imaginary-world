'use client'

import Image from "next/image"
import { db } from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where } from "firebase/firestore";
import { useRouter } from 'next/navigation'
import { HomeIcon, MapIcon, BriefcaseIcon, MagnifyingGlassCircleIcon, StarIcon  } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react'
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(process.env.stripe_public_key || '');

function Header(){
    const { data: session} = useSession()
    const router = useRouter()
    const [admin, setAdmin] = useState <null | any>(null)

    const userEmail = session?.user?.email;
    const adminCollectionRef = userEmail ? collection(db, "users", userEmail, "Admin") : null;

    const adminQuery = adminCollectionRef ? query(adminCollectionRef) : null;

    const [adminDocs, adminLoading, adminError] = useCollection(adminQuery);

    useEffect(() => {
        if (!adminLoading && adminDocs && adminDocs.docs.length > 0) {
            const adminData = { id: adminDocs.docs[0].id, ...adminDocs.docs[0].data() };
            setAdmin(adminData);
            console.log("Admin data: ", adminData);
        } else if (adminError) {
            console.log("Admin error: ", adminError);
        }
    }, [adminDocs, adminLoading, adminError]);

    const goToAdminPage = () => {
        console.log('')
        router.push(`/admin/${admin.id}`)
    }

    const createCheckoutSession = async() => {
         const stripe = await stripePromise; 

         // call the backend to creae a checkout session!
         const checkoutSession = await axios.post('/api/checkout_sessions', 
          {
            items: 'book',
            userSession: session

          });

          //redirect to checkour
          const result = await stripe?.redirectToCheckout({
            sessionId: checkoutSession.data.id
          })
          if (result?.error) {
            alert(result.error.message);
          }
        }


    return(
        <header className="sticky bg-white top-0 z-50 text-center shadow-md
        p-3 md:px-10 w-full justify-between flex ">
    
          <img
                      src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/MyImaginaryWorldLogo.png?alt=media&token=87d07dd8-56a5-4935-88f8-e562923bc7c0"
                            className="h-14 w-14 rounded-full cursor-pointer  mb-2 hover:scale-11 0"
                            alt='logo'
                            onClick={() => router.push('/')}
                        />
            <h1 className="text-2xl font-bold text-purple-600 text-center">My Imaginary World</h1>
<div className="flex space-x-3">
<button 
  role='link'
  disabled={!session}
  onClick={createCheckoutSession}
  className='text-white p-2 rounded-lg bg-pink-600 hover:bg-pink-400 hover:shadow-xl'>

    Checkout
  </button>


{admin && (
            <img src={`https://ui-avatars.com/api/?name=ADMIN`}
              onClick={() => goToAdminPage()}                            
              className="h-12 w-12 rounded-full cursor-pointer mb-2 hover:opactiy-50"
              alt="Profile Pic"
        />
          )
}

{session && session.user?.image ? (
  <img 
        src={session.user.image} 
        onClick={() => signOut()}                            
        className="h-12 w-12 rounded-full cursor-pointer  mb-2 hover:opactiy-50"
        alt="Profile Pic"
   />
) : (
  <img src={`https://ui-avatars.com/api/?name=${session?.user?.name}`}
        onClick={() => signOut()}                            
        className="h-12 w-12 rounded-full cursor-pointer mb-2 hover:opactiy-50"
        alt="Profile Pic"
  />
)}
</div>
      </header>
    )
}
export default Header 