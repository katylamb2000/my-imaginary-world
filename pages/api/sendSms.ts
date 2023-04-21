import Twilio from 'twilio';
import { NextApiRequest, NextApiResponse } from 'next';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = Twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { toPhoneNumber, message } = req.body;

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    });

    res.status(200).json({ message: 'SMS sent successfully', sid: sms.sid });
  } catch (error) {
    console.error('Error details:', error);
    const typedError = error as Error;
    res.status(500).json({ error: 'Error sending SMS', details: typedError.message });
  }

}
