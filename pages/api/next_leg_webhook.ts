// pages/api/webhook.ts
import { adminDb } from '../../firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Log the incoming data for debugging purposes
    console.log('Webhook data:', req.body);

     // Extract the required data from the webhook response
     const { imageUrl, originatingMessageId, content, ref } = req.body;

     // Deserialize the ref field to extract storyId, userId, and page
     const { storyId, userId, page } = JSON.parse(ref);
 
     // Update the story data in Firestore
     const docRef = adminDb
       .collection('users')
       .doc(userId)
       .collection('storys')
       .doc(storyId)
       .collection('storyContent')
       .doc(page);
 
     await docRef.update({
       imageChoices: imageUrl,
       imagePrompt: content,
     });

    // Send a success response to acknowledge receipt of the webhook data
    res.status(200).json({ message: 'Webhook received' });
  } else {
    // Return an error if the request method is not POST
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
