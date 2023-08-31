import type { NextApiRequest, NextApiResponse } from "next";
import createCoverImagePromptHelper from "../../lib/createCoverImagePromptHelper"
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
  storyId: string;
};


export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ coverImagePrompt: string } | { message: string }>

) {
  const { session, storyId, prompt, promptType } = req.body
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
  const response = await createCoverImagePromptHelper(prompt);
  console.log(response)

  if (promptType == 'coverImage'){
      
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


res.status(200).json(response);

}