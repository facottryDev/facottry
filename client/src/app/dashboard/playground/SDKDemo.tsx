'use client'
import { axios_scale } from "@/lib/axios"
import { activeFilterStore, userStore } from "@/lib/store"
import { useEffect, useState } from 'react'
import { JSONTree } from 'react-json-tree'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { toast } from "react-toastify";

type Props = {}

export const SDKDemo = (props: Props) => {
    const [activeMapping, setActiveMapping] = useState<any>();
    const activeProject = userStore(state => state.activeProject);
    const [scaleFilter, setScaleFilter] = activeFilterStore(state => [state.scaleFilter, state.setScaleFilter]);
    const allFilters = activeProject?.filters || [];
    const animatedComponents = makeAnimated();
    const [selectedValue, setSelectedValue] = useState(scaleFilter);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getMapping = async () => {
        if (!activeProject) return;

        try {
            const result = await axios_scale.post('/get-mapping', {
                projectID: activeProject?.projectID,
                filter: scaleFilter,
                noCache: true
            });

            setActiveMapping(result.data.data);
        } catch (error: any) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        getMapping();
    }, [scaleFilter, activeProject])

    return (
        <div>
            <div className="flex flex-col w-full mt-8 items-center justify-center">
                <div className="w-fit text-sm min-w-[300px] sm:min-w-[500px] lg:min-w-[600px] border rounded-md mt-8">
                    <div className="flex justify-between items-center px-5">
                        <h1 className="text-lg font-bold text-center my-4">Select Filters</h1>
                        <div className="flex items-center justify-center gap-4">
                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all"
                                onClick={() => setIsCollapsed(prev => !prev)}
                            >{
                                    isCollapsed === false ? 'Collapse' : 'Expand'
                                }
                            </button>
                        </div>
                    </div>

                    {!isCollapsed && <div>
                        <div className="flex px-10 py-2 bg-white flex-col items-center border-gray-100 w-full border-t text-sm">
                            <div className="mt-4 flex flex-col gap-2">
                                {Object.keys(allFilters).map((key, index) => {
                                    const options = allFilters[key].values.map((value: any) => ({
                                        value: value,
                                        label: value,
                                    }));

                                    const defaultValue = options.find((option: any) => option.value === scaleFilter[key]);

                                    return (
                                        <div key={index} className="flex items-center justify-between">
                                            <label className="mr-4 font-semibold">{key}:</label>
                                            <Select
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                                options={options}
                                                name={key}
                                                className="min-w-[200px] max-w-[200px] sm:min-w-[300px] sm:max-w-[300px] lg:min-w-[400px] lg:max-w-[400px]"
                                                onChange={(selectedOption: any) => {
                                                    setSelectedValue({
                                                        ...selectedValue,
                                                        [key]: selectedOption.value
                                                    })
                                                }}
                                                defaultValue={defaultValue}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => {
                                    setScaleFilter(selectedValue);
                                    toast.success("Filter Updated");
                                }}
                                className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all cursor-pointer disabled:bg-gray-200 disabled:cursor-text disabled:text-gray-500 disabled:border-gray-200"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>}
                </div>
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