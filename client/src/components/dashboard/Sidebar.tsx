'use client'
import React, { useState } from 'react';
import { FiHome, FiPlayCircle, FiBarChart2, FiFileText, FiShoppingCart, FiDollarSign, FiPhone, FiSettings, FiFolder } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image'
import logo_2 from '@/assets/logo_2.svg'
import logo_dark_2 from '@/assets/logo_dark_2.svg'
import { userStore, globalStore, activeFilterStore } from "@/lib/store";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { AiOutlineProject } from "react-icons/ai";
import { CgOrganisation } from "react-icons/cg";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { axios_admin } from "@/lib/axios";
import { toast } from "react-toastify";

// Main Sidebar Component
const Sidebar = () => {
  const { projects: allProjects, activeProject, setActiveProject, company } = userStore(state => ({ projects: state.projects, activeProject: state.activeProject, setActiveProject: state.setActiveProject, company: state.company }));
  const animatedComponents = makeAnimated();
  const [activeFilter, setActiveFilter, scaleFilter, setScaleFilter] = activeFilterStore(state => [state.activeFilter, state.setActiveFilter, state.scaleFilter, state.setScaleFilter]);

  const { sidebar, setSidebar, sideDetailsCollapsed: sidebarCollapsed, setDetailsCollapsed: setSidebarCollapsed } = globalStore(state => ({ sidebar: state.sidebar, setSidebar: state.setSidebar, sideDetailsCollapsed: state.sideDetailsCollapsed, setDetailsCollapsed: state.setDetailsCollapsed }));

  const handleProjectClone = async () => {
    if (!activeProject) return;

    try {
      const result = await axios_admin.post('/project/clone', { projectID: activeProject.projectID });
      console.log(result);

      toast.success('Project cloned successfully');
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error('Failed to clone project');      
    }
  }

  const handleProjectChange = (selectedOption: any) => {
    const project = allProjects.find((item) => item.projectID === selectedOption.value) || null;
    if (project) setActiveProject(project);

    setActiveFilter({});
    setScaleFilter({});

    window.location.reload();
  }

  const ProjectOptions = allProjects
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({
      value: item.projectID,
      label: `${item.name} - ${item.type}`,
    }));

  return (
    <div className={`${sidebar ? 'block' : 'hidden'} bg-white p-8 pl-5 dark:bg-zinc-900`}>
      <Link href={'/'} className="flex gap-1 items-center mb-5">
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
        <p className="font-extrabold text-2xl text-black dark:text-white">
          <span className="text-primary">Flag</span>mate
        </p>
      </Link>

      <div className="font-medium text-slate-700 dark:text-white">
        <SidebarButton href="/dashboard/home" label="Dashboard" icon={<FiHome />} />
        <SidebarButton href="/dashboard/playground" label="Playground" icon={<FiPlayCircle />} />
        <SidebarButton href="/dashboard/settings/project" label="Project Settings" icon={<AiOutlineProject />} />
        <SidebarButton href="/dashboard/settings/company" label="Company Settings" icon={<CgOrganisation />} />
        <SidebarButton href="https://facottryanalytics.vercel.app/" target='_blank' label="Analytics Dashboard" icon={<TbDeviceDesktopAnalytics />} />
      </div>

      <hr className="mt-4 w-full" />

      <div className="mt-4 text-sm min-w-[200px] max-w-[300px]">
        <Select
          options={ProjectOptions}
          onChange={handleProjectChange}
          value={ProjectOptions.find(option => option.value === activeProject?.projectID)}
          closeMenuOnSelect={true}
          components={animatedComponents}
        />

        {/* Add new project button */}
        <Link href="/dashboard/project" className="mt-4 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-sm text-center hover:bg-gray-100 dark:bg-transparent dark:hover:bg-zinc-800">
          Add Project
        </Link>

        <button 
        className="mt-4 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-sm text-center hover:bg-gray-100 dark:bg-transparent dark:hover:bg-zinc-800"
        onClick={() => {
          window.confirm('Are you sure you want to clone ' + activeProject?.name + '?') && handleProjectClone();
        }}
        >
          Clone Project
        </button>

        <div className={`flex flex-col mt-6 rounded-md text-sm items-center justify-cente text-white transition-all ${sidebarCollapsed ? 'bg-primary900 px-4 pt-2' : 'bg-primary800 p-4'
          }`}>
          <button
            className={`bg-primary900 text-white px-2 w-full py-1 rounded-md`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? 'Show Details' : 'Hide Details'}
          </button>

          <div
            className={`rounded-md mt-2 flex flex-col gap-2 text-white collapsible-content ${sidebarCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 dark:bg-primary800 opacity-100'
              }`}
          >
            <span>
              <h3 className="font-bold">Company ID: </h3>
              <p>{company?.companyID}</p>
            </span>

            <span>
              <h3 className="font-bold">Company Name: </h3>
              <p>{company?.name}</p>
            </span>

            <span>
              <h3 className="font-bold">Project ID: </h3>
              <p>{activeProject?.projectID}</p>
            </span>

            <span>
              <h3 className="font-bold">Project Name: </h3>
              <p>{activeProject?.name}</p>
            </span>

            <span>
              <h3 className="font-bold">Project Type: </h3>
              <p>{activeProject?.type}</p>
            </span>

            <span>
              <h3 className="font-bold">Project Role: </h3>
              <p>{activeProject?.role}</p>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;

// Sidebar Button Component
const SidebarButton = ({ href, label, icon, target }: {
  href: string;
  label: string;
  icon: React.ReactNode;
  target?: string;
}) => (
  <Link href={href} target={target} className="flex items-center p-3 hover:text-primary transition">
    <span className="mr-3 text-xl">{icon}</span>
    <span className="flex-shrink-0">{label}</span>
  </Link>
);