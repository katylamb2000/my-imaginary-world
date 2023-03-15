import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/dist/client/router"
import { HomeIcon, MapIcon, BriefcaseIcon, MagnifyingGlassCircleIcon, StarIcon  } from "@heroicons/react/24/solid";

function Header(){

    return(
        <header className="sticky bg-white top-0 z-50 text-center shadow-md
        p-3 md:px-10 w-full justify-evenly ">
            <h1 className="text-2xl font-bold text-purple-600 text-center">My Imaginary World</h1>
      </header>
    )
}
export default Header 