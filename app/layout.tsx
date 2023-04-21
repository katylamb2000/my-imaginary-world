import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Login from '../components/Login'
import { SessionProvider } from '../components/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { Providers } from './GlobalRedux/provider';
import ClientProvider from '../components/ClientProvider'

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
    <html lang="en">
      <head />
      <body>
      
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
  )
}
