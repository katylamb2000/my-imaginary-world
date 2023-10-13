

import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import admin, { app } from "firebase-admin";
import { adminDb } from "../../firebaseAdmin";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST)
// const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
const endpointSecret = 'whsec_ehOlurOLrSfB0mhJkR3AkCmtylW8a8ha'

const fulfillOrder = async (session: ReturnType<typeof stripe>['Checkout']['Session']) => {
    console.log('fulfillin order', session)

    const shippingAddress = session.shipping;

    await adminDb
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
        amount: session.amount_total /100,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
             // Store the shipping address
             shipping: {
                name: shippingAddress.name,
                address: {
                    line1: shippingAddress.address.line1,
                    line2: shippingAddress.address.line2,
                    city: shippingAddress.address.city,
                    postal_code: shippingAddress.address.postal_code,
                    state: shippingAddress.address.state,
                    country: shippingAddress.address.country,
                }
            }
    })
    .then(() => {
        console.log(`SUCCESS: Order ${session.id} has been added to the DB`)
    } )
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    console.log('Webhook endpoint hit!');


    if (req.method === 'POST'){
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const sig = req.headers["stripe-signature"];

        let event;
// verify that the EVENT posted came from stripe
        try{
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
          if (err instanceof Error) {
            console.log('ERROR', err.message);
            return res.status(400).send(`webhook error: ${err.message} `);
          } else {
            console.log('ERROR', err);
            return res.status(400).send(`webhook error: ${JSON.stringify(err)} `);
          }
        }

        // handle the CO session completed event
        if (event.type === 'checkout.session.completed'){
            const session = event.data.object;

            return fulfillOrder(session)
            .then(() => res.status(200))
            .catch((err) => res.status(400).send(`Webhook error: ${err.message}`))
        }
    }
   }

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
}
 

