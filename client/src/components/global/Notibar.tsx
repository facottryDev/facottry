import { globalStore } from "@/lib/store";
import Link from "next/link";
import React, { useState } from 'react';
import { IoAlertCircleOutline } from "react-icons/io5";

type Props = {
    message: string;
    href: string;
};

const Notibar = ({ message, href }: Props) => {
    const [notibar, setNotibar] = globalStore(state => [state.notibar, state.setNotibar]);

    if (!notibar) return null;

    return (
        <div className="fixed z-20 bg-bggray w-[80%] max-w-[800px] bottom-10 left-1/2 transform -translate-x-1/2 border border-zinc-400 text-primary700 px-4 py-3 rounded shadow-lg" role="alert">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="md:block hidden">
                        <IoAlertCircleOutline fontSize={"1.5rem"} />
                    </div>
                    <span className="block sm:inline">Got a minute? We&apos;d love to hear about your experience.</span>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={'https://forms.gle/YESLbaEbMBXkYXJ87'} target="_blank" className="text-center border border-zinc-400 dark:border-white px-2 py-2 rounded-lg text-primary700 hover:bg-primary700 hover:text-white transition dark:text-slate-200 ml-2 dark:hover:bg-zinc-800 text-sm font-medium">
                        Submit Feedback
                    </Link>
                    <button onClick={() => setNotibar(false)} className="text-primary500 hover:text-primary700">
                        <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notibar;