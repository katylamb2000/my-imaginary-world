import type { NextApiRequest, NextApiResponse } from "next";
// import query from "../../lib/createStoryApi";
import imageQuery from "../../lib/storyImagePrompts";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

export default async function createStoryImagePrompts(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { message: string } | { data: { generalStyle: string | undefined; pages: { pageNumber: string, backgroundImage: string, characterCloseUp: string, object: string, wildCardImage: string }[] } } }>
) {
  console.log(req.body);
  const { session, prompt, storyId } = req.body

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

  const pages = response?.data?.pages;

  if (!pages) {
    console.error("Pages data is undefined.");
    res.status(500).json({ answer: { message: "Pages data is undefined." } });
    return;
  }

  try {
    const batch = adminDb.batch();

    for (let i = 0; i < pages.length; i++) {
      try {
        const cleanedPageString = pages[i].replace('undefined ', '');
        const page: { pageNumber: string, backgroundImage: string, characterCloseUp: string, object: string, wildCardImage: string } = JSON.parse(cleanedPageString);

        console.log("PAGE ~~~~~>>>", page)

        const pageRef = adminDb
            .collection("users")
            .doc(session.user.email)
            .collection("storys")
            .doc(storyId)
            .collection("images")
            .doc(`page_${page.pageNumber}`);

        batch.set(pageRef, {
            'backgroundImage': page.backgroundImage,
            'characterCloseUp': page.characterCloseUp,
            'objectImage': page.object,
            'wildcardImage': page.wildCardImage,
            'pageNumber': page.pageNumber
        });


      } catch (error) {
        console.error("Error while processing page: ", error);
      }

    }
    await batch.commit();
    res.status(200).json({ answer: { message:  "Data successfully saved." } });
  
} catch (error) {
    console.error("Error while saving data: ", error);
    res.status(500).json({ answer: { message: "An error occurred while saving data." } });
}
}
