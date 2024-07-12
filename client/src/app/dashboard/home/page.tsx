'use client'
import Sidebar from "@/components/dashboard/Sidebar"
import React from 'react'
import Image from "next/image"
import ToggleSwitch from "@/components/global/ToggleTheme"
import UserDropdown from "@/components/dashboard/UserDropdown"
import logo_2 from '@/assets/logo_2.svg'
import logo_dark_2 from '@/assets/logo_dark_2.svg'
import { globalStore, userStore } from "@/lib/store"
import CreateMappings from "./_owner/CreateMapping"
import ModifyMapping from "./_owner/ManageMappings"
import ManageConfigs from "./_owner/ManageConfigs"
import FilterSettings from "./_owner/FilterSettings"
import ViewConfigs from "./_viewer/ViewConfigs"
import ViewMappings from "./_viewer/ViewMappings"
import ManageConfigTypes from "./_owner/ManageConfigTypes"

const ownerTabs = ['Manage Filters', 'Config Types', 'Manage Configs', 'Create Mappings', 'Modify Mappings']
const viewerTabs = ['View Configs', 'View Mappings']

const Dashboard = () => {
  const [selectedTab, setSelectedTab, sidebar, setSidebar] = globalStore(state => [state.dashboardTab, state.setDashboardTab, state.sidebar, state.setSidebar]);

  const activeProject = userStore(state => state.activeProject);
  const userRole = activeProject?.role;

  const roleTab = (userRole === 'owner' || userRole === 'editor') ? ownerTabs : viewerTabs;

  return (
    <div className="flex min-h-screen dark:bg-darkblue300">
      <Sidebar />

      <div className="w-full bg-bggray p-8 mx-auto">
        <nav className="flex justify-between">
          <div className="flex items-center mr-10 space-x-4">
            {!sidebar && (
              <button onClick={() => {
                setSidebar(true);
              }}>
                <Image
                  src={logo_2}
                  alt="FacOTTry"
                  width={50}
                  height={50}
                  className="dark:hidden"
                />
                <Image
                  src={logo_dark_2}
                  alt="FacOTTry"
                  width={50}
                  height={50}
                  className="hidden dark:block"
                />
              </button>
            )}

            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            <ToggleSwitch />
            <UserDropdown />
          </div>
        </nav>

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

        <div className="">
          {(userRole === 'owner' || userRole === 'editor') && selectedTab === 'Manage Filters' && (
            <FilterSettings />
          )}

          {(userRole === 'owner' || userRole === 'editor') && selectedTab === 'Config Types' && (
            <ManageConfigTypes />
          )}

          {(userRole === 'owner' || userRole === 'editor') && selectedTab === 'Manage Configs' && (
            <ManageConfigs />
          )}

          {(userRole === 'owner' || userRole === 'editor') && selectedTab === 'Create Mappings' && (
            <CreateMappings />
          )}

          {(userRole === 'owner' || userRole === 'editor') && selectedTab === 'Modify Mappings' && (
            <ModifyMapping />
          )}

          {userRole === 'viewer' && selectedTab === 'View Configs' && (
            <ViewConfigs />
          )}

          {userRole === 'viewer' && selectedTab === 'View Mappings' && (
            <ViewMappings />
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard