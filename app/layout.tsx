import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Login from '../components/Login'
import { SessionProvider } from '../components/SessionProvider'
import { Provider } from 'react-redux'
import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { Providers } from './GlobalRedux/provider';
import ClientProvider from '../components/ClientProvider'


import { 
  Roboto, Mystery_Quest, Caesar_Dressing, Quicksand, Indie_Flower, Amatic_SC, Patrick_Hand, Handlee, Bubblegum_Sans, Creepster,
  Schoolbell, Baloo_2, Permanent_Marker, Coming_Soon, Gloria_Hallelujah, Pacifico, Pangolin, Nosifer, Eater, Faster_One, 
  UnifrakturMaguntia, Almendra_Display, Bangers, Luckiest_Guy, Fascinate_Inline, Shadows_Into_Light_Two, Frijole, Sancreek, 
  Bungee_Inline, Megrim, Monoton, Chewy, Cherry_Cream_Soda, Alfa_Slab_One, Black_Ops_One, Reenie_Beanie, Euphoria_Script, 
  Tangerine, Fredericka_the_Great, Sacramento, Devonshire, Zeyada, Eagle_Lake, MedievalSharp, Metamorphous, Metal_Mania,
  Special_Elite, Press_Start_2P, Orbitron, Mountains_of_Christmas, Zilla_Slab_Highlight, 

} from "next/font/google"
export const metadata = {
  title: 'My Imaginary World',
  description: 'Create your own book series',
  
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-roboto'
})

const caesar = Caesar_Dressing({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-caesar'
})

const mystery = Mystery_Quest({
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-mystery'

})

const quicksand = Quicksand({
  subsets: ['latin'], 
  weight: '500', 
  variable: '--font-quicksand'
})

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-indieFlower'
})

const amatic = Amatic_SC ({
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-quicksand'
})

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrickHand'
})

const handlee =  Handlee({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-handlee'
})

const bubblegum =  Bubblegum_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bubblegum'
})

const creepster =  Creepster({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-creepster'
})

const schoolbell =  Schoolbell({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-schoolbell'
})

const permanentMarker =  Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-permanentMarker'
})

const baloo2 =  Baloo_2({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-baloo2'
})

const comingSoon =  Coming_Soon({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-comingSoon'
})


const gloriaHallelujah = Gloria_Hallelujah({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gloria-hallelujah'
});

const pacifico=  Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico'
});

const pangolin = Pangolin({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pangolin'
});

const nosifer = Nosifer({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-nosifer'
});

const eater = Eater({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-eater'
});

const fasterOne =  Faster_One ({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-faster-one'
});

const unifrakturMaguntia =  UnifrakturMaguntia ({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-unifraktur-maguntia'
});

const almendraDisplay =  Almendra_Display ({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-almendra-display'
});
const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bangers'
});

const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-luckiest-guy'
});

const fascinateInline = Fascinate_Inline({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-fascinate-inline'
});

const shadowsIntoLightTwo = Shadows_Into_Light_Two({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-shadows-into-light-two'
});

const frijole = Frijole({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-frijole'
});

const sancreek = Sancreek({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sancreek'
});

const bungeeInline = Bungee_Inline({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bungee-inline'
});

const megrim = Megrim({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-megrim'
});

const monoton = Monoton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-monoton'
});

const chewy = Chewy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-chewy'
});

const cherryCreamSoda = Cherry_Cream_Soda({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cherry-cream-soda'
});

const alfaSlabOne = Alfa_Slab_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-alfa-slab-one'
});

const blackOpsOne = Black_Ops_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-black-ops-one'
});

const reenieBeanie = Reenie_Beanie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-reenie-beanie'
});

const euphoriaScript = Euphoria_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-euphoria-script'
});

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-tangerine'
});

const frederickaTheGreat = Fredericka_the_Great({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-fredericka-the-great'
});

const sacramento = Sacramento({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sacramento'
});

const devonshire = Devonshire({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-devonshire'
});

const zeyada = Zeyada({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-zeyada'
});

const eagleLake = Eagle_Lake({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-eagle-lake'
});

const medievalSharp = MedievalSharp({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-medieval-sharp'
});

const metamorphous = Metamorphous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-metamorphous'
});

const metalMania = Metal_Mania({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-metal-mania'
});

const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-special-elite'
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start-2p'
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-orbitron'
});



const mountainsOfChristmas = Mountains_of_Christmas({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mountains-of-christmas'
});

const zillaSlabHighlight = Zilla_Slab_Highlight({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-zilla-slab-highlight'
});


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)


  return (
    <html lang="en">
      <head 
      
      />

<body className={`
  ${mystery.variable} ${roboto.variable} ${caesar.variable} ${quicksand.variable} ${indieFlower.variable} ${amatic.variable} ${patrickHand} ${handlee}
  ${bubblegum.variable} ${creepster.variable} ${schoolbell.variable} ${baloo2.variable} ${permanentMarker.variable} ${comingSoon.variable}
  ${gloriaHallelujah.variable} ${pacifico.variable} ${pangolin.variable} ${nosifer.variable} ${eater.variable} ${fasterOne.variable}
  ${unifrakturMaguntia.variable} ${almendraDisplay.variable} ${bangers.variable} ${luckiestGuy.variable} ${fascinateInline.variable} ${shadowsIntoLightTwo.variable}
  ${frijole.variable} ${sancreek.variable} ${bungeeInline.variable} ${megrim.variable} ${monoton.variable} ${chewy.variable} ${cherryCreamSoda.variable}
  ${alfaSlabOne.variable} ${blackOpsOne.variable} ${reenieBeanie.variable} ${euphoriaScript.variable} ${tangerine.variable} ${frederickaTheGreat.variable}
  ${sacramento.variable} ${devonshire.variable} ${zeyada.variable} ${eagleLake.variable} ${medievalSharp.variable} ${metamorphous.variable} ${metalMania.variable}
  ${specialElite.variable} ${pressStart2P.variable} ${orbitron.variable} ${mountainsOfChristmas.variable} ${zillaSlabHighlight.variable}
`}>


      
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
