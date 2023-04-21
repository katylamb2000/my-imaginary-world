

import type { NextApiRequest, NextApiResponse } from "next";
import { Leap } from "@leap-ai/sdk";

const MODEL_ID = "1e7737d7-545e-469f-857f-e4b46eaa151d";
const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 600;

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: string | null }>
) {

  const prompt = req.body.prompt as string;
  console.log("Request body:", req.body);
  const apiKey = process.env.LEAP_API as string;

  if (!prompt) {
    console.log("Request body:", req.body);
    res.status(400).json({ answer: "no prompt." });
    return;
  }

  if (prompt.length === 0) {
    console.log("Request body:", req.body);
    res.status(400).json({ answer: "prompt length 0." });
    return;
  }

  if (!apiKey) {
    console.log("Request body:", req.body);
    res.status(400).json({ answer: "No api key" });
    return;
  }

  const leap = new Leap(apiKey);

  const { data, error } = await leap.generate.generateImage({
    modelId: MODEL_ID,
    prompt: prompt,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    numberOfImages: 4,
  });

  if (error) {
    res.status(500).json({ answer: error });
    return;
  }

  res.status(200).json({ answer: 'data'  });
};

