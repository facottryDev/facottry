import Link from "next/link"
import React from 'react'

type Props = {
    label: string
    link: string
}

const Button = ({ label, link }: Props) => {
    return (
        <Link href={link} className="relative inline-flex items-center justify-center p-4 px-8 py-3 overflow-hidden font-medium text-cyan-600 rounded-lg shadow-2xl group transition-all border">
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-500 bg-primary dark:bg-primary600 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-90 ease">
                <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-sky-500 dark:bg-sky-600 rounded-full blur-md"></span>
                <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-primary dark:bg-primary600 rounded-full blur-md"></span>
            </span>
            <span className="relative text-white">{label}</span>
        </Link>
    )
}

export default Button