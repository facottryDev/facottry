'use client'
import React from 'react'
import Sidebar from "@/components/dashboard/Sidebar";
import UserDropdown from "@/components/dashboard/UserDropdown"
import ThemeSwitch from "@/components/global/ToggleTheme"
import { globalStore, userStore } from "@/lib/store"
import Image from "next/image"
import logo_2 from '@/assets/logo_2.svg'
import logo_dark_2 from '@/assets/logo_dark_2.svg'
import BasicDetails from "./BasicDetails";
import ManageUsers from "./ManageUsers";
import JoinRequests from "./ManageInvites";
import ActiveInvites from "./ActiveInvites";
import CriticalSettings from "./CriticalSettings";
import DashboardNav from "../../DashboardNav";

type Props = {}

const ownerTabs = ['Basic Details', 'Manage Users', 'Manage Invites', 'Critical Settings']
const editorTabs = ['Basic']
const viewerTabs = ['Basic']

const ProjectSettings = (props: Props) => {
    const activeProject = userStore(state => state.activeProject);
    const roleTab = (activeProject?.role === 'owner') ? ownerTabs : (activeProject?.role === 'editor') ? editorTabs : viewerTabs;

    const [selectedTab, setSelectedTab, sidebar, setSidebar] = globalStore(state => [state.projectSettingTab, state.setProjectSettingTab, state.sidebar, state.setSidebar]);

    return (
        <div className="flex min-h-screen dark:bg-darkblue300">
            <div>
                <Sidebar />
            </div>

            <div className="flex flex-col w-full bg-bggray p-8">
                {/* Top Navbar */}
                <DashboardNav title="Manage Project" />

                <div className="mt-4">
                    <select
                        className="cursor-pointer text-sm font-medium text-center text-gray-500 dark:text-gray-400 mx-auto sm:hidden block w-full p-2 border border-gray-300 rounded-b-md"
                        value={selectedTab}
                        onChange={(e) => setSelectedTab(e.target.value)}
                    >
                        {roleTab.map((tab, index) => (
                            <option key={index} value={tab}>
                                {tab}
                            </option>
                        ))}
                    </select>
                    <div className="hidden sm:block text-sm font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex space-x-1">
                            {roleTab.map((tab, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => setSelectedTab(tab)}
                                        className={`tab-button lg:w-[200px] ${selectedTab === tab ? 'tab-button-active' : ''}`}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <hr className="w-full mt-2" />

                {selectedTab === 'Basic Details' && <BasicDetails />}
                {selectedTab === 'Manage Users' && <ManageUsers />}
                {selectedTab === 'Manage Invites' && <JoinRequests />}
                {selectedTab === 'Critical Settings' && <CriticalSettings />}
            </div>
        </div>
    )
}

export default ProjectSettings