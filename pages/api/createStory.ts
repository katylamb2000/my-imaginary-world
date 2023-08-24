

// import { adminDb, firebaseStorage } from "../../firebaseAdmin";
// import type { NextApiRequest, NextApiResponse } from "next";
// import openai from '../../lib/chatgpt';
// import query from "../../lib/createStoryApi";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// export default async function createStory(
//   req: NextApiRequest,
//   res: NextApiResponse<{ answer: { message: string } | { data: { title: string | undefined; pages: string[]; story: string; } } }>
// ) {
//   const { session, storyId, prompt, hero } = req.body;

//   console.log('this is the req body', session, storyId, prompt, hero)

//   if (!prompt || !session || !storyId) {
//     res.status(400).json({ answer: { message: "Incomplete request data." } });
//     return;
//   }

//   // ChatGPT query
//   const response = await query(prompt);
//   console.log('this is the story response', response)
//   if (!response.success) {
//     console.error(response.message);
//     res.status(500).json({ answer: { message: response.message ?? "An unknown error occurred." } });
//     return;
//   }

//   if (!response.data) {
//     console.error("Response data is undefined.");
//     res.status(500).json({ answer: { message: "Response data is undefined." } });
//     return;
//   }

//   // Save the story data to Firestore
//   const { pages, title, story } = response.data;

//   const batch = adminDb.batch();
//   for (let index = 0; index < pages.length; index++) {
//     const page = pages[index];

//     const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
//       method: "POST",
//       headers: {
//         accept: "audio/mpeg",
//         "Content-Type": "application/json", 
//         "xi-api-key": 'b13a263b2185593267797af406d1be8f'
//       }, 
//       body: JSON.stringify({
//         text: page, 
//         voice_settings: {
//           stability: 0.2, 
//           similarity_boost: 0
//         }
//       })
//     });

//     if (!ttsResponse.ok) {
//       throw new Error("Something went wrong with the TTS API");
//     }

//     // Convert the received audio data to a buffer
//     const audioData = await ttsResponse.arrayBuffer();
//     const audioBuffer = Buffer.from(audioData);
//     const audioFileName = `${Date.now()}.mp3`;
//     const audioFile = firebaseStorage.file(`audioFiles/${audioFileName}`);

//     const blobStream = audioFile.createWriteStream();

//     let signedUrl = "";

//     await new Promise<void>((resolve, reject) => {
//       blobStream.on('error', (err) => {
//         console.error(err);
//         reject(err);
//       });
    
//       blobStream.on('finish', async () => {
//         // const bucketName = firebaseStorage.bucket().name;
//         const fileName = audioFile.name;
    
//         const publicUrl = `https://storage.googleapis.com/audioFiles/${fileName}`;
//         console.log(`The file is now publicly available at ${publicUrl}`);
    
//         const [url] = await audioFile.getSignedUrl({
//           action: 'read',
//           expires: '03-17-2025'
//         });
    
//         signedUrl = url;
//         console.log('Signed URL: ' + signedUrl);
//         resolve();
//       });
    
//       // Now we're ready to write the file
//       blobStream.end(audioBuffer);
//     });
    

//     const pageRequest = {
//         text: page,
//         pageNumber: index + 1,
//         audioUrl: signedUrl,
//     };

//     const pageRef = adminDb
//       .collection("users")
//       .doc(session.user.email)
//       .collection("storys")
//       .doc(storyId)
//       .collection("storyContent")
//       .doc(`page_${index + 1}`);
      
//     batch.set(pageRef, pageRequest); // Set the pageRequest directly
//   }

//   const storyRef = adminDb
//     .collection("users")
//     .doc(session.user.email)
//     .collection("storys")
//     .doc(storyId);

//   batch.update(storyRef, {
//     fullImagePrompt: response.data,
//   });

//   await batch.commit();

//   // Generate character descriptions
//   const characterDescriptionPrompt = `This is a story: ${story}. Based on this story, could you provide a detailed physical description of each of the characters, excluding ${hero}, in the format: Character: {character name}, Description: {description}?`;
  
//   let characterDescriptionResponse;
//   try {
//     characterDescriptionResponse = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: characterDescriptionPrompt,
//       temperature: 0.9,
//       top_p: 1,
//       max_tokens: 1800,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//     });
//   } catch (error) {
//     console.error("Error with OpenAI API request:", error);
//     res.status(500).json({ answer: { message: "Error occurred while interacting with the OpenAI API." } });
//     return;
//   }

//   const characterDescriptions = characterDescriptionResponse?.data?.choices?.[0]?.text
//     ?.split('Character:')
//     ?.map(part => part.trim())
//     ?.filter(part => part.length > 0) 
//     ?.map(part => {
//         const [name, ...descriptionParts] = part.split('Description:');
//         return {
//           name: name.trim(),
//           description: descriptionParts.join('Description:').trim(),
//         };
//     }) ?? [];

//   // Save each character description to Firestore
//   for (let character of characterDescriptions) {
//     const characterRef = adminDb
//       .collection("users")
//       .doc(session.user.email)
//       .collection("storys")
//       .doc(storyId)
//       .collection("characters")
//       .doc(character.name);  // The document ID is now the character's name

//     await characterRef.set(character);
//   }

//   res.status(200).json({ answer: { data: response.data } });
// }
// Your existing imports...import { adminDb } from "../../firebaseAdmin";


import { adminDb, firebaseStorage } from "../../firebaseAdmin";

import openai from '../../lib/chatgpt';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import type { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/createStoryApi";

export default async function createStory(
  req: NextApiRequest,
  res: NextApiResponse<{ answer: { message: string  } | { data: { title: string | undefined; pages: string[]; story: string; } } }>
) {
  const { session, storyId, prompt, hero } = req.body;
  console.log('req stuff', session, storyId)
  try {

    // Fetch the response from ChatGPT
    const response = await query(prompt);
    console.log('responzo ===> ', response)
    // Save the story data to Firestore

const { pages } = response.data || {}; // Handle undefined response.data

    if (!pages) {
      res.status(400).json({ answer: { message: 'Invalid response data.' } });
      return;
    }

    const batch = adminDb.batch();

    pages.forEach((page, index) => {
      const pageRequest = {
        text: page,
        pageNumber: index + 1,
      };

      const pageRef = adminDb
        .collection('users')
        .doc(session.user.email)
        .collection('storys')
        .doc(storyId)
        .collection('storyContent')
        .doc(`page_${index + 1}`);

      batch.set(pageRef, pageRequest);
    });

    await batch.commit();

    const storyRef = adminDb
      .collection("users")
      .doc(session.user.email)
      .collection("storys")
      .doc(storyId);

    storyRef.set({
      fullStory: pages,
    });

    res.status(200).json({ answer: { message: 'Story created successfully.' } });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ answer: { message: 'An error occurred while processing the request.' } });
  }
}





