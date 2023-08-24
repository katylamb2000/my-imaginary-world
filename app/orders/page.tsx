
import { db } from '../../firebase'
import moment from "moment"

function OrdersPage() {



  return (
    <div>
        <main className='max-w-screen-lg mx-auto p-10'>
            <h1 className='text-3xl border-b mb-2 pb-1 border-purple-400'>Your orders</h1>

       
            <div className="mt-5 sapce-y-4">


            </div>
        </main>
    </div>
  )
}

export default OrdersPage

// export async function getServerSideProps(context) {
//     const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

//     // gett he ussers logged in credentials. 

//     const session = getSession(context)

//     if (!session){
//         return {
//             props: {}
//         };
//     }

//     const stripeOrders = await db.collection('users').doc((await session).user.email).collection('orders').orderBy('timestamp', "desc").get();

//     const orders = await Promise.all(
//         stripeOrders.docs.map(async (order) => ({
//             id: order.id,
//             amount: order.data().amount,
//             timestamp: moment(order.data().timestamp.toDate()).unix(),
//             items:(
//                 await stripe.checkout.sessions.listlineItems(order.id, {
//                     limit: 100
//                 })
//             ).data
//         }))
//     );
//     return {
//         props: {
//             orders,
//         }
//     }
// }  