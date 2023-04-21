'use client'
import { signIn } from "next-auth/react"
import Image from "next/image"

function Login() {
  return (
    <div className='bg-white h-screen flex flex-col items-center justify-center text-center'>
 
      <button onClick={() => signIn('google')} className="text-purple-500 font-bold text-3xl animate-pulse ">
        Sign in to My Imaginary World
      </button>
    </div>
  )
}

export default Login