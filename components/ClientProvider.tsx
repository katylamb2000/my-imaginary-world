'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import {store} from "../app/GlobalRedux/store"
// import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import ProgressBar from '../components/ProgressBar'

export default function ClientProvider(){
    const router = useRouter()



    // useEffect(() => {
    //     const handleStart = (url) => { 
    //       console.log(`Loading: ${url}`)
    //       NProgress.start()
    //     }
    //     const handleComplete = (url) => { 
    //       console.log(`Loaded: ${url}`)
    //       NProgress.done()
    //     }
    
    //     router.events.on('routeChangeStart', handleStart)
    //     router.events.on('routeChangeComplete', handleComplete)
    //     router.events.on('routeChangeError', handleComplete)
    
    //     return () => {
    //       router.events.off('routeChangeStart', handleStart)
    //       router.events.off('routeChangeComplete', handleComplete)
    //       router.events.off('routeChangeError', handleComplete)
    //     }
    //   }, [router])
    return(
        <Provider store={store}>

            <Toaster position="top-right" />
            <ProgressBar
        // height="4px"
        // color="#6b21a8"
        // options={{ showSpinner: true }}
        // shallowRouting
      />
        </Provider>
    )
}