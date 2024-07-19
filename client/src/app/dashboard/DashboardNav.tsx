import React from 'react'
import ToggleSwitch from "@/components/global/ToggleTheme"
import UserDropdown from "@/components/dashboard/UserDropdown"
import { globalStore } from "@/lib/store"
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

type Props = {
    title: string
}

const DashboardNav = ({ title }: Props) => {
    const [sidebar, setSidebar] = globalStore(state => [state.sidebar, state.setSidebar]);

    return (
        <nav className="flex justify-between">
            <div className="flex items-center mr-10">
                <button className="hover:bg-gray-300 transition-all p-1 rounded-md" onClick={() => {
                    setSidebar(!sidebar);
                }}>
                    <GiHamburgerMenu fontSize={"1.5rem"} />
                </button>

                <h1 className="text-2xl font-bold ml-3">{title}</h1>

                <Link href={'https://forms.gle/YESLbaEbMBXkYXJ87'} target="_blank" className="inline-block ml-4 text-center border border-gray-800 dark:border-white px-2 py-2 rounded-lg text-black hover:bg-gray-800 hover:text-white transition dark:text-slate-200 dark:hover:bg-zinc-800 text-sm font-medium">
                    Submit Feedback
                </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <ToggleSwitch />
                <UserDropdown />
            </div>
        </nav>
    )
}

export default DashboardNav