
import { adminDb, firebaseStorage } from "../../firebaseAdmin";

import openai from '../../lib/chatgpt';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import type { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/createStoryApi";
import { generateCharacterDescriptions } from "../../lib/createCharacterDescriptions";

export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { message: string  } | { data: { title: string | undefined; pages: string[]; story: string; } } }>
) {
  const { session, storyId, prompt, hero } = req.body;
  console.log('req stuff', session, storyId)
  try {

    // Fetch the response from ChatGPT
    const response = await query(prompt);
    console.log('responzo ===> ', response)
    // Save the story data to Firestore

const { pages, title } = response.data || {}; // Handle undefined response.data

    if (!pages) {
      res.status(400).json({ answer: { message: 'Invalid response data.' } });
      return;
    }

    const batch = adminDb.batch();

    if (title) {
      const titleRef = adminDb
        .collection('users')
        .doc(session.user.email)
        .collection('storys')
        .doc(storyId)
        .collection('storyContent')
        .doc('title');
    
      await titleRef.set({ text: title });
    }

    pages.forEach((page, index) => {
      const pageRequest = {
        text: page,
        pageNumber: index + 1,
      };

      const pageRef = adminDb
        .collection('users')
        .doc(session.user.email)
        .collection('storys')
        .doc(storyId)
        .collection('storyContent')
        .doc(`page_${index + 1}`);

      batch.set(pageRef, pageRequest);
    });

    await batch.commit();

    const storyRef = adminDb
      .collection("users")
      .doc(session.user.email)
      .collection("storys")
      .doc(storyId);

    storyRef.set({
      fullStory: pages,
    });

    try {
      const characterDescriptions = await generateCharacterDescriptions(session, storyId, pages, hero);
        console.log('Generated character descriptions:', characterDescriptions);
    } catch (error) {
        console.error('Error while generating character descriptions:', error);
        res.status(500).json({ answer: { message: "Error occurred while generating character descriptions." } });
      return;
    }

    res.status(200).json({ answer: { message: 'Story created successfully.' } });

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ answer: { message: 'An error occurred while processing the request.' } });
  }
}





