import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Login from '../components/Login'
// import ErrorBoundary from '../components/ErrorBoundary'
import { SessionProvider } from '../components/SessionProvider'
import { Provider } from 'react-redux'
import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { Providers } from './GlobalRedux/provider';
import ClientProvider from '../components/ClientProvider'
import NextNProgress from 'nextjs-progressbar';
import { 
  Roboto, Mystery_Quest, Caesar_Dressing, Quicksand, Indie_Flower, Amatic_SC, Patrick_Hand,  
} from "next/font/google"

const roboto = Roboto({ subsets: ['latin'], weight: '400', variable: '--font-roboto'})
const caesar = Caesar_Dressing({ subsets: ['latin'], weight: '400', variable: '--font-caesar'})
const mystery = Mystery_Quest({ subsets: ['latin'], weight: '400', variable: '--font-mystery'
})
const quicksand = Quicksand({ subsets: ['latin'], weight: '500', variable: '--font-quicksand'})
const indieFlower = Indie_Flower({ subsets: ['latin'], weight: '400', variable: '--font-indieFlower'})
const amatic = Amatic_SC ({ subsets: ['latin'], weight: '400', variable: '--font-quicksand'})
const patrickHand = Patrick_Hand({ subsets: ['latin'], weight: '400', variable: '--font-patrickHand'})

export const metadata = {
  title: 'My Imaginary World',
  description: 'Create your own book series',
  
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

  return (
    // <ErrorBoundary> 
    <html lang="en">
      <head />

<body style={quicksand.style}  className={`
  ${mystery.variable} ${roboto.variable} ${caesar.variable} ${quicksand.variable} ${indieFlower.variable} ${amatic.variable} ${patrickHand}>
`}>
{/* <NextNProgress color='#a855f7' /> */}
      
  <SessionProvider session={session}>
    <Providers>
        {!session ? (
          <Login />
        ):
          <div>
  
            <ClientProvider />
  
            <Header />
             {children}
  
            <Footer /> 

          </div>
        }
    </Providers>
  </SessionProvider>

      </body>
    </html>
    // </ErrorBoundary> 
  )
}


