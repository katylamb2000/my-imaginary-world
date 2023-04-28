// import type { NextApiRequest, NextApiResponse } from "next";
// import imagePromtQuery from "../../lib/storyImagePrompts";
// import admin from "firebase-admin";
// import { adminDb } from "../../firebaseAdmin";

// type Data = {
//   answer: string;
//   storyId: string;
// };


// export default async function createStoryImagePrompts(
//   req: NextApiRequest,
//   res: NextApiResponse<{ answer: string }>
// ) {

//   console.log(req.body);
//   const { session, prompt, storyId, page } = req.body

//   if (!page) {
//     res.status(400).json({ answer: 'i dont have a page',  });
//     return;
//   }

//   if (!prompt) {
//     res.status(400).json({ answer: 'i dont have a prompt',  });
//     return;
//   }

//   if (!session) {
//     res.status(400).json({ answer: 'i dont have a session',  });
//     return;
//   }

//   // ChatGPT query
//   const response = await imagePromtQuery(prompt);

//   // Update the story data in Firestore
//   const docRef = adminDb
//     .collection("users")
//     .doc(session.user.email)
//     .collection('storys')
//     .doc(storyId)
//     .collection('storyContent')
//     .doc(page);

//   await docRef.update({
//     imagePrompt: response
//   });

//   res.status(200).json({ answer: response });
// }

import type { NextApiRequest, NextApiResponse } from "next";
import imagePromtQuery from "../../lib/storyImagePrompts";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
  storyId: string;
};


type ResponseObject =
  | string
  | { title: string; pages: string[]; story: string }
  | { message: string }
  | { imagePrompt: string | undefined };

export default async function createStoryImagePrompts(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: ResponseObject }>
  ) {

  console.log(req.body);
  const { session, prompt, storyId, page } = req.body


  if (!page) {
    res.status(400).json({ answer: { message: 'i dont have a page' } });
    return;
  }

  if (!prompt) {
    res.status(400).json({ answer: { message: 'i dont have a prompt' } });
    return;
  }

  if (!session) {
    res.status(400).json({ answer: { message: 'i dont have a session' } });
    return;
  }

  // ChatGPT query
  const response = await imagePromtQuery(prompt);

  // Update the story data in Firestore
  const docRef = adminDb
    .collection("users")
    .doc(session.user.email)
    .collection('storys')
    .doc(storyId)
    .collection('storyContent')
    .doc(page);

  await docRef.update({
    imagePromptCreated: true,
    imagePrompt: response
  });

  res.status(200).json({ answer: response });
}

