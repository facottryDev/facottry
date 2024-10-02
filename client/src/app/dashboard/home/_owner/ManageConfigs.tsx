'use client'
import { useEffect, useState } from "react"
import { axios_config } from "@/lib/axios"
import { userStore } from "@/lib/store";
import ConfigEditorComponent from "./ConfigEditorComponent";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {}

const ManageConfigs = (props: Props) => {
    const [configs, setConfigs] = useState<configs>();
    const [isExpanded, setIsExpanded] = useState<string[]>([]);

    const activeProject = userStore(state => state.activeProject);
    const userRole = activeProject?.role;
    const [parent] = useAutoAnimate();

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

    return (
        <div>
            {userRole && (userRole === 'owner' || userRole === 'editor') && (
                <div className="flex text-sm flex-col w-full justify-around">
                    <section ref={parent} className="w-full border shadow-sm rounded-md mt-8">
                        <div onClick={() => toggleExpansion('app')} className="flex w-full px-10 justify-between items-center cursor-pointer">
                            <h1 className="text-lg font-bold text-center my-4">App Config</h1>
                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() => toggleExpansion('app')}>{
                                isExpanded.includes('app') ? 'Collapse' : 'Expand'
                            }
                            </button>
                        </div>
                        {isExpanded.includes('app') && (
                            <ConfigEditorComponent type='app' configList={configs?.appConfigs} getConfigs={getConfigs} />
                        )}
                    </section>

                    <section ref={parent} className="w-full border shadow-sm rounded-md mt-8">
                        <div onClick={() => toggleExpansion('player')} className="flex w-full px-10 justify-between cursor-pointer items-center">
                            <h1 className="text-lg font-bold text-center my-4">Player Config</h1>
                            <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() => toggleExpansion('player')}>{
                                !isExpanded.includes('player') ? 'Expand' : 'Collapse'
                            }
                            </button>
                        </div>
                        {isExpanded.includes('player') && (
                            <ConfigEditorComponent type='player' configList={configs?.playerConfigs} getConfigs={getConfigs} />
                        )}
                    </section>

                    {configs?.configTypes.map((configType) => (
                        configType.name !== 'app' && configType.name !== 'player' && (
                            <section ref={parent} key={configType.name} className="w-full shadow-sm border rounded-md mt-8">
                                <div onClick={() => toggleExpansion(configType.name)} className="flex w-full px-10 justify-between items-center cursor-pointer">
                                    <h1 className="text-lg font-bold text-center my-4">{configType.name}</h1>
                                    <button className="font-medium border my-4 p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() => toggleExpansion(configType.name)}>{
                                        !isExpanded.includes(configType.name) ? 'Expand' : 'Collapse'
                                    }
                                    </button>
                                </div>
                                {isExpanded.includes(configType.name) && (
                                    <ConfigEditorComponent type={configType.name} configList={
                                        configs?.customConfigs.filter((config) => config.type === configType.name)
                                    } getConfigs={getConfigs} />
                                )}
                            </section>
                        )
                    ))}
                </div>
            )}
        </div>
    )
}

export default ManageConfigs