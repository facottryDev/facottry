import Link from "next/link"
import React from 'react'

type Props = {}

const SiteExamples = (props: Props) => {
    return (
        <div className="bg-white w-full rounded-md p-5 mt-4 text-sm">
            <h1 className="text-lg font-semibold">Site Examples</h1>
            <p className="text-gray-500 mt-2">Here are some examples of sites that you can build with FacOTTry</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Link target="_blank" href={'https://facottry-website-pearl.vercel.app/'} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
                    <h1 className="text-lg font-semibold">Netflix</h1>
                    <p className="text-gray-500 mt-2">Build a Netflix clone with FacOTTry</p>
                </Link>

                <Link target="_blank" href={'https://facottry-website-pearl.vercel.app/'} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
                    <h1 className="text-lg font-semibold">Hotstar</h1>
                    <p className="text-gray-500 mt-2">Build a Hotstar clone with FacOTTry</p>
                </Link>

                <Link target="_blank" href={'https://facottry-website-pearl.vercel.app/'} className="bg-gray-100 p-4 rounded-md border shadow-sm hover:bg-gray-200 hover:scale-105 transition-all">
                    <h1 className="text-lg font-semibold">E-commerce</h1>
                    <p className="text-gray-500 mt-2">Build an e-commerce site with FacOTTry</p>
                </Link>
            </div>
        </div>
    )
}

export default SiteExamples