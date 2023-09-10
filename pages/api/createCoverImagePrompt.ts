import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import createCoverImagePromptHelper from "../../lib/createCoverImagePromptHelper"
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
  storyId: string;
};

type ResponseType = { coverImagePrompt: string } | { message: string };


export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ coverImagePrompt: string } | { message: string }>

) {
  const { session, storyId, prompt, promptType, pageId } = req.body
  console.log(session, storyId, prompt)

  if (!prompt) {
    res.status(400).json( { message: 'Missing prompt' } );
    return;
  }

  if (!session) {
    res.status(400).json({ message: 'Missing session' });
    return;
  }

  if (!storyId) {
    res.status(400).json({ message: 'Missing storyId' });
    return;
  }

  // ChatGPT query



  const response: ResponseType = await createCoverImagePromptHelper(prompt);
  console.log(response)

  if (promptType == 'coverImage'){
    if ('coverImagePrompt' in response && !response.coverImagePrompt) {
      throw new Error('message' in response ? (response.message as string) : "Received invalid data from the imageQuery");
    }
    
        await adminDb
              .collection("users")
              .doc(session.user.email)
              .collection('storys')
              .doc(storyId)
              .collection('storyContent')
              .doc('page_1')
              .update({
                coverImagePrompt: response
              });
      
  }
  try{
    if ('coverImagePrompt' in response && !response.coverImagePrompt) {
      throw new Error('message' in response ? (response.message as string) : "Received invalid data from the imageQuery");
    }
    
    if (promptType === 'improvedImagePrompt') {
      if ('coverImagePrompt' in response) {
        const improvedPrompt = response.coverImagePrompt;
        await adminDb
          .collection("users")
          .doc(session.user.email)
          .collection('storys')
          .doc(storyId)
          .collection('storyContent')
          .doc(pageId)
          .update({
            improvedImagePrompt: improvedPrompt
          });
      } else {
        throw new Error('Cover Image Prompt not found in response');
      }
    }

    if (promptType === 'improvedSmallImagePrompt') {
      if ('coverImagePrompt' in response) {
        const improvedPrompt = response.coverImagePrompt;
        await adminDb
          .collection("users")
          .doc(session.user.email)
          .collection('storys')
          .doc(storyId)
          .collection('storyContent')
          .doc(pageId)
          .update({
            improvedImagePrompt: improvedPrompt
          });
      } else {
        throw new Error('Cover Image Prompt not found in response');
      }
    }
    


res.status(200).json(response);

if ('coverImagePrompt' in response) {
  const imagePrompt = response.coverImagePrompt
  await sendPromptToMidjourney(imagePrompt, storyId, session.user.email, pageId, promptType);
} else {
  console.error("Cover Image Prompt not found in the response:", response.message);
  // Handle error or throw an exception as per your application's requirements.
}

} catch (error: any) {
  console.error("Error:", error);
  res.status(500).json({ message: "Internal Server Error: " + error.message });
}
}

const sendPromptToMidjourney = async (imagePrompt: string | undefined, storyId: string, userEmail: string, pageId: string, promptType: string) => {
  if (!imagePrompt) {
      throw new Error("Image prompt is undefined.");
  }
  const data = JSON.stringify({
      msg: imagePrompt,
      ref: { storyId: storyId, userId: userEmail, action: 'improveSingleImagePrompt', page: pageId },
      webhookOverride: ""
  });

  const config = {
      method: 'post',
      url: 'https://api.thenextleg.io/v2/imagine',
      headers: {
          'Authorization': `Bearer ${process.env.next_leg_api_token}`,
          'Content-Type': 'application/json'
      },
      data: data
  };

  try {
      const response = await axios(config);
      console.log("Midjourney Response:", JSON.stringify(response.data));
  } catch (error) {
      console.error("Error sending to Midjourney:", error);
      throw error;  // If you want the main function to catch this error too
  }
};