// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { Leap } from "@leap-ai/sdk";
import admin from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

const MODEL_ID = "1e7737d7-545e-469f-857f-e4b46eaa151d";
const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 600;

type ResponseObject = {
  answer?: any;
  error?: string;
};

export default async function leapImage(
  req: NextApiRequest,
  res: NextApiResponse<ResponseObject>
) {

  const { session, storyId, page } = req.body
  const prompt = req.body.prompt as string;
  console.log("Request body:", req.body);
  const apiKey = process.env.LEAP_API as string;

  if (!prompt) {
    console.log("Request body:", req.body);
    res.status(400).json({ error: "no prompt." });
    return;
  }

  if (prompt.length === 0) {
    console.log("Request body:", req.body);
    res.status(400).json({ error: "prompt length 0." });
    return;
  }

  if (!apiKey) {
    console.log("Request body:", req.body);
    res.status(400).json({ error: "No api key" });
    return;
  }

  const leap = new Leap(apiKey);

  const { data, error } = await leap.generate.generateImage({
    modelId: MODEL_ID,
    prompt: prompt,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    numberOfImages: 1,
  });

  if (error) {
    res.status(500).json(error);
    return;
  }

  res.status(200).json({ answer: data });
  const imageData = {
    data,
    storyId,
    createdAt: admin.firestore.Timestamp.now(),
    user: session.user,
  };

  const docRef = await adminDb
  // .collection("storyRequests")
  .collection("users")
  .doc(session.user.email)
  .collection('storys')
  .doc(storyId)
  .collection('storyContent')
  .doc(page)
  .collection('images')
  .add(imageData);


};
