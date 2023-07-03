import Twilio from 'twilio';
// import sgMail from '@sendgrid/mail';
// import * as nodemailer from ' nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// const emailUser = process.env.EMAIL_USER;
// const emailPass = process.env.EMAIL_PASS;
const client = Twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // const transport = nodemailer.createTransport({
  //   service: 'gmail',  // If not using Gmail as service you should replace it with your email provider
  //   auth: {
  //     user: emailUser,
  //     pass: emailPass,
  //   },
  // });

  const { toPhoneNumber, message, toEmail } = req.body;

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    });

  
    // Send Email
    // const mailOptions = {
    //   from: emailUser,
    //   to: toEmail,
    //   subject: 'New Image Request',
    //   text: message,
    // };

    // await transport.sendMail(mailOptions);


    res.status(200).json({ message: 'SMS sent successfully', sid: sms.sid });
  } catch (error) {
    console.error('Error details:', error);
    const typedError = error as Error;
    res.status(500).json({ error: 'Error sending SMS or Email', details: typedError.message });
  }

}
