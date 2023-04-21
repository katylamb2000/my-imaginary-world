// // pages/api/getPrompts.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// // import { firestore } from '../../firebaseConfig';
// import { adminDb } from '../../firebaseAdmin';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {

//     const promptsSnapshot = await adminDb.collection('imagePrompts').get();

//     const prompts = promptsSnapshot.docs.map(doc => doc.data().prompt);

//     res.status(200).json(prompts);
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { storyId } = req.query;

    if (!storyId) {
      res.status(400).json({ message: 'Missing storyId parameter' });
      return;
    }

    const promptsSnapshot = await adminDb.collection('imagePrompts')
      .doc(storyId as string)
      .collection('pages')
      .get();

    const prompts = promptsSnapshot.docs.map(doc => doc.data().imagePrompt);

    res.status(200).json(prompts);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

