// pages/api/openai.ts
import { adminDb } from "../../firebaseAdmin";
import admin from "firebase-admin"
import type { NextApiRequest, NextApiResponse } from 'next';
import assistantConversation from '../../lib/createAssistantConversations'


type Data = {
  answer?: string;
  error?: string;
};


type ErrorResponse = {
  success: boolean;
  message: string;
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method === 'POST') {
    const { userMessage, promptType, userId, pageId, storyId } = req.body;
    console.log(userMessage, promptType, userId, pageId, storyId)

    const answer = await assistantConversation(userMessage);
    console.log("Answer", answer)

    if (answer && answer.success) {
      res.status(200).json({ answer: answer.data });
    } else if (answer) {
      res.status(200).json({ answer: answer.message });
    } else {
      // Handle the case where answer is undefined or in an unexpected format
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
    

    if (promptType == 'initialRead'){
    const messagesRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("storys")
    .doc(storyId)
    .collection("aiMessages");

    // Create a new document for each message
    const messageDocRef = messagesRef.doc();
    await messageDocRef.set({ 
      content: answer, 
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      // Add other relevant fields like senderId, receiverId, etc.
    });
  }
    if (typeof answer === 'string') {
        if (promptType == 'addAPageOfText') {
            const pageRef = adminDb
            .collection("users")
            .doc(userId)
            .collection("storys")
            .doc(storyId)
            .collection("storyContent")
            .doc(pageId); 

            await pageRef.update({text: answer});
        }

        res.status(200).json({ answer });
    } else {
        res.status(500).json({ error: 'Server error' });
    }
  }
}
