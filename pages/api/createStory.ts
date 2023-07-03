import type { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/createStoryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
  storyId: string;
};

// Type guard to check if the response has pages
function hasPages(response: any): response is { title: string; pages: string[]; story: string } {
  return 'pages' in response && 'title' in response && 'story' in response;
}

export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { title: string; pages: string[]; story: string; } | { message: string } }>
) {
  const { session, storyId, prompt } = req.body
  console.log(session, storyId, prompt )
  // if (!prompt) {
  //   res.status(400).json({ answer: { message: 'Missing prompt' } });
  //   return;
  // }

  // if (!session) {
  //   res.status(400).json({ answer: { message: 'Missing session' }});
  //   return;
  // }

  // if (!storyId) {
  //   res.status(400).json({ answer: { message: 'Missing storyId' } });
  //   return;
  // }

  // ChatGPT query
  const response = await query(prompt);
  console.log('this is reposnse in create story =====>', response)

  // Save the story data to Firestore
  if (hasPages(response)) {
    try {
      for (let i = 0; i < response.pages.length; i++) {
        let sceneDescription = response.pages[i];
        let artInstruction = '';
        let colorPalette = 'vibrant warm colors'

        // Create a separate document for each page
        const pageRequest = {
          page: sceneDescription,
          pageNumber: i + 1,
          // imagePrompt: imagePrompt,
          fontSize: 24,
          fontColor: 'black'
        };
      
        await adminDb
              .collection("users")
              .doc(session.user.email)
              .collection('storys')
              .doc(storyId)
              .collection('storyContent')
              .doc(`page_${i + 1}`)
              .set(pageRequest);
     }

      await adminDb
      .collection("users")
      .doc(session.user.email)
      .collection('storys')
      .doc(storyId)
      .collection('storyContent')
      .doc(`full story`)
      .set(response);


      // Save the story title and story
      // await adminDb
      //   .collection("users")
      //   .doc(session.user.email)
      //   .collection("storys")
      //   .doc(storyId)
      //   .update({
      //     title: response.title,
      //     story: response.story
      //   });

    } catch (error) {
      console.error('Error writing to Firestore:', error);
      res.status(500).json({ answer: { message: 'Error occurred while saving to the database.' }});
      return;
    }
  } else {
    res.status(500).json({ answer: { message: 'Failed to create pages' }});
    return;
  }

  res.status(200).json({ answer: response });
}
