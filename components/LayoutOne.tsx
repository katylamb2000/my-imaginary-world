'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const DoublePageTemplate = () => {
const image1 = "https://cdn.discordapp.com/attachments/1124681343457050714/1137030517921951937/ZoeBarrett_In_the_style_of_Adam_Stower_illustrate_an_image_for__1f821522-d626-45d7-bfc0-36ff5ebdb735.png"
  const image2 = "https://cdn.discordapp.com/attachments/1124681343457050714/1137013315063779378/ZoeBarrett_In_the_style_of_Adam_Stower_illustrate_an_image_for__af25e66f-38cd-47d9-a1fa-30051f9807d6.png"
  const image3 = "https://cdn.discordapp.com/attachments/1124681343457050714/1137030517921951937/ZoeBarrett_In_the_style_of_Adam_Stower_illustrate_an_image_for__1f821522-d626-45d7-bfc0-36ff5ebdb735.png"
  const image4 = "https://cdn.discordapp.com/attachments/1124681343457050714/1137030517921951937/ZoeBarrett_In_the_style_of_Adam_Stower_illustrate_an_image_for__1f821522-d626-45d7-bfc0-36ff5ebdb735.png"
  const [textSentences, setTextSentences] = useState<string[]>([]); // Initialize with an empty array

  const ellipseClipPath = 'ellipse(70% 100% at 50% 0%)';
  const circleClipPath = 'circle(50% at 50% 50%)';
  const triangleClipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
  const heartClipPath = 'path("M256 28.7c-46.8 0-89.5 24-115.3 62.8C119.5 52.7 76.8 28.7 30 28.7 12.8 28.7 0 41.5 0 59.7c0 55.8 124.3 113.2 189.9 174.1 14.4 14.2 37.8 14.2 52.2 0C259.7 172.9 384 115.5 384 59.7c0-18.2-12.8-31-30-31z")';
  const pentagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)';
  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
  const octagonClipPath = 'polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)';
  const starClipPath = 'polygon(50% 0%, 61.8% 38.2%, 100% 35.3%, 69.1% 57.1%, 79.2% 91.7%, 50% 70%, 20.8% 91.7%, 30.9% 57.1%, 0% 35.3%, 38.2% 38.2%)';
  const cloudClipPath = 'path("M68.2 29.4c-3.3-7.4-9.6-14.5-17.6-19.4C41.6 4.7 36.4 0 30 0c-5.8 0-11 4.2-13.6 10.1C5.8 12.2 0 19.3 0 27.1 0 35 5.5 40.7 12.8 42.4c-0.4 1.4-0.6 2.9-0.6 4.4 0 9.8 7.9 17.7 17.7 17.7h53.4c9.8 0 17.7-7.9 17.7-17.7 0-2.4-0.5-4.7-1.2-6.9 6.3-1.7 11.9-7.4 14.2-15.3 0.1-0.6 0.2-1.2 0.2-1.8 0-7.1-5.3-13.2-12.5-14.3zM50 37.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4S50 39.7 50 37.5z")';
  const star2ClipPath = 'polygon(50% 0%, 61.8% 38.2%, 100% 35.3%, 69.1% 57.1%, 79.2% 91.7%, 50% 70%, 20.8% 91.7%, 30.9% 57.1%, 0% 35.3%, 38.2% 38.2%)';
  const diamondClipPath = 'polygon(50% 0%, 75% 50%, 50% 100%, 25% 50%)';
  const cloudRainClipPath = 'path("M40 32c0-7.2 5.8-13 13-13 2.9 0 5.5 1.1 7.5 2.9C65.3 16.9 72 23.7 72 32c0 8.8-7.2 16-16 16h-8v-2h8c6.6 0 12-5.4 12-12 0-3.3-1.3-6.3-3.4-8.5C68.2 24.7 70 28.1 70 32c0 4.4-3.6 8-8 8h-8v2h8C47.2 42 40 34.8 40 26z M32 8v2c-5 0-9.4 2.7-12 7C16.4 17.8 14 22.4 14 28c0 9.9 8.1 18 18 18 5.3 0 10-2.3 13.3-6H36c-6.6 0-12-5.4-12-12v-2c-5 0-9.4 2.7-12 7C16.4 17.8 14 22.4 14 28c0 9.9 8.1 18 18 18 5.5 0 10.2-2.4 13.5-6H36c-3.3 3.5-8 6-13 6C8.1 46 0 37.9 0 28s8.1-18 18-18c5 0 9.4 2.7 12 7c2.6-4.3 7-7 12-7z M10 34c-1.1 0-2-0.9-2-2s0.9-2 2-2h20c1.1 0 2 0.9 2 2s-0.9 2-2 2H10z M26 38c0 1.1-0.9 2-2 2s-2-0.9-2-2H10c0 1.1-0.9 2-2 2s-2-0.9-2-2c0-3.9 3.1-7 7-7h'


  const [clipPath, setClipPath] = useState<string>(ellipseClipPath)

    useEffect(() => {
        splitTextIntoSentences()
    }, [])

    const clipPathSelected = (pathSelected: string) => {
        if (pathSelected == 'circle' ){
            setClipPath(circleClipPath)
        }
        if (pathSelected == 'triangle' ){
            setClipPath(triangleClipPath)
        }
        if (pathSelected == 'heart' ){
            setClipPath(heartClipPath)
        }
        if (pathSelected == 'pentagon' ){
            setClipPath(pentagonClipPath)
        }
        if (pathSelected == 'hexagon' ){
            setClipPath(hexagonClipPath)
        }
        if (pathSelected == 'octagan' ){
            setClipPath(octagonClipPath)
        }
        if (pathSelected == 'star' ){
            setClipPath(starClipPath)
        }
        if (pathSelected == 'cloud' ){
            setClipPath(cloudClipPath)
        }
        if (pathSelected == 'star2' ){
            setClipPath(star2ClipPath)
        }
     
    }

  const  splitTextIntoSentences = () => {
    const text = 'The sea witch explained that she had lost a magical trinket that could grant wishes. She asked Sophia if she was willing to help her find it. Sophia eagerly agreed, and the sea witch gave her a map and a special request.'
    // Use a regular expression to split the text into sentences based on sentence-ending punctuation marks.
    const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/g);
    // Remove any leading or trailing whitespaces from each sentence.
    const cleanSentences = sentences.map((sentence) => sentence.trim());
    setTextSentences(cleanSentences)
    // return cleanSentences;
  }

