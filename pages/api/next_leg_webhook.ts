// pages/api/webhook.ts
import { adminDb } from '../../firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    // Log the incoming data for debugging purposes
    console.log('ALL Webhook data:', req.body);

     // Extract the required data from the webhook response
     const { imageUrl, originatingMessageId, content, ref, buttonMessageId, buttons, seed } = req.body;

     // Deserialize the ref field to extract storyId, userId, and page
     const { storyId, userId, page, action, heroId } = ref;
     console.log('ACTION IS --', action)

 try{
     // Update the story data in Firestore
     if (action === 'seed') {
        const docRef = adminDb
          .collection('users')
          .doc(userId)
          .collection('characters')
          .doc(heroId)

          await docRef.update({
            seed: seed
        
          });
        }
     if (action === 'imagine') {
     const docRef = adminDb
       .collection('users')
       .doc(userId)
       .collection('storys')
       .doc(storyId)
       .collection('storyContent')
       .doc(page);
 
     await docRef.update({
       imageChoices: imageUrl,
       imagePromptContent: content,
       buttonMessageId,
       buttons
     });
    }

    if (action === 'button') {
        const docRef = adminDb
          .collection('users')
          .doc(userId)
          .collection('storys')
          .doc(storyId)
          .collection('storyContent')
          .doc(page);
    
        await docRef.update({
          finalImage: imageUrl,
        });
        if (page == 'page_1'){
          const docRef = adminDb
          .collection('users')
          .doc(userId)
          .collection('storys')
          .doc(storyId)
         
    
        await docRef.update({
          thumbNail: imageUrl,
        });
        }
       }

    if (action === 'createHero') {
      const docRef = adminDb
        .collection('users')
        .doc(ref.userId)
        .collection('characters')
        .doc(ref.heroId)

          await docRef.update({
            imageChoices: imageUrl,
            imagePrompt: content,
            buttonMessageId,
            buttons
          });

       }

       if (action === 'upscaleCharacter') {
        const docRef = adminDb
          .collection('users')
          .doc(userId)
          .collection('characters')
          .doc(heroId)

          await docRef.update({
            heroImage: imageUrl,
            buttonMessageId,
            buttons
          });
        }
        
 
res.status(200).json({ message: 'Webhook received' });
    
 }catch(err){
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
 }
    // Send a success response to acknowledge receipt of the webhook data

  } else {
    // Return an error if the request method is not POST
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
