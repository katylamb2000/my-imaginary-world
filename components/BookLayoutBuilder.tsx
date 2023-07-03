import Image from "next/image"
import { useEffect, useState } from "react"
import Draggable from "react-draggable"
import { useSession } from "next-auth/react"
import axios from "axios";

type Props = {
    title: string,
    coverImage: string,
    story: string,
    heroDescription: string,
    style: string,
    storyId: string | null
}

interface Data  {
  coverImagePrompt: string
}

function BookLayoutBuilder({ title, coverImage, story, heroDescription, style, storyId }: Props) {
    const { data: session } = useSession()
    const [coverImagePrompt, setCoverImagePrompt] = useState<string | null>(null)
    console.log('coverImage', coverImage)

  const getCoverImagePrompt = async() => {
    console.log('get the story and ask for a cover image prompt', story )
    const prompt = `Create a prompt for a story image generator - the full story is ${story}. The hero character is ${heroDescription} The style to be referenced is ${style}. You do not need to give the characters name in the prompt only a description of the story. Also do no start the prompt with "Prompt:" you can just write as a natural sentence. Please make clear the style of illustration to use with reference to a specific illustrator.  `
  
    try{
     const response = await fetch('/api/createCoverImagePrompt', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt, 
          session,
          storyId: storyId, 
  
        }),
      });
      const data = await response.json();
      console.log('this iss the DATA =>', data.coverImagePrompt)
      console.log('if we have prmpts but no images create images next!')
      // const imagePrompt = data.coverImagePrompt
      // createCoverImage(data)
      setCoverImagePrompt(data.coverImagePrompt)
   
    }catch(err){
      console.log(err)
    //   setGettingBasePrompt(false)
    }
  }

  useEffect(() => {
    // createCoverImage()

    // sendSmsWithCoverImageDetails()
    console.log("will send sms")
  }, [coverImagePrompt])

      const sendSmsWithCoverImageDetails = async () => {
      console.log('trying to send sms')
      const phoneNumber = '+447309693489'
      const message = `you have a new request for a cover Image!: ${coverImagePrompt}. User: ${session!.user!.email}. StoryID: ${storyId}. `
      const toEmail = 'katylamb2000@gmail.com'
      try {
        const response = await fetch("/api/sendSms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ toPhoneNumber: phoneNumber, message, toEmail }),
        });
  
        if (response.ok) {
          console.log("SMS and email sent successfully!");
        } else {
          console.error("Error sending SMS or email");
        }
      } catch (error) {
        console.error("Error sending SMS or email:", error);
      }
    };

  const createCoverImage = async() => {
    if (!session || !storyId || !coverImagePrompt) return;
    console.log('this is the cover image prompt from sate', coverImagePrompt)
      // setLoading(true)
      var data = JSON.stringify({
        msg: coverImagePrompt,
        ref: { storyId: storyId, userId: session!.user!.email, action: 'imagineCoverImage' },
        webhookOverride: ""
      });
      
      var config = {
        method: 'post',
        url: 'https://api.thenextleg.io/v2/imagine',
        headers: { 
          'Authorization': `Bearer ${process.env.next_leg_api_token}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        // setLoading(false)
      })
      .catch(function (error) {
        console.log(error);
        // setLoading(false)
      });
    }
  

    return (
      <div className='bg-gray-100 h-full w-full overscroll-none flex justify-center items-center'>

            <div className="border-2 border-gray-300 h-120 w-120 bg-white drop-shadow-md mb-48 text-center">
              {coverImage ? (

                <Image src={coverImage} className='w-full h-full' alt="/" />
              ):
              <button 
                    onClick={getCoverImagePrompt}
                    className="text-purple-300 text-sm border border-purple-300 rounded-lg hover:text-purple-500 hover:border-purple-500 hover:shadow-2xl p-4 mt-6"
                    >
                        Get cover image
                </button>

            }
                <Draggable bounds='parent'>
                    <h1 className='text-purple-600 font-mono text-5xl'>{title}</h1>
                </Draggable>
              
              </div>
  
      </div>
    )
  }
  
  export default BookLayoutBuilder