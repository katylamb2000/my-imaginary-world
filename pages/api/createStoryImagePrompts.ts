import type { NextApiRequest, NextApiResponse } from "next";
// import query from "../../lib/createStoryApi";
import imageQuery from "../../lib/storyImagePrompts";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";


interface PageDetail {
  page?: string;
  backgroundImage?: string;
  characterCloseUp?: string;
  object?: string;
  wildCardImage?: string;
  [key: string]: string | undefined;
}

export default async function createStoryImagePrompts(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { message: string } | { data: { pages: [] | undefined }}}>

) 

{
  console.log(req.body);
  const { session, prompt, storyId, promptType } = req.body
    console.log("session", session);
    console.log("prompt", prompt);
    console.log("storyId", storyId);

  if (!prompt) {
    res.status(400).json({ answer: { message: 'i dont have a prompt' } });
    return;
  }

  if (!session) {
    res.status(400).json({ answer: { message: 'i dont have a session' } });
    return;
  }

  const response = await imageQuery(prompt);

    console.log('this is the response', response.data)
    const pagesArray = response.data?.pages?.filter(page => page !== '') || [];

    const pagePrompts = pagesArray.map(page => {
      const [_, number, ...rest] = page.split(' ');
      const details = rest.join(' ');
  
      if (promptType === 'firstImageIdeas'){
      return {
          // number: parseInt(number.replace(':', '')),
          firstImagePromptIdea: details
      };
    };
  });

    const batch = adminDb.batch();
if (promptType === 'firstImageIdeas'){
pagePrompts.forEach((prompt, index) => {
    const pageRef = adminDb
        .collection('users')
        .doc(session.user.email)
        .collection('storys')
        .doc(storyId)
        .collection('storyContent')
        .doc(`page_${index + 1}`);

    batch.update(pageRef, prompt);
});
}

if (promptType === 'smallImageIdeas'){
  pagePrompts.forEach((prompt, index) => {
      const pageRef = adminDb
          .collection('users')
          .doc(session.user.email)
          .collection('storys')
          .doc(storyId)
          .collection('storyContent')
          .doc(`page_${index + 1}`);
  
      batch.update(pageRef, prompt);
  });
  }
await batch.commit();


    res.status(200).json({ answer: { message: "Data successfully saved." } });

}