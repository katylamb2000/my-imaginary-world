
import type { NextApiRequest, NextApiResponse } from "next";
import storyBaseIP from "../../lib/storyBaseIP";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
  storyId: string;
};

export default async function createStoryBaseImagePrompt(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: string }>
) {
  console.log(req.body);
  const { session, prompt, storyId } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: 'i dont have a prompt' });
    return;
  }

  if (!session) {
    res.status(400).json({ answer: 'i dont have a session' });
    return;
  }

  // ChatGPT query
  const response = await storyBaseIP(prompt);

  // Update the story data in Firestore
  const docRef = adminDb
    .collection("users")
    .doc(session.user.email)
    .collection('storys')
    .doc(storyId);

  await docRef.update({
    baseImagePromptCreated: true,
    baseImagePrompt: response,
  });

  res.status(200).json({ answer: response as string });
}