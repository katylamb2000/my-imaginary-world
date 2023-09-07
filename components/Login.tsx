'use client'
import { signIn } from "next-auth/react"

import React from 'react';
import Head from 'next/head';

import Image from 'next/image'

 function Login() {

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center">
      <Head>
        <title>AI Children's Book Generator</title>
        <meta name="description" content="Create custom children's books using cutting-edge AI technology!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-r from-sunset-pink to-sunset-orange text-white py-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-center">AI Children's Book Generator</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-12">
        {/* Hero section */}
        <section className="relative h-[500px] text-center py-12">
        <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" 
              className="absolute z-0" 
              alt="AI generated story" 
              layout="fill" 
              objectFit="cover" />
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <h2 className="text-4xl font-semibold bg-white bg-opacity-60 inline-block py-2 px-4 rounded text-sunset-orange">Stories Beyond Imagination</h2>
          <p className="text-xl mt-2 bg-white bg-opacity-60 inline-block py-2 px-4 rounded text-sunset-orange">
            Experience a fusion of your creativity with the magic of AI. Dive into tales where the only limit is the horizon.
          </p>
        </div>
      </section>


        {/* Exploration section */}
        <section className="text-center py-12 space-y-6">
          <h2 className="text-4xl font-semibold">A New Dawn in Storytelling</h2>
          <p className="text-lg">
            With the dawn of AI, unlock narratives that were once only a figment of the imagination. We are not just a tool, we're a companion on your creative journey.
          </p>
          <p className="text-lg">
            Mistakes? Inconsistencies? Remember, every quirk is an opportunity. Embrace the unpredictable and craft tales that stand out. 
          </p>
        </section>

   {/* ... */}

{/* Features section */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-8">
  <div className="flex flex-col items-center space-y-4">
    <div className="bg-sunset-orange h-32 w-32 rounded-full mb-4 shadow-lg flex items-center justify-center">
      {/* Placeholder for icon or image */}
      <span className="text-6xl text-white font-bold">1</span>
    </div>
    <h3 className="text-2xl font-semibold">Interactive Learning</h3>
    <p className="text-center">Embark on a learning quest to master AI storytelling.</p>
  </div>
  
  <div className="flex flex-col items-center space-y-4">
    <div className="bg-sunset-orange h-32 w-32 rounded-full mb-4 shadow-lg flex items-center justify-center">
      {/* Placeholder for icon or image */}
      <span className="text-6xl text-white font-bold">2</span>
    </div>
    <h3 className="text-2xl font-semibold">Personalized Adventures</h3>
    <p className="text-center">Infuse personal touches into AI-crafted tales for a story that’s uniquely yours.</p>
  </div>
  
  <div className="flex flex-col items-center space-y-4">
    <div className="bg-sunset-orange h-32 w-32 rounded-full mb-4 shadow-lg flex items-center justify-center">
      {/* Placeholder for icon or image */}
      <span className="text-6xl text-white font-bold">3</span>
    </div>
    <h3 className="text-2xl font-semibold">Unbound Creativity</h3>
    <p className="text-center">No templates. No boundaries. Just raw, unfiltered creativity merging with AI magic.</p>
  </div>
  
  <div className="flex flex-col items-center space-y-4">
    <div className="bg-sunset-orange h-32 w-32 rounded-full mb-4 shadow-lg flex items-center justify-center">
      {/* Placeholder for icon or image */}
      <span className="text-6xl text-white font-bold">4</span>
    </div>
    <h3 className="text-2xl font-semibold">AI Evolution</h3>
    <p className="text-center">As AI learns and evolves, watch your stories become more vivid and captivating.</p>
  </div>
  
  <div className="flex flex-col items-center space-y-4">
    <div className="bg-sunset-orange h-32 w-32 rounded-full mb-4 shadow-lg flex items-center justify-center">
      {/* Placeholder for icon or image */}
      <span className="text-6xl text-white font-bold">5</span>
    </div>
    <h3 className="text-2xl font-semibold">Community & Feedback</h3>
    <p className="text-center">Share stories, gain insights, and grow alongside a community of like-minded creators.</p>
  </div>

  <div className="flex flex-col items-center space-y-4">
    <div className="bg-sunset-orange h-32 w-32 rounded-full mb-4 shadow-lg flex items-center justify-center">
      {/* Placeholder for icon or image */}
      <span className="text-6xl text-white font-bold">6</span>
    </div>
    <h3 className="text-2xl font-semibold">Evergreen Updates</h3>
    <p className="text-center">Stay updated with the latest AI advancements and storytelling techniques.</p>
  </div>
</section>



{/* Gallery Section */}
<section className="py-16">
  <h2 className="text-4xl font-semibold text-center mb-8">Explore Our Stories</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
    
    
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>
    <div className="group relative">
    <Image src="https://media.discordapp.net/attachments/1082310627151855657/1144609013682684014/katy2000_A_cartoon_child_in_Pixars_signature_style_holds_a_glo_61db53a0-7545-48e2-9ffb-b5b30aface6c.png?width=1418&height=804" alt='/' layout="responsive" width={200} height={300} className="rounded-md transform group-hover:scale-105 transition-transform duration-300"/>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black pb-2 pt-4 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-center text-white font-semibold">Story Title 1</h3>
      </div>
    </div>

    
    
    {/* Replicate the above block for each story thumbnail */}
    {/* ... */}

  </div>
</section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-semibold">Ignite the Spark of Creation</h2>
          <p className="text-xl mt-2">Are you ready to co-write with the future?</p>
          <button 
            onClick={() => signIn()}
            className="bg-gradient-to-r from-sunset-pink to-sunset-orange text-white px-8 py-3 mt-6 rounded-full shadow-lg hover:opacity-90 transition duration-300">Begin Your Story</button>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-sunset-pink to-sunset-orange text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 AI Children's Book Generator. Crafted with love and algorithms.</p>
        </div>
      </footer>
    </div>
  )
}
export default Login