'use client'

import Image from "next/image"
import { db } from '../firebase'
import { useCollection, useDocument, } from 'react-firebase-hooks/firestore'
import { collection, query, where, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { usePathname } from "next/navigation"
import { HomeIcon, MapIcon, BriefcaseIcon, MagnifyingGlassCircleIcon, StarIcon, PlusCircleIcon  } from "@heroicons/react/24/solid";
import { Menu } from "@mui/icons-material";
import GeneratePDF from "./generatePDF";
import { signOut } from 'next-auth/react'
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../app/GlobalRedux/Features/storyBuilderActiveSlice";
import axios from "axios";
import { setbuttonMsgId, setEditBarType, setId, setImageUrl, setImprovedImageButtonId, setText } from "../app/GlobalRedux/Features/pageToEditSlice";
import { setCoverImage, setSelectedTitle, setStoryId, setThumbnailImage, setTitle, setTitleIdeas } from "../app/GlobalRedux/Features/viewStorySlice";
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
    const [storyFromPathnameId, setStoryFromPathnameId] = useState<null | string>(null)
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
      console.log(storyId)
        if (!pathname) return;
          const regex = /^\/story\/([a-zA-Z0-9]+)$/;
          const id = regex.exec(pathname);
        
          if (id) {
            const identifier = id[1];
            setStoryFromPathnameId(identifier);  
            dispatch(setStoryId(identifier))
          } else {
            console.log("No match");
          }
        }, [pathname])

        const [story, storyLoading, storyError] = useDocument(
          session?.user?.email && storyId
            ? doc(db, 'users', session.user.email, 'storys', storyId)
            : null
        );

    const createCheckoutSession = async() => {
      console.log('should be creating checkout session', storyId)
         const stripe = await stripePromise; 
         const stateToSave = {
          storyId: storyId,
          pdfUrl: pdfUrl
          // ... other relevant data
        };
        
        localStorage.setItem('checkoutData', JSON.stringify(stateToSave));
        
        try{
         // call the backend to creae a checkout session!
         const checkoutSession = await axios.post('/api/checkout_sessions', 
          {
            items: 'book',
            userSession: session,
            storyId: storyId,
          });
          console.log("Response from API:", checkoutSession.data);
          //redirect to checkour
          const result = await stripe?.redirectToCheckout({
            sessionId: checkoutSession.data.id
          })
          console.log('RESULT ==>', result)
          dispatch(setIsLoading(true))
          if (result?.error) {
            alert(result.error.message);
          }
        }catch(err){
          console.log('ERR ==>', err)
        }
      }

  const goHome = () => {
      dispatch(setName('CoverPage'))
      dispatch(setEditBarType('main'))
      dispatch(setStoryId(null))
      dispatch(setEditBarType('main'))
      dispatch(setStoryId(null))
      dispatch(setThumbnailImage(null))
      dispatch(setCoverImage(null))
      dispatch(setbuttonMsgId(null))
      dispatch(setImprovedImageButtonId(null))
      dispatch(setText(null))
      dispatch(setTitleIdeas(null))
      dispatch(setSelectedTitle(null))
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
    dispatch(setThumbnailImage(null))
    dispatch(setCoverImage(null))
    dispatch(setbuttonMsgId(null))
    dispatch(setImprovedImageButtonId(null))
    dispatch(setText(null))
    dispatch(setTitleIdeas(null))
    dispatch(setSelectedTitle(null))
    dispatch(setTitle(null))
    signOut()
  }

  const createNewStory = async() => {
    const doc = await addDoc(collection(db, "users", session?.user?.email!, 'storys'), {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(), 
        fullImagePrompt: null
    });
      dispatch(setIsLoading(true))
      dispatch(setName('create story outline'))
      router.push(`/story/${doc.id}`)
  }

return(

<header className="sticky top-0 z-50 p-4 w-full border-b shadow-md bg-white md:p-6 border-purple-200 flex justify-between items-center space-x-4">
    <button onClick={() => console.log('open side menu only in mobile./')} className="md:hidden">
      <Menu className="text-gray-600"/>
    </button>
  <div className="flex items-center space-x-4 cursor-pointer" onClick={goHome}>
    <img
      src="https://firebasestorage.googleapis.com/v0/b/my-imaginary-world-b5705.appspot.com/o/MyImaginaryWorldLogo.png?alt=media&token=87d07dd8-56a5-4935-88f8-e562923bc7c0"
      className="h-10 w-10 md:h-14 md:w-14 rounded-full hover:opacity-80"
      alt='logo'
    />
    <h1 className="hidden text-2xl font-extrabold text-purple-600 md:block font-mystery">My Imaginary World</h1>
  </div>

    <div className="flex items-center space-x-4">
        <button className="group flex flex-col items-center text-center hover:text-purple-500" onClick={createNewStory}>
            <PlusCircleIcon className="h-10 w-10 group-hover:animate-bounce" />
            <p className="hidden mt-1 group-hover:visible">New Story</p>
        </button>

        {pdfUrl && (
            <button role='link' disabled={!session} onClick={createCheckoutSession} className="flex flex-col items-center text-center hover:text-pink-600">
                <BookOpenIcon className="h-10 w-10" />
                <p className="mt-1">Order this book</p>
            </button>
        )}

        {/* {storyComplete && (
            <button className="bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50" onClick={() => console.log("set something to generate pdf in page")}>
                Generate PDF
            </button>
        )} */}

        {session && session.user?.image && (
            <img 
                src={session?.user?.image || defaultAvatar} 
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = defaultAvatar;
                }}
                onClick={logout}                            
                className="h-12 w-12 rounded-full hover:opacity-80"
                alt="Profile Pic"
            />
        )}
    </div>
</header>

    )
}
export default Header 