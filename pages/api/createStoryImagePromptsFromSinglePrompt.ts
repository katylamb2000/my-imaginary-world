
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";
import imagePromptCreator from "../../lib/createStoryImagePromptsCombined";

type Data = {
  answer: string;
  storyId: string;
};

function hasPages(response: any): response is { title: string; pagesImagesPrompts: string[]; story: string } {
  return "pagesImagesPrompts" in response;
}

export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { title: string; pagesImagesPrompts: string[]; story: string } | { message: string } }>
) {
  const { session, storyId, prompt } = req.body;

  if (!prompt || !session || !storyId) {
    res.status(400).json({ answer: { message: "Incomplete request data." } });
    return;
  }

  // ChatGPT query
  const response = await imagePromptCreator(prompt);

  // Save the story data to Firestore
  const storyRequest = {
    storyId,
    createdAt: admin.firestore.Timestamp.now(),
    user: session.user,
  };



  if (hasPages(response)) {
    const batch = adminDb.batch();
  
    const promises = response.pagesImagesPrompts.map((imagePrompt, index) => {
      if (index === 0) {
        return Promise.resolve();  // Skip the first element, which is the title page prompt
      }
  
      const pageNumber = index - 1;  // Adjust the page number
  
      const pageRequest = {
        imagePrompt: imagePrompt,
        pageNumber: pageNumber + 1,
      };
  
      const pageRef = adminDb
        .collection("users")
        .doc(session.user.email)
        .collection("storys")
        .doc(storyId)
        .collection("storyContent")
        .doc(`page_${index + 1}`) 
        
      return pageRef.update({
        imagePrompt: pageRequest
      });
    });
  
    await Promise.all(promises);
  } else {
    res.status(400).json({ answer: { message: "No pages in response." } });
    return;
  }

  res.status(200).json({ answer: response });
  
}

