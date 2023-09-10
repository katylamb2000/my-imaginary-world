
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "../../firebaseAdmin";
import singlPageSmallImageQuery from "../../lib/singlePageSmallImagePrompt";
import imageQuery from "../../lib/storyImagePrompts";

interface PageDetail {
  pageNumber: string;
  characterCloseUp: string;
  object: string;
  wildCardImage: string;
}

// ... (other imports)

export default async function singlePageCreateSmallImageIdeas(
    req: NextApiRequest,
    res: NextApiResponse<{ answer: { message: string } }>
  ) {
    const { session, prompt, storyId, promptType, pageId } = req.body;
  
    if (!prompt || !session) {
      res.status(400).json({ answer: { message: 'Missing prompt or session data.' } });
      return;
    }
  
    const response = await singlPageSmallImageQuery(prompt);
  
    if (!response.success) {
      res.status(500).json({ answer: { message: response.message } });
      return;
    }
  
    if (!response.data || !response.data.imageDescriptions) {
      res.status(500).json({ answer: { message: "Response data is missing." } });
      return;
    }
  
    const imageDescriptions = response.data.imageDescriptions;
  
    const { characterCloseUp, object, wildCardImage } = imageDescriptions;
    console.log('1', characterCloseUp, '2', object, '3', wildCardImage)
  
    const pageRef = adminDb
      .collection("users")
      .doc(session.user.email)
      .collection("storys")
      .doc(storyId)
      .collection("storyContent")
      .doc(pageId);
  
    await pageRef.update({
      characterCloseUp,
      object,
      wildCardImage,
    });
  
    res.status(200).json({ answer: { message: "Data successfully updated." } });
  }
  