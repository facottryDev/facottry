import React from 'react'
import ToggleSwitch from "@/components/global/ToggleTheme"
import UserDropdown from "@/components/dashboard/UserDropdown"
import { globalStore } from "@/lib/store"
import { GiHamburgerMenu } from "react-icons/gi";

type Props = {
    title: string
}

const DashboardNav = ({ title }: Props) => {
    const [sidebar, setSidebar] = globalStore(state => [state.sidebar, state.setSidebar]);

    return (
        <nav className="flex justify-between">
            <div className="flex items-center mr-10 space-x-2">
                <button className="hover:bg-gray-300 transition-all p-1 rounded-md" onClick={() => {
                    setSidebar(!sidebar);
                }}>
                    <GiHamburgerMenu fontSize={"1.5rem"} />
                </button>

                <h1 className="text-2xl font-bold">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <ToggleSwitch />
                <UserDropdown />
            </div>
        </nav>
    )
}

export default DashboardNav