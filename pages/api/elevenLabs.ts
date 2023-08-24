import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, firebaseStorage } from '../../firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, voice, storyId, pageId, session } = req.body;
  const apiKey = process.env.eleven_labs_api_key || '';

  try {
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': '14aeb3d582c5a315e97b3d93c746d6e2'
      },
      body: JSON.stringify({
        text: message,
        voice_settings: {
          stability: 0.2,
          similarity_boost: 0,
        },
      }),
    });

    if (!ttsResponse.ok) {
      throw new Error('Something went wrong with the TTS API');
    }

    // Convert the received audio data to a buffer
    const audioData = await ttsResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioData);
    const audioFileName = `${Date.now()}.mp3`;
    const audioFile = firebaseStorage.file(`audioFiles/${audioFileName}`);

    const blobStream = audioFile.createWriteStream();

    let signedUrl = '';

    await new Promise<void>((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error(err);
        reject(err);
      });

      blobStream.on('finish', async () => {
        const fileName = audioFile.name;

        const publicUrl = `https://storage.googleapis.com/audioFiles/${fileName}`;
        console.log(`The file is now publicly available at ${publicUrl}`);

        const [url] = await audioFile.getSignedUrl({
          action: 'read',
          expires: '03-17-2025',
        });

        signedUrl = url;
        console.log('Signed URL: ' + signedUrl);
        resolve();
      });

      // Now we're ready to write the file
      blobStream.end(audioBuffer);
    });

    // Save the audioUrl to Firestore
    const pageRef = adminDb
      .collection('users')
      .doc(session.user.email)
      .collection('storys')
      .doc(storyId)
      .collection('storyContent')
      .doc(pageId); // Assuming you have the correct pageId

    await pageRef.update({
      audioUrl: signedUrl,
    });

    // Send the audio data back to the client
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    const err = error as Error;
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
