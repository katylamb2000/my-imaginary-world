import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../firebaseAdmin';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(process.env.HOST)

  if (req.method === 'POST') {
    const { items, userSession, storyId } = req.body;

    console.log(items, 'stripe user session', userSession);

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA']
        },
        line_items: [
          {
            price: 'price_1MxVqxJqdk0qGYPgCSdsIrIT',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.HOST_DEV}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.HOST_DEV}`,
        // success_url: `${process.env.HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
        // cancel_url: `${process.env.HOST}`,
        metadata: {
            email: userSession.user.email, 
            storyId: storyId
        }
      });


      // Save the session ID to Firestore
      const userEmail = userSession.user.email;
      const userRef = adminDb.collection('users').doc(userEmail).collection('checkout_sessions').doc(storyId);
      await userRef.set({
        lastCheckoutSessionId: session.id,
        storyId: storyId
        // ... any other fields you want to update
      }, { merge: true });

      res.status(200).json({ id: session.id });
      // res.redirect(303, session.url);
    } catch (err) {
      res.status((err as any).statusCode || 500).json((err as any).message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
