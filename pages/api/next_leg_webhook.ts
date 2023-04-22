// pages/api/webhook.ts

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Log the incoming data for debugging purposes
    console.log('Webhook data:', req.body);

    // Process the webhook data as required by your application
    // ...

    // Send a success response to acknowledge receipt of the webhook data
    res.status(200).json({ message: 'Webhook received' });
  } else {
    // Return an error if the request method is not POST
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
