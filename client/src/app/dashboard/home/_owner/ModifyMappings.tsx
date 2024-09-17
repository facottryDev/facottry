'use client'
import { activeFilterStore, globalStore, userStore } from "@/lib/store";
import { useEffect, useState } from 'react'
import { axios_config } from "@/lib/axios"
import React from 'react'
import { IoPencil, IoTrashBin } from "react-icons/io5";
import Filter from "@/components/dashboard/Filter";
import { MdDeleteSweep, MdEditNote, MdGridView, MdOutlinePlayCircleFilled } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {}


const ModifyMapping = (props: Props) => {
    const [allMappings, setAllMappings] = useState<any>();
    const activeProject = userStore(state => state.activeProject);
    const [activeFilter, setActiveFilter, setScaleFilter] = activeFilterStore(state => [state.activeFilter, state.setActiveFilter, state.setScaleFilter]);
    const [setDashboardTab] = globalStore(state => [state.setDashboardTab]);
    const router = useRouter();

    const handleEditMapping = (mapping: any) => {
        if (mapping) {
            setActiveFilter(mapping.filter);
            setDashboardTab('Create Mappings');
        }
    }

    const handleDeleteMapping = async (mapping: any) => {
        if (!activeProject) {
            toast.error('No active project found!');
            return;
        }

        try {
            await axios_config.post('/delete-mapping', {
                projectID: mapping.projectID,
                filter: mapping.filter,
            });

            toast.success('Mapping deleted successfully!')
            getAllMappings();
        } catch (error) {
            console.error(error)
            toast.error('Error in deleting mapping!')
        }
    }

    const getAllMappings = async () => {
        if (!activeProject) return;

        try {
            const mapping = await axios_config.post('/mapping/all', {
                projectID: activeProject?.projectID,
                filter: activeFilter
            });

            if (mapping.data.code === "FOUND") {
                setAllMappings(mapping.data.mappings);
            } else {
                setAllMappings(undefined);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }

    const handleGoToPlayground = (mapping: any) => {
        if (mapping) {
            console.log(mapping.filter)
            setScaleFilter(mapping.filter);
            router.push('/dashboard/playground');
        }
    }

    useEffect(() => {
        getAllMappings();
    }, [activeProject, activeFilter])

    return (
        <div className="flex flex-col justify-center items-center">
            <Filter />

            {allMappings && (
                <div className="flex flex-col w-full border rounded-md mt-8">
                    <h1 className="text-lg font-bold text-center my-4">Active Mappings</h1>
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Filters</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Configs</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {allMappings.map((mapping: any, index: number) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        {Object.entries(mapping.filter).map(([key, value], keyIndex) => (
                                            <div key={keyIndex}> {key}: {value as React.ReactNode}</div>
                                        ))}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <div>App Config: {mapping.appConfig.name}</div>
                                        <div>Player Config: {mapping.playerConfig.name}</div>
                                        {mapping.customConfig && Object.keys(mapping.customConfig).map((key, keyIndex) => (
                                            <div key={keyIndex}> {key}: {mapping.customConfig[key].name}</div>
                                        ))}
                                    </td>
                                    <td className="border-b border-gray-200 text-sm">
                                        <button title="View in Playground" className="ml-2 p-2 rounded-full bg-primary600 text-white hover:bg-primary700 transition-all" onClick={() => handleGoToPlayground(mapping)}>
                                            <MdOutlinePlayCircleFilled fontSize={18} />
                                        </button>

                                        <button title="Edit Mapping" className="ml-2 p-2 rounded-full bg-primary600 text-white hover:bg-primary700 transition-all" onClick={() => handleEditMapping(mapping)}>
                                            <MdEditNote fontSize={18} />
                                        </button>

                                        <button title="Delete Mapping" className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                                            if (window.confirm('Are you sure?')) {
                                                handleDeleteMapping(mapping);
                                            }
                                        }}>
                                            <MdDeleteSweep fontSize={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ModifyMapping