'use client'

import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import {store} from "../app/GlobalRedux/store"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function ClientProvider(){
    return(
        <Provider store={store}>

            <Toaster position="top-right" />
            <ProgressBar
        height="4px"
        color="#6b21a8"
        options={{ showSpinner: true }}
        shallowRouting
      />
        </Provider>
    )
}