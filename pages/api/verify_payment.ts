import { NextApiRequest, NextApiResponse } from 'next';
import { setDoc } from 'firebase/firestore';  // import necessary methods from Firestore SDK
import { adminDb } from '../../firebaseAdmin';
import axios from 'axios';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sessionId, userEmail, storyId, pdfUrl, userName } = req.body;


    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('data passed ===> ', storyId, userEmail, pdfUrl);
      
      if (session.payment_status === 'paid') {
        const shippingAddress = session.shipping_details.address;
        const deliveryRecipientName = session.shipping_details.name;
        let nameParts = userName.split(' '); // Splits the string into an array at the space
                let firstName = nameParts[0];
                let lastName = nameParts[1];
        const orderRef = adminDb.collection('users').doc(userEmail).collection('orders').doc(storyId);
        console.log('shipping add', shippingAddress );
        await orderRef.set({ 
          shippingAddress,
          deliveryRecipientName,
          storyId,
          gelatoOrderSuccessfull: false,
          thisWorks: true
        }, { merge: true });

        // Prepare data for Gelato order
        const gelatoOrderData = {
            "orderType": "order",
            "orderReferenceId": storyId,
            "customerReferenceId": userEmail,
            "currency": "USD",
            "items": [
                {
                    "itemReferenceId": "photobook-20x20cm",
                    "productUid": "photobooks-hardcover_pf_200x200-mm-8x8-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver",
                    "files": [
                        {
                            "url": pdfUrl,
                            "type": "default"
                        }
                    ],
                    "quantity": 1,
                    "pageCount": 28
                }
            ],
            "shipmentMethodUid": "express",
            "shippingAddress": {
                "companyName": "",
                "firstName": firstName,
                "lastName": lastName,
                "addressLine1": shippingAddress.line1,
                "addressLine2": shippingAddress.line2,
                "state": shippingAddress.state,
                "city": shippingAddress.city,
                "postCode": shippingAddress.postal_code,
                "country": shippingAddress.country,
                "email": userEmail,
                "phone": ""
            }
        };
        
     
    
        try {
            const gelatoResponse = await axios.post('https://order.gelatoapis.com/v4/orders', gelatoOrderData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.GELATO_API_KEY
                }
            });
            console.log("Gelato response ==> ", gelatoResponse )
        } catch (error: any) {
            console.error("Error posting to Gelato API :", error.response.data);
            console.error("Error posting to Gelato API :", error.data);
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
  } else {
    return res.status(405).end(); // Method not allowed
  }
}

