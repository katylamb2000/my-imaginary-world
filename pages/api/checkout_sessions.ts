import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const { items, userSession } = req.body 

    // console.log(items, userSession)

    // const transformedItems = items.map(item => ({
    //     description: item.description,
    //     quantity: 1, 
    //     price_data: {
    //         currency: 'gbp',
    //         unit_amount: 100,
    //         product_data: {
    //             name: item.title,
    //             images: [item.image]
    //         },

    //     }
    // }))
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA']
        },
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            // price: '{{PRICE_ID}}',
            // price: 'price_1MxVNlJqdk0qGYPgCGKBLBcj',
            price: 'price_1MxVqxJqdk0qGYPgCSdsIrIT',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}`,
        metadata: {
            email: userSession.user.email
        }
      });

      res.status(200).json({ id: session.id })
      res.redirect(303, session.url);
    } catch (err) {
      res.status((err as any).statusCode || 500).json((err as any).message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}