import Link from "next/link";
import React from 'react';
import { BiSupport } from "react-icons/bi";

type Props = {}

const IssueButton = (props: Props) => {
    return (
        <div className="fixed bottom-7 right-7 flex flex-col items-center group">
            <Link
                href={'/'}
                className="bg-gray-700 text-white rounded-full p-2 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-110 duration-300 ease-in-out"
                target="_blank"
                rel="noopener noreferrer"
            >
                <BiSupport fontSize={"1.7rem"} />
            </Link>
            <span className="hidden group-hover:flex items-center bg-gray-800 text-white text-sm rounded-md py-2 px-4 absolute right-14 bottom-1/2 transform translate-y-1/2 shadow-lg whitespace-nowrap">
                Having an issue?
            </span>
        </div>
    );
}

export default IssueButton;