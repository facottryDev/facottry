'use client'
import Sidebar from "@/components/dashboard/Sidebar"
import React from 'react'
import { globalStore, userStore } from "@/lib/store"
import CreateMappings from "./_owner/CreateMapping"
import ModifyMapping from "./_owner/ModifyMappings"
import ManageConfigs from "./_owner/ManageConfigs"
import FilterSettings from "./_owner/FilterSettings"
import ViewConfigs from "./_viewer/ViewConfigs"
import ViewMappings from "./_viewer/ViewMappings"
import ManageConfigTypes from "./_owner/ManageConfigTypes"
import DashboardNav from "../DashboardNav"
import Notibar from "@/components/global/Notibar"

const ownerTabs = ['Manage Filters', 'Config Types', 'Manage Configs', 'Create Mappings', 'Modify Mappings']
const viewerTabs = ['View Configs', 'View Mappings']

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = globalStore(state => [state.dashboardTab, state.setDashboardTab]);
  const activeProject = userStore(state => state.activeProject);
  const userRole = activeProject?.role;

  const roleTab = (userRole === 'owner' || userRole === 'editor') ? ownerTabs : viewerTabs;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="relative w-full p-8 mx-auto bg-bggray dark:bg-zinc-950">
      <Notibar message="Take a moment to provide your valuable feedback to us by" href={'https://forms.gle/YESLbaEbMBXkYXJ87'} />
        <DashboardNav title="Dashboard" />
        <div className="mt-4 ">
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

          {/* Viewers */}
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