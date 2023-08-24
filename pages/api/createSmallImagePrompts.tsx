// import type { NextApiRequest, NextApiResponse } from "next";
// // import query from "../../lib/createStoryApi";
// import imageQuery from "../../lib/storyImagePrompts";
// import admin from "firebase-admin";
// import { adminDb } from "../../firebaseAdmin";


// interface PageDetail {
//   page?: string;
//   backgroundImage?: string;
//   characterCloseUp?: string;
//   object?: string;
//   wildCardImage?: string;
//   [key: string]: string | undefined;
// }

// export default async function createSmallImagePrompts(
//   req: NextApiRequest,
//   res: NextApiResponse<{ answer: { message: string } | { data: { pages: [] | undefined }}}>

// ) 

// {
//   console.log(req.body);
//   const { session, prompt, storyId, pageId, promptType } = req.body
//     // console.log("session", session);
//     // console.log("prompt", prompt);
//     // console.log("storyId", storyId);

//   if (!prompt) {
//     res.status(400).json({ answer: { message: 'i dont have a prompt' } });
//     return;
//   }

//   if (!session) {
//     res.status(400).json({ answer: { message: 'i dont have a session' } });
//     return;
//   }

//   const response = await imageQuery(prompt);

//     console.log('this is the response', response.data)

// if (promptType == 'getSmallImagePrompt'){
//   const pageRef = adminDb
//         .collection('users')
//         .doc(session.user.email)
//         .collection('storys')
//         .doc(storyId)
//         .collection('storyContent')
//         .doc(pageId)
//         .update({
//             smallImagePrompt: response.data?.pages
//         });
// }
  
// if (promptType == 'improveSingleImagePrompt'){
//   const pageRef = adminDb
//         .collection('users')
//         .doc(session.user.email)
//         .collection('storys')
//         .doc(storyId)
//         .collection('storyContent')
//         .doc(pageId)
//         .update({
//             updatedImagePrompt: response.data
//         });
// }
  





//     res.status(200).json({ answer: { message: "Data successfully saved." } });

// }

import { NextApiRequest, NextApiResponse } from "next";
import imageQuery from "../../lib/storyImagePrompts";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";
import axios from 'axios';  // Ensure axios is imported

interface RequestBody {
  session: any;
  prompt: string;
  storyId: string;
  pageId: string;
  promptType: 'getSmallImagePrompt' | 'improveSingleImagePrompt';
}

export default async function createSmallImagePrompts(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { message: string } | { data: { pages: [] | undefined }}}>
) {
  const { session, prompt, storyId, pageId, promptType }: RequestBody = req.body;
  console.log(`i want to get prompt based on ${prompt}`)
  if (!prompt || !session) {
    res.status(400).json({ answer: { message: !prompt ? 'I don\'t have a prompt' : 'I don\'t have a session' } });
    return;
  }

//   try {
//     const response = await imageQuery(prompt);
//     let updateField: string;

//     switch (promptType) {
//       case 'getSmallImagePrompt':
//         updateField = 'smallImagePrompt';
//         break;
//       case 'improveSingleImagePrompt':
//         updateField = 'updatedImagePrompt';
//         break;
//       default:
//         res.status(400).json({ answer: { message: 'Invalid prompt type' } });
//         return;
//     }

//     await adminDb
//       .collection('users')
//       .doc(session.user.email)
//       .collection('storys')
//       .doc(storyId)
//       .collection('storyContent')
//       .doc(pageId)
//       .update({
//         [updateField]: response.data?.pages
//       });

//     res.status(200).json({ answer: { message: "Data successfully saved." } });

//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ answer: { message: "Internal Server Error" } });
//   }
// }

try {
  const response = await imageQuery(prompt);

  if (!response.data?.pages) {
    throw new Error("Received invalid data from the imageQuery");
  }

  let updateField: string;

  switch (promptType) {
    case 'getSmallImagePrompt':
      updateField = 'smallImagePrompt';
      break;
    case 'improveSingleImagePrompt':
      updateField = 'updatedImagePrompt';
      break;
    default:
      res.status(400).json({ answer: { message: 'Invalid prompt type' } });
      return;
  }

  await adminDb
    .collection('users')
    .doc(session.user.email)
    .collection('storys')
    .doc(storyId)
    .collection('storyContent')
    .doc(pageId)
    .update({
      [updateField]: response.data?.pages[1]
    });
  

  res.status(200).json({ answer: { message: "Data successfully saved." } });
  
  await sendPromptToMidjourney(response.data?.pages[1], storyId, session.user.email, pageId, promptType);


} catch (error: any) {
  console.error("Error:", error);
  res.status(500).json({ answer: { message: "Internal Server Error: " + error.message } });
}
}




const sendPromptToMidjourney = async (imagePrompt: string | undefined, storyId: string, userEmail: string, pageId: string, promptType: string) => {
    if (!imagePrompt) {
        throw new Error("Image prompt is undefined.");
    }
    const data = JSON.stringify({
        msg: imagePrompt,
        ref: { storyId: storyId, userId: userEmail, action: promptType, page: pageId },
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
