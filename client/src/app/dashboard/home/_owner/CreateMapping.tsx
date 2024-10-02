'use client'
import React from "react";
import { useEffect, useState } from "react"
import { axios_config, axios_scale } from "@/lib/axios"
import { userStore, activeFilterStore } from "@/lib/store";
import Filter from "@/components/dashboard/Filter"
import ConfigSelectorComponent from "./ConfigSelectorComponent";
import { toast } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {}

const CreateMappings = (props: Props) => {
    const [configs, setConfigs] = useState<configs>();
    const [activeFilter] = activeFilterStore(state => [state.activeFilter]);
    const [selectedConfigs, setSelectedConfigs] = useState<any>({});
    const [company] = userStore(state => [state.company]);
    const [isExpanded, setIsExpanded] = useState<string[]>([]);
    const [parent] = useAutoAnimate();

    const activeProject = userStore(state => state.activeProject);

    const toggleExpansion = (typeName: string) => {
        if (isExpanded.includes(typeName)) {
            setIsExpanded(isExpanded.filter(name => name !== typeName));
        } else {
            setIsExpanded([...isExpanded, typeName]);
        }
    };

    const getConfigs = async () => {
        try {
            const result = await axios_config.get("/get-configs", {
                params: { projectID: activeProject?.projectID },
            });

            setConfigs(result.data);
        } catch (error: any) {
            return error.response;
        }
    }

    useEffect(() => {
        getConfigs();
    }, [activeProject])

    useEffect(() => {
        setSelectedConfigs({});
    }, [activeFilter])

    // Function to handle update of mapping
    const handleUpdateMapping = async () => {
        const data = {
            projectID: activeProject?.projectID,
            companyID: company?.companyID,
            configs: selectedConfigs,
            filter: activeFilter
        }

        if (!data.projectID) return alert('No active project found!');
        const id = toast.loading("Updating Mappings...")

        try {
            await axios_config.post('/create-mapping', data);
            toast.update(id, { render: "Mapping created successfully", type: "success", isLoading: false, autoClose: 2000 });
        } catch (error: any) {
            console.log(error)
            toast.update(id, { render: `${error.response.data.message}`, type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-center text-sm">
            <Filter />

            <div className="mt-4 flex flex-col justify-around w-full">
                <section ref={parent} className="w-full border rounded-md mt-8">
                    <div onClick={() => toggleExpansion('app')} className="flex w-full px-10 justify-between items-center cursor-pointer">
                        <h1 className="text-lg font-bold text-center my-4">App Config</h1>
                        <div className="flex gap-2">
                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedConfigs((prev: any) => {
                                    return {
                                        ...prev,
                                        app: null
                                    }
                                })
                            }}>
                                Clear Selection
                            </button>
                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() => toggleExpansion('app')}>{
                                !isExpanded.includes('app') ? 'Expand' : 'Collapse'
                            }
                            </button>
                        </div>
                    </div>
                    {!isExpanded.includes('app') ? null : (
                        <ConfigSelectorComponent
                            configList={configs?.appConfigs}
                            type='app'
                            selectedConfigs={selectedConfigs}
                            setSelectedConfigs={setSelectedConfigs}
                        />
                    )}
                </section>

                <section ref={parent} className="w-full border rounded-md mt-8">
                    <div onClick={() => toggleExpansion('player')} className="flex w-full px-10 justify-between items-center cursor-pointer">
                        <h1 className="text-lg font-bold text-center my-4">Player Config</h1>
                        <div className="flex gap-2">
                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedConfigs((prev: any) => {
                                    return {
                                        ...prev,
                                        player: null
                                    }
                                })
                            }}>
                                Clear Selection
                            </button>

                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() => toggleExpansion('player')}>{
                                !isExpanded.includes('player') ? 'Expand' : 'Collapse'
                            }
                            </button>
                        </div>
                    </div>
                    {!isExpanded.includes('player') ? null : (
                        <ConfigSelectorComponent
                            configList={configs?.playerConfigs}
                            type='player'
                            selectedConfigs={selectedConfigs}
                            setSelectedConfigs={setSelectedConfigs}
                        />
                    )}
                </section>

                {configs?.configTypes.map((configType, index) => (
                    configType.name !== 'app' && configType.name !== 'player' && configType.status === 'active' && (
                        <section ref={parent} key={index} className="w-full border rounded-md mt-8">
                            <div onClick={() => toggleExpansion(configType.name)} className="flex w-full px-10 justify-between items-center cursor-pointer">
                                <h1 className="text-lg font-bold text-center my-4">{configType.name}</h1>
                                <div className="gap-2 flex">
                                    <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedConfigs((prev: any) => {
                                            return {
                                                ...prev,
                                                [configType.name]: null
                                            }
                                        })
                                    }}>
                                        Clear Selection
                                    </button>
                                    <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() => toggleExpansion(configType.name)}>{
                                        !isExpanded.includes(configType.name) ? 'Expand' : 'Collapse'
                                    }
                                    </button>
                                </div>
                            </div>
                            {!isExpanded.includes(configType.name) ? null : (
                                <ConfigSelectorComponent
                                    configList={configs?.customConfigs.filter((config) => config.type === configType.name)}
                                    type={configType.name}
                                    selectedConfigs={selectedConfigs}
                                    setSelectedConfigs={setSelectedConfigs}
                                />
                            )}
                        </section>
                    )))}
            </div>

            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-primary700 text-white bg-primary600 transition-all" onClick={handleUpdateMapping}>Create Mapping</button>
        </div>
    )
}

export default CreateMappings