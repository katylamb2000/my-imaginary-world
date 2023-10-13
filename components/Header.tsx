'use client'

import Image from "next/image"
import { db } from '../firebase'
import { useCollection, useDocument, } from 'react-firebase-hooks/firestore'
import { collection, query, where, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { usePathname } from "next/navigation"
import { HomeIcon, MapIcon, BriefcaseIcon, MagnifyingGlassCircleIcon, StarIcon, PlusCircleIcon  } from "@heroicons/react/24/solid";
import GeneratePDF from "./generatePDF";
import { signOut } from 'next-auth/react'
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import axios from "axios";
import { setEditBarType, setId, setImageUrl } from "../app/GlobalRedux/Features/pageToEditSlice";
import { setStoryId, setTitle } from "../app/GlobalRedux/Features/viewStorySlice";
import { useSelect } from "@mui/base";
import { RootState } from "../app/GlobalRedux/store";
import { setIsLoading } from "../app/GlobalRedux/Features/pageLoadingSlice";
import { path } from "pdfkit";
import { BookOpenIcon } from "@heroicons/react/24/outline";


function Header(){ 
    const { data: session } = useSession()
    const stripePromise = loadStripe(process.env.stripe_public_key || '');
    const defaultAvatar = `https://ui-avatars.com/api/?name=${session?.user?.name}`;
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const [admin, setAdmin] = useState <null | any>(null)
    // const [storyId, setStoryId] = useState<null | string>(null)
    const storyId = useSelector((state: RootState) => state.viewStory.storyId)
    const pdfUrl = useSelector((state: RootState) => state.viewStory.pdfUrl)
    // const [pdf, setPdf] = useState<null | string>(null)

    const userEmail = session?.user?.email;
    const adminCollectionRef = userEmail ? collection(db, "users", userEmail, "Admin") : null;

    const adminQuery = adminCollectionRef ? query(adminCollectionRef) : null;

    const [adminDocs, adminLoading, adminError] = useCollection(adminQuery);
    const [loggingOut, setLoggingOut] = useState(false)
    const storyComplete = useSelector((state: RootState) => state.viewStory.storyComplete)

    const [user, loading, error] = useDocument(
      session?.user?.email
        ? doc(db, 'users', session.user.email)
        : null
    );


    useEffect(() => {
      if (user?.data()?.isAdmin){
        setAdmin(true)
      }
    }, [user, session, loading])

    useEffect(() => {
        if (!adminLoading && adminDocs && adminDocs.docs.length > 0) {
            const adminData = { id: adminDocs.docs[0].id, ...adminDocs.docs[0].data() };
            setAdmin(adminData);

        } else if (adminError) {
            console.log("Admin error: ", adminError);
        }
    }, [adminDocs, adminLoading, adminError]);

    const goToAdminPage = () => {
        router.push(`/admin/${userEmail}`)
    }
        useEffect(() => {
          if (!pathname) return;
          const regex = /^\/story\/([a-zA-Z0-9]+)$/;
          const id = regex.exec(pathname);
        
          if (id) {
            const identifier = id[1];
            setStoryId(identifier);  
          } else {
            console.log("No match");
          }
        }, [pathname])

        const [story, storyLoading, storyError] = useDocument(
          session?.user?.email && storyId
            ? doc(db, 'users', session.user.email, 'storys', storyId)
            : null
        );
    
        // useEffect(() => {
        //   if (!story?.data()?.pdf) return;
        //   setPdf(story!.data()!.pdf)
        // }, [story])

    const createCheckoutSession = async() => {
         const stripe = await stripePromise; 

         // call the backend to creae a checkout session!
         const checkoutSession = await axios.post('/api/checkout_sessions', 
          {
            items: 'book',
            userSession: session,
            storyId: storyId,


          });

          //redirect to checkour
          const result = await stripe?.redirectToCheckout({
            sessionId: checkoutSession.data.id
          })
          console.log('RESULT ==>', result)
          if (result?.error) {
            alert(result.error.message);
          }
        }

  const goHome = () => {
      dispatch(setName(''))
      dispatch(setEditBarType('main'))
      dispatch(setStoryId(null))
      dispatch(setTitle(null))
      if (pathname !== '/'){
        dispatch(setIsLoading(true))
        router.push('/')
      }
    }

  const logout = () => {

    dispatch(setName(''))
    dispatch(setEditBarType('main'))
    dispatch(setStoryId(null))
    signOut()
  }

  const createNewStory = async() => {
    const doc = await addDoc(collection(db, "users", session?.user?.email!, 'storys'), {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(), 
        fullImagePrompt: null
    });

      dispatch(setName('create story outline'))
      router.push(`/story/${doc.id}`)
  }

return(
<header className="sticky bg-white top-0 z-50 text-center shadow-md border-b border-purple-200
        p-3 md:px-10 w-full justify-between flex items-center ">
    
        <img
            src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/MyImaginaryWorldLogo.png?alt=media&token=87d07dd8-56a5-4935-88f8-e562923bc7c0"
            className="h-14 w-14 rounded-full cursor-pointer  mb-2 hover:scale-11 0"
            alt='logo'
            onClick={goHome}
        />

<h1 className="text-2xl font-mystery text-purple-600 text-center font-extrabold md:text-4xl">My Imaginary World</h1>

<div className="flex space-x-3">

<button className="group flex flex-col items-center text-center" onClick={createNewStory}>
    <PlusCircleIcon className="text-purple-500 h-12 w-12 group-hover:animate-bounce" />
    <p className="invisible group-hover:visible text-purple-500">New Story</p>
</button>



{pdfUrl && (
<button 
  role='link'
  disabled={!session}
  onClick={createCheckoutSession}
  className=''>

  <BookOpenIcon className="text-pink-600 h-12 w-12" />
  <p>Order this book</p>
  </button>
)}

{storyComplete && (
  <button onClick={() => console.log("set something to generate pdf in page")}>Generate PDF</button>
)}

{session && session.user?.image &&  (

  <img 
    src={session?.user?.image || defaultAvatar} 
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = defaultAvatar;
  }}
  
    onClick={logout}                            
    className="h-12 w-12 rounded-full cursor-pointer  mb-2 hover:opactiy-50"
    alt="Profile Pic"
/>
)}
</div>
</header>
    )
}
export default Header 