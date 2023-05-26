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
  const { session, storyId, prompt, hero, style } = req.body

  if (!prompt) {
    res.status(400).json({ answer: { message: 'Missing prompt' } });
    return;
  }

  if (!session) {
    res.status(400).json({ answer: { message: 'Missing session' }});
    return;
  }

  if (!storyId) {
    res.status(400).json({ answer: { message: 'Missing storyId' } });
    return;
  }

  // ChatGPT query
  const response = await query(prompt);

  // Save the story data to Firestore
  if (hasPages(response)) {
    try {
      for (let i = 0; i < response.pages.length; i++) {
        let sceneDescription = response.pages[i];
        let artInstruction = '';
        let colorPalette = 'vibrant warm colors'

        // switch(i) {
        //     case 0:
        //         artInstruction = `${hero} in her home environment, excited and dreaming about a magical adventure. She should look eager and hopeful. The color palette should be warm and inviting, with subtle hints of magic like glimmers of starlight, similar to the ${style} series.`;
        //         break;
        //     case 1:
        //         artInstruction = `${hero} stepping through a magical portal leading to the moon. The illustration should capture her awe and excitement. The colors used should transition from the warm hues of her home to the cooler, yet still vibrant, colors of the moon, still keeping with the ${style} series.`;
        //         break;
        //     default:
        //         artInstruction = `${hero} in an adventurous scene described as: ${sceneDescription}. Make sure to include elements of surprise, discovery, and joy in the illustration, keeping the color palette vibrant and in line with the ${style} series.`;
        //         break;
        // }

        let imagePrompt = `Illustrate ${sceneDescription}. Sophia is a a cute three year old girl in a tutu, with light brown shoulder length pigtails with bows, big blue eyes, and white ethnicity. The illustration should be in the style of ${style} with the color palette ${colorPalette}`;

        // Create a separate document for each page
        const pageRequest = {
          page: sceneDescription,
          pageNumber: i + 1,
          imagePrompt: imagePrompt
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

      // Save the story title and story
      await adminDb
        .collection("users")
        .doc(session.user.email)
        .collection("storys")
        .doc(storyId)
        .update({
          title: response.title,
          story: response.story
        });

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
