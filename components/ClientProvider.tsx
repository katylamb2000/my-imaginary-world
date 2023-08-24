'use client'

import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import {store} from "../app/GlobalRedux/store"

export default function ClientProvider(){
    return(
        <Provider store={store}>

            <Toaster position="top-right" />
        </Provider>
    )
}