import Image from "next/image";
import Link from "next/link";
import React from 'react';

type Props = {
    href: string,
    title: string,
    desc: string,
    imgURL: string
}

const ExampleCard = ({ href, title, desc, imgURL }: Props) => {
    return (
        <Link target="_blank" href={href} className="group relative block bg-gray-800 p-4 rounded-md aspect-video border shadow-sm overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg hover:bg-gray-900">
            <div className="absolute bottom-4 left-4 z-10">
                <h1 className="text-lg font-semibold text-gray-300 group-hover:text-gray-200 transition-colors">{title}</h1>
                <p className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">{desc}</p>
            </div>

            <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: `url(${imgURL})` }}></div>
        </Link>
    );
}

export default ExampleCard;