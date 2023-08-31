
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";
import imageQuery from "../../lib/storyImagePrompts";

interface PageDetail {
  pageNumber: string;
  characterCloseUp: string;
  object: string;
  wildCardImage: string;
}

// ... (other imports)

export default async function createStoryImagePrompts(
    req: NextApiRequest,
    res: NextApiResponse<{ answer: { message: string } }>
  ) {
    const { session, prompt, storyId, promptType } = req.body;
  
    if (!prompt || !session) {
      res.status(400).json({ answer: { message: 'Missing prompt or session data.' } });
      return;
    }
  
    const response = await imageQuery(prompt);
  
    const pagesArray = response.data?.pages || [];
    const pageDetails: PageDetail[] = [];
  
    let currentPageDetail: PageDetail | null = null;
  
 // ... (other code)

// ... (other code)

for (const page of pagesArray) {
    const trimmedPage = page.trim();
  
    if (trimmedPage.startsWith("Page ")) {
      if (currentPageDetail) {
        pageDetails.push(currentPageDetail);
      }
      currentPageDetail = {
        pageNumber: trimmedPage,
        characterCloseUp: "",
        object: "",
        wildCardImage: "",
      };
    } else if (currentPageDetail) {
      const keyValuePattern = /"([^"]+)": "([^"]+)"/g;
      let match;
      while ((match = keyValuePattern.exec(trimmedPage)) !== null) {
        const [, key, value] = match;
        if (key in currentPageDetail) {
          currentPageDetail[key as keyof PageDetail] = value; // Type assertion
        }
      }
    }
  }
  
  if (currentPageDetail) {
    pageDetails.push(currentPageDetail);
  }
  
  // ... (other code)
  
  
  // ... (other code)
  
  
    const batch = adminDb.batch();

    pageDetails.forEach((pageDetail, index) => {
      const pageRef = adminDb
        .collection("users")
        .doc(session.user.email)
        .collection("storys")
        .doc(storyId)
        .collection("storyContent")
        .doc(`page_${index + 1}`);
  
      // Define the type for the fields you're updating
      const updateFields: { [field: string]: string } = {
        characterCloseUp: pageDetail.characterCloseUp,
        object: pageDetail.object,
        wildCardImage: pageDetail.wildCardImage,
      };
  
      batch.update(pageRef, updateFields);
    });
  
    await batch.commit();
  
    res.status(200).json({ answer: { message: "Data successfully updated." } });
  }
  