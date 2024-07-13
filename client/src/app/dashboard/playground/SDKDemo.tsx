'use client'
import Filter from "@/components/dashboard/Filter"
import { axios_scale } from "@/lib/axios"
import { activeFilterStore, userStore } from "@/lib/store"
import React, { useEffect, useState } from 'react'
import { JSONTree } from 'react-json-tree'

type Props = {}

export const SDKDemo = (props: Props) => {
    const [activeMapping, setActiveMapping] = useState<any>();
    const [activeFilter] = activeFilterStore(state => [state.activeFilter]);
    const activeProject = userStore(state => state.activeProject);

    const getMapping = async () => {
        if (!activeProject) return;

        try {
            const mapping = await axios_scale.post('/get-mapping', {
                projectID: activeProject?.projectID,
                filter: activeFilter
            });

            setActiveMapping(mapping.data.mappings);
        } catch (error: any) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        getMapping();
    }, [activeFilter, activeProject])

    return (
        <div>
            <div className="flex flex-col w-full mt-8 items-center justify-center">
                <Filter />
            </div>

            {/* JSON viewer */}
            <div className="w-full border rounded-md mt-8">
                <h1 className="text-lg font-bold text-center my-4">JSON Response</h1>
                <JSONTree data={activeMapping} />
            </div>

            <p className="mt-2 w-full flex justify-center text-sm italic text-gray-500">Not applicable for multi filter selections.</p>
        </div>
    )
}