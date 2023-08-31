// createCharacterDescriptions.ts
import { adminDb } from "../../firebaseAdmin";
import openai from '../../lib/chatgpt';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createCharacterDescriptions(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { message: string } | { data: Array<{name: string, description: string}> } }>
) {
  const { session, storyId, story, hero } = req.body;

  if (!session || !storyId || !story || !hero) {
    res.status(400).json({ answer: { message: "Incomplete request data." } });
    return;
  }

  // Generate character descriptions
  const characterDescriptionPrompt = `This is a story: ${story}. Based on this story, could you provide a detailed physical description of each of the characters, excluding ${hero}, in the format: Character: {character name}, Description: {description}?`;
  console.log(characterDescriptionPrompt)
  let characterDescriptionResponse;
  try {
    characterDescriptionResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: characterDescriptionPrompt,
      temperature: 0.9,
      top_p: 1,
      max_tokens: 1800,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const characterDescriptions = characterDescriptionResponse?.data?.choices?.[0]?.text
      ?.split('Character:')
      ?.map(part => part.trim())
      ?.filter(part => part.length > 0)
      ?.map(part => {
          const [name, ...descriptionParts] = part.split('Description:');
          return {
            name: name.trim(),
            description: descriptionParts.join('Description:').trim(),
          };
      }) ?? [];

    // Save each character description to Firestore
    for (let character of characterDescriptions) {
      const characterRef = adminDb
        .collection("users")
        .doc(session.user.email)
        .collection("storys")
        .doc(storyId)
        .collection("characters")
        .doc(character.name);  // The document ID is now the character's name

      await characterRef.set(character);
    }

    res.status(200).json({ answer: { data: characterDescriptions } });
    
  } catch (error) {
    console.error("Error with OpenAI API request:", error);
    res.status(500).json({ answer: { message: "Error occurred while interacting with the OpenAI API." } });
    return;
  }
}
