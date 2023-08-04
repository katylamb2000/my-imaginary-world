'use client'
import { FormEvent, useState } from 'react'
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setUsername } from '../app/GlobalRedux/Features/userDetailsSlice';

function UpdateUserNameForm() {
    const [userName, setUserName] = useState<string>('')
    const { data: session} = useSession()
    const dispatch = useDispatch()

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
        const docRef = doc(db, "users", session?.user?.email!, );
        const updatedUserName = await updateDoc(docRef, {
          userName: userName
        });
        console.log(updatedUserName)
        dispatch(setUsername(updatedUserName)) 
      }catch(err){
        console.log(err)
      }
      }


  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div>
            <p className="text-2xl font-bold text-purple-700 mb-4">Hello Adventurer!</p>
            <p className="text-lg text-gray-700 mb-4"> 
                Welcome to your storytelling journey! I'm your AI companion, an expert in crafting tales from the farthest reaches of imagination. Before we begin, could you tell me your preferred name?
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <input className="mt-4 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-purple-500" placeholder="Enter your name here..." value={userName} onChange={(e) => setUserName(e.target.value)} />
            </form>
        </div>
    </div>
  )
}

export default UpdateUserNameForm