return(
  <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className='bg-gray-50 h-full w-full items-center overscroll-none'>
            <div className="flex space-x-6 justify-center pt-4 h-4/5 bg-gray-50 ">
            
            <div className="border-2 border-gray-300 border-dashed h-4/5 w-3/5 bg-white drop-shadow-md">
            {/* <div className='h-1/2 w-full relative'> */}

                <div className='h-2/3 w-full bg-green-400 relative' style={{ clipPath: clipPath }}>
              <Image src={image1} alt="Image 1" layout="fill" objectFit="cover" className='' />
              {/* <div
                className='w-full h-full absolute top-0 left-0'
                style={{
                  background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 80%), url(${image1})`,
                  backgroundSize: 'cover',
                  clipPath,
                  border: '8px solid white',
                }}
              /> */}
            </div>
                <div className='h-1/3 w-full bg-white items-center justify-center'>
                    <p className="text-xl font-bold text-center text-rose-500 p-8 h-full ">
                        {textSentences[0]}
                    </p>
                </div>
            </div>
            <div className="border-2 border-gray-300 border-dashed  h-4/5 w-3/5 bg-white drop-shadow-md flex">
                <div className='h-full w-1/2 bg-orange-400 relative'>
                    <Image src={image2} alt="Image 1" fill />
                </div>
                <div className='h-full w-1/2 bg-pink-400 justify-center items-center'>
                    <p className="text-xl font-bold text-center h-full my-auto ">
                        {textSentences[1]}
                    </p>
                    <p className="text-xl font-bold text-center">
                        {textSentences[2]}
                    </p>
                </div>
            </div>
       
        </div>
      </div>
      <div className='flex-col space-y-3'>
        <button onClick={() => clipPathSelected('triangle')}>triangle</button>
        <button onClick={() => clipPathSelected('circle')}>circle</button>
        <button onClick={() => clipPathSelected('heart')}>heart</button>
        <button onClick={() => clipPathSelected('pentagon')}>pentagon</button>
        <button onClick={() => clipPathSelected('hexagon')}>hexagon</button>
        <button onClick={() => clipPathSelected('star')}>star</button>
        <button onClick={() => clipPathSelected('cloud')}>cloud</button>
        <button onClick={() => clipPathSelected('cloud2')}>cloud2</button>
        <button onClick={() => clipPathSelected('cloud3')}>cloudRain</button>
        <button onClick={() => clipPathSelected('raindrops')}>raindrops</button>
        <button onClick={() => clipPathSelected('star2')}>star2</button>

 
      </div>
    </div>
  );
};

export default DoublePageTemplate;




