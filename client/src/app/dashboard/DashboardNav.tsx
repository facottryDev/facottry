import React from 'react'
import ThemeSwitch from "@/components/global/ToggleTheme"
import UserDropdown from "@/components/dashboard/UserDropdown"
import { globalStore } from "@/lib/store"
import { GiHamburgerMenu } from "react-icons/gi";
import Notifications from "@/components/global/Notifications";

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
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <ThemeSwitch />
                <Notifications />
                <UserDropdown />
            </div>
        </nav>
    )
}

export default DashboardNav