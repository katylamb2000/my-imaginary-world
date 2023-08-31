// utils/characterDescriptions.ts
import { adminDb } from "../firebaseAdmin";
import openai from './chatgpt'

export async function generateCharacterDescriptions(session: any, storyId: string, pages: string[], hero: string) {
  const characterDescriptionPrompt = `This is a story: ${pages}. Based on this story, could you provide a detailed physical description of each of the characters, excluding ${hero}, in the format: Character: {character name}, Description: {description}. This will be used to create the ai generated art for a story book, so the physical description needs to be specific so that the character depictions are consistent throughout the story. The description shoul dinclude clothing and hairstyle. ?`;

  const characterDescriptionResponse = await openai.createCompletion({
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

  return characterDescriptions;
}
