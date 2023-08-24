'use client'
import { signIn } from "next-auth/react"
import Image from "next/image"

function Login() {

  return (
    // <div className="bg-gradient-to-r from-purple-600 to-pink-500 min-h-screen flex flex-col items-center justify-center">
    //   <header className="text-5xl font-extrabold text-white mb-10">Welcome to My Imaginary World!</header>
    //   <img src="https://media.discordapp.net/attachments/1082310627151855657/1139619960944087081/katy2000_A_young_child_sitting_on_a_cloud_surrounded_by_colorf_d4ecbfca-ad6c-4f4b-bb12-e75b8765b4b1.png?width=1892&height=1060" alt="Custom Children's Books" 
    //   // className="rounded-full shadow-lg w-56 mb-12" />
    //   className="w-full" />
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 min-h-screen flex flex-col items-center justify-center relative">
    <header className="text-8xl font-extrabold text-white absolute top-14 z-10">
      Welcome to LiteraVerse!
    </header>
    <button onClick={() => signIn('google')} className="text-white font-bold text-8xl animate-pulse absolute bottom-4 z-10 ">
        step in to begin!
      </button>
    <div className="w-full h-2/3 overflow-hidden">
      {/* <img src="link-to-your-image" alt="Custom Children's Books" className="w-full h-full object-cover" /> */}
      <img src="https://media.discordapp.net/attachments/1082310627151855657/1139624966439043123/katy2000_An_enchanted_forest_with_a_child_protagonist_leading__7b405130-6424-4081-80ff-4bb73424ba3d.png?width=2120&height=1060"
        // {/* <img src="https://media.discordapp.net/attachments/1082310627151855657/1139619960944087081/katy2000_A_young_child_sitting_on_a_cloud_surrounded_by_colorf_d4ecbfca-ad6c-4f4b-bb12-e75b8765b4b1.png?width=1892&height=1060"  */}
        alt="Custom Children's Books" 
    // className="rounded-full shadow-lg w-56 mb-12" />
    className="w-full" />

    </div>
    <div className="mt-8 max-w-3xl bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
      <p className="text-xl text-gray-700 mb-12">
        Unleash Creativity with AI-Powered Custom Children's Books
      </p>
      <div className="max-w-3xl bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Choose LiteraVerse?</h2>
        <ul className="text-left text-gray-700">
          <li className="mb-4">
            📚 <span className="font-bold">AI-Driven Creativity:</span> Transform your inputs into captivating narratives.
          </li>
          <li className="mb-4">
            🎨 <span className="font-bold">Easy Customization:</span> Tailor every detail with our intuitive interface.
          </li>
          <li className="mb-4">
            🌈 <span className="font-bold">Diverse Themes:</span> Explore a myriad of exciting themes.
          </li>
          <li className="mb-4">
            📷 <span className="font-bold">Add Photos:</span> Personalize the story with cherished memories.
          </li>
          <li>
            📦 <span className="font-bold">Order Your Own Printed Copy:</span> Get a premium hardcover book.
          </li>
        </ul>
      </div>
   
    </div>
    </div>
  );
};






export default Login