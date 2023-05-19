// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/createStoryApi";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

type Data = {
  answer: string;
  storyId: string;
};

function hasPages(response: any): response is { title: string; pages: string[]; story: string } {
  return 'pages' in response;
}
export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { title: string; pages: string[]; story: string; } | { message: string } }>
) {


  const {   session, storyId, prompt } = req.body

  console.log( session, storyId, prompt )

  if (!prompt) {
    res.status(400).json({ answer: { message: 'i dont have a prompt' } });
    return;
  }

  if (!session) {
    res.status(400).json({ answer:  { message: 'i dont have a session' }});
    return;
  }

  if (!storyId) {
    res.status(400).json({ answer:{ message: 'i dont have a storyId' } });
    return;
  }

  // ChatGPT query

const response = await query(prompt);
console.log('this is the response! ---> !!', response)
// Save the story data to Firestore
const storyRequest = {
  storyId,
  createdAt: admin.firestore.Timestamp.now(),
  user: session.user,
};

// Create a separate document for each page
if (hasPages(response)) {
response.pages.forEach(async (page, index) => {
  const pageRequest = {
    ...storyRequest,
    page,
    pageNumber: index + 1,
    imagePromptCreated: false
  };
  await adminDb
    .collection("users")
    .doc(session.user.email)
    .collection('storys')
    .doc(storyId)
    .collection('storyContent')
    .doc(`page_${index + 1}`)
    .set(pageRequest);
});
await adminDb
.collection("users")
.doc(session.user.email)
.collection("storys")
.doc(storyId)
.update({
  title: response.pages[1],
  story: response.story

});
}
else{
  return;
}

// Save the story metadata to a separate document
// const storyMetadata = {
//   ...storyRequest,
//   title: response.title,
//   pageCount: response.pages.length,
// };
// await adminDb
//   .collection("stories")
//   .doc(storyId)
//   .set(storyMetadata);

res.status(200).json({ answer: response });
}
