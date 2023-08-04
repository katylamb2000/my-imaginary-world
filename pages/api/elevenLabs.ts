import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message, voice, storyId, pageId } = req.body;
  const apiKey = process.env.eleven_labs_api_key || ''
  try {
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        accept: "audio/mpeg",
        "Content-Type": "application/json", 
        "xi-api-key": apiKey 
      }, 
      body: JSON.stringify({
        text: message, 
        voice_settings: {
          stability: 0.2, 
          similarity_boost: 0
        }
      })
    });

    if (!ttsResponse.ok) {
      throw new Error("Something went wrong with the TTS API");
    }

    // Convert the received audio data to a buffer
    const audioData = await ttsResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioData);

    // Send the audio data back to the client
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

  } catch (error) {
    const err = error as Error;
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  
}
