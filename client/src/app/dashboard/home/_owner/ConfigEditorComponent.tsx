'use client'
import { useState } from "react"
import { axios_config } from "@/lib/axios"
import { userStore } from "@/lib/store";
import { fetchConfigs } from "@/lib/fetch"
import Modal from 'react-modal';
import { IoClose, IoPencilSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { MdDeleteSweep, MdEditNote, MdInfoOutline } from "react-icons/md";
import { JsonEditor } from 'json-edit-react'
import { useTheme } from "next-themes";

type Props = {
    configList: config[] | undefined;
    getConfigs: () => void;
    type: string;
}

const ConfigTableComponent = (props: Props) => {
    // const [editorMarker, setEditorMarker] = useState<any>([]);

    const activeProject = userStore(state => state.activeProject);
    const [configModal, setconfigModal] = useState('');
    const [detailsModal, setDetailsModal] = useState('');
    const [editorValue, setEditorValue] = useState<any>({});
    const [isEditable, setIsEditable] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleDelete = async (configID: string) => {
        try {
            await axios_config.delete(`/delete?configID=${configID}`);
            toast.success("Config deleted successfully");
            props.getConfigs();
            setconfigModal("");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const handleEdit = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const configID = formData.get('configID');
        const name = formData.get('ConfigName');
        const desc = formData.get('ConfigDesc');
        const params = editorValue;

        try {
            await axios_config.post(`/update`, {
                configID,
                name,
                desc,
                params,
            });
            toast.success("Config updated successfully");
            fetchConfigs(activeProject?.projectID);
            props.getConfigs();
            setconfigModal("");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const handleClone = async (config: any) => {
        const configID = config.configID;

        try {
            await axios_config.post(`/clone`, {
                configID
            });
            toast.success("Config cloned successfully");
            fetchConfigs(activeProject?.projectID);
            props.getConfigs();
            setconfigModal("");
        } catch (error: any) {
            console.log(error.response.data);
            toast.error(error.response.data?.message);
        }
    }

    const handleCreate = async (e: any) => {
        e.preventDefault();

        try {
            const data = {
                projectID: activeProject?.projectID,
                name: e.target.ConfigName.value,
                desc: e.target.ConfigDesc.value,
                type: props.type,
                params: editorValue
            }

            if (!data.projectID) return toast('No active project found!');

            await axios_config.post('/add-config', data);
            props.getConfigs();
            toast.success('Config created successfully');
            setconfigModal('');
        } catch (error: any) {
            console.log(error.response.data)
            toast.error(error.response.data.message);
        }
    }

    return (
        <section className="text-sm flex flex-col items-center justify-center dark:text-white dark:bg-darkblue300">
            <div className="w-full border bg-white">
                <div className="overflow-y-auto h-fit">
                    <table className="min-w-full leading-normal">
                        <thead className="sticky top-0">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.configList?.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((config, index) => {
                                const updatedAtDate = new Date(config.updatedAt);
                                const createdAtDate = new Date(config.createdAt);
                                const formattedUpdatedAt = `${updatedAtDate.toLocaleDateString()}, ${updatedAtDate.toLocaleTimeString()}`;
                                const formattedCreatedAt = `${createdAtDate.toLocaleDateString()}, ${createdAtDate.toLocaleTimeString()}`;

                                return (
                                    <tr key={index}>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-bold">{config.name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{config.desc}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <button className="ml-2 p-2 rounded-full bg-primary600 text-white hover:bg-primary700 transition-all" onClick={
                                                () => {
                                                    setDetailsModal(config.configID)
                                                }
                                            }>
                                                <MdInfoOutline fontSize={18} />
                                            </button>

                                            <Modal
                                                isOpen={detailsModal === config.configID}
                                                onRequestClose={() => {
                                                    setDetailsModal("");
                                                }}
                                                contentLabel="Config Details Modal"
                                                style={
                                                    {
                                                        overlay: {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                                        },
                                                        content: {
                                                            width: 'max-content',
                                                            height: 'max-content',
                                                            margin: 'auto',
                                                            padding: '2rem',
                                                            boxSizing: 'border-box',
                                                            borderRadius: '10px',
                                                            backgroundColor: 'white',
                                                            display: 'flex',
                                                            flexDirection: 'column',

                                                        }
                                                    }
                                                }
                                            >
                                                <div className="flex flex-col items-center justify-center bg-white">
                                                    <div className="flex justify-between w-full">
                                                        <h1 className="font-bold text-lg">Config Details</h1>
                                                        <div>
                                                            <button className="p-2 rounded-full bg-primary900 hover:bg-black text-white transition-all" onClick={() => {
                                                                setDetailsModal('');
                                                            }}>
                                                                <IoClose />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex text-sm w-full flex-col mt-4">

                                                        <div className="flex gap-4 items-center mb-2 justify-between">
                                                            <p className="text-gray-600 mr-4">ConfigID:</p>
                                                            <p className="text-gray-900">{config.configID}</p>
                                                        </div>
                                                        <div className="flex gap-4 items-center mb-2 justify-between">
                                                            <p className="text-gray-600 mr-4">Created At:</p>
                                                            <p className="text-gray-900">{formattedCreatedAt}</p>
                                                        </div>
                                                        <div className="flex gap-4 items-center mb-2  justify-between">
                                                            <p className="text-gray-600">Updated At:</p>
                                                            <p className="text-gray-900">{formattedUpdatedAt}</p>
                                                        </div>
                                                        <div className="flex gap-4 items-center mb-2  justify-between">
                                                            <p className="text-gray-600">Created By:</p>
                                                            <p className="text-gray-900">{config.createdBy}</p>
                                                        </div>
                                                        <div className="flex gap-4 items-center mb-2  justify-between">
                                                            <p className="text-gray-600">Last Modified By:</p>
                                                            <p className="text-gray-900">{config.lastModifiedBy}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Modal>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <div className="flex">
                                                <button className="ml-2 p-2 rounded-full bg-primary600 text-white hover:bg-primary700 transition-all" onClick={
                                                    () => {
                                                        setconfigModal(config.configID);
                                                        console.log(config)
                                                        setEditorValue(config.params);
                                                    }
                                                }>
                                                    <MdEditNote fontSize={18} />
                                                </button>

                                                <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={
                                                    () => {
                                                        if (window.confirm('Are you sure?')) {
                                                            handleDelete(config.configID);
                                                        }
                                                    }
                                                }>
                                                    <MdDeleteSweep fontSize={18} />
                                                </button>
                                            </div>

                                            <Modal
                                                isOpen={configModal === config.configID}
                                                onRequestClose={() => {
                                                    setconfigModal("");
                                                    setEditorValue('');
                                                    setIsEditable(false);
                                                }}
                                                contentLabel="Edit Config Modal"
                                                style={
                                                    {
                                                        overlay: {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                                        },
                                                        content: {
                                                            width: 'calc(100% - 4rem)', // 100% width minus padding
                                                            height: 'max-content', // Height of the modal
                                                            margin: 'auto',
                                                            padding: '2rem', // Padding around the content
                                                            boxSizing: 'border-box', // Include padding in the width and height calculations
                                                            borderRadius: '10px',
                                                            backgroundColor: 'white',
                                                            display: 'flex',
                                                            flexDirection: 'column'
                                                        }
                                                    }
                                                }
                                            >
                                                <div className="flex flex-col items-center justify-center bg-white">
                                                    <div className="flex justify-between w-full px-4">
                                                        <h1 className="font-bold text-lg">Edit Config</h1>
                                                        <div>
                                                            <button
                                                                onClick={() => setIsEditable(!isEditable)}
                                                                className="p-2 rounded-full bg-primary600 hover:bg-primary700 text-white transition-all mr-2">
                                                                <IoPencilSharp />
                                                            </button>
                                                            <button className="p-2 rounded-full bg-primary900 hover:bg-black text-white transition-all" onClick={() => {
                                                                setconfigModal('');
                                                                setEditorValue('');
                                                                setIsEditable(false);
                                                            }}>
                                                                <IoClose />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <form className="flex w-full flex-col bg-white" onSubmit={handleEdit}>
                                                        <input type="hidden" name="configID" value={config.configID} />

                                                        {/* Flex container for the form content */}
                                                        <div className="flex text-sm h-[60vh] md:h-[70vh] p-4 flex-col md:flex-row w-full">
                                                            {/* Left side */}
                                                            <div className="flex flex-col min-w-[200px]">
                                                                <label htmlFor="ConfigName" className="font-semibold mb-1">Name*</label>
                                                                <input disabled={!isEditable} id="ConfigName" name="ConfigName" type="text" className="w-full p-2 border rounded-md" defaultValue={config.name} onKeyDown={(e) => e.stopPropagation()} />

                                                                <label htmlFor="ConfigDesc" className="mt-4 font-semibold mb-1">Description</label>
                                                                <input disabled={!isEditable} type="text" id="ConfigDesc" name="ConfigDesc" className="w-full p-2 border rounded-md" defaultValue={config.desc} onKeyDown={(e) => e.stopPropagation()} />
                                                            </div>

                                                            {/* Divider */}
                                                            <div className="hidden sm:block mx-8 bg-gray-200 w-px h-auto"></div>

                                                            {/* Right side */}
                                                            <div className="w-full shadow-sm border p-4 rounded-lg h-full flex flex-col mt-2 md:mt-0">
                                                                <label className="font-semibold mb-1">JSON Params*</label>

                                                                <JsonEditor
                                                                    data={editorValue}
                                                                    restrictEdit={!isEditable}
                                                                    restrictAdd={!isEditable}
                                                                    restrictDelete={!isEditable}
                                                                    restrictTypeSelection={!isEditable}
                                                                    collapse={1}
                                                                    rootName={config.name}
                                                                    showErrorMessages={true}
                                                                    setData={
                                                                        (data: any) => {
                                                                            setEditorValue(data);
                                                                        }
                                                                    }
                                                                    theme={
                                                                        theme === "dark"
                                                                            ? [
                                                                                'githubDark',
                                                                                {
                                                                                    container: {
                                                                                        backgroundColor: '#09090b'
                                                                                    }
                                                                                },
                                                                            ] : [
                                                                                'githubLight',
                                                                                {
                                                                                    container: {
                                                                                        backgroundColor: '#ffffff'
                                                                                    }
                                                                                },
                                                                            ]
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex w-full gap-2 justify-end px-4">
                                                            <button type="button" className="font-medium text-center text-sm border py-2 px-5 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={
                                                                () => {
                                                                    window.confirm('Are you sure?') && handleClone(config);
                                                                }
                                                            }>Clone Config</button>
                                                            <button
                                                                disabled={!isEditable} type="submit" className={
                                                                    `font-medium text-center text-sm border py-2 px-5 rounded-md shadow-sm transition-all ${isEditable ? 'bg-primary600 hover:bg-primary700 text-white' : 'bg-gray-300 text-gray-500'}`

                                                                }>Save Changes</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </Modal>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <button onClick={
                () => {
                    setconfigModal('new');
                    setEditorValue({
                        "key": "value"
                    });
                }
            } className="font-medium border my-4 p-2 rounded-md shadow-sm hover:bg-gray-100 transition-all">
                Create New Config
            </button>

            <Modal
                isOpen={configModal === 'new'}
                onRequestClose={() => {
                    setconfigModal("");
                    setEditorValue({});
                }}
                contentLabel="Add Config Modal"
                style={
                    {
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                        },
                        content: {
                            width: 'calc(100% - 4rem)', // 100% width minus padding
                            height: 'max-content', // Height of the modal
                            margin: 'auto',
                            padding: '2rem', // Padding around the content
                            boxSizing: 'border-box', // Include padding in the width and height calculations
                            borderRadius: '10px',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                }
            >
                <div className="flex flex-col items-center justify-center bg-white">
                    <div className="flex justify-between w-full px-4">
                        <h1 className="font-bold text-lg">Create New Config</h1>
                        <button className="p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                            setconfigModal("");
                            setEditorValue({});
                        }}>
                            <IoClose />
                        </button>
                    </div>

                    <form className="flex w-full flex-col bg-white text-sm" onSubmit={handleCreate}>
                        <div className="flex p-4 flex-col md:flex-row w-full h-[70vh] overflow-y-scroll">
                            {/* Left side */}
                            <div className="flex flex-col min-w-[200px]">
                                <label htmlFor="ConfigName" className="mb-1 font-semibold">Name</label>
                                <input id="ConfigName" name="ConfigName" type="text" className="w-full p-2 border rounded-md" onKeyDown={(e) => e.stopPropagation()} />

                                <label htmlFor="ConfigDesc" className="mb-1 font-semibold mt-4">Description</label>
                                <input type="text" id="ConfigDesc" maxLength={50} name="ConfigDesc" required className="w-full p-2 border rounded-md" onKeyDown={(e) => e.stopPropagation()} />
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block mx-8 bg-gray-200 w-px h-auto"></div>

                            {/* Right side */}
                            <div className="w-full shadow-sm border p-4 rounded-lg flex flex-col mt-2 md:mt-0">
                                <label className="font-semibold mb-1">JSON Params</label>
                                {/* <Editor
                                    height="50vh"
                                    width="100%"
                                    defaultLanguage="json"
                                    theme="vs-light"
                                    defaultValue={`{\n"key": "value"\n}`}
                                    onChange={(value) => setEditorValue(value)}
                                    onValidate={(markers) => {
                                        setEditorMarker(markers);
                                    }}
                                /> */}

                                <JsonEditor
                                    data={editorValue}
                                    collapse={1}
                                    rootName={"config"}
                                    showErrorMessages={true}
                                    setData={
                                        (data: any) => {
                                            setEditorValue(data);
                                        }
                                    }
                                    theme={
                                        theme === "dark"
                                            ? [
                                                'githubDark',
                                                {
                                                    container: {
                                                        backgroundColor: '#09090b'
                                                    }
                                                },
                                            ] : [
                                                'githubLight',
                                                {
                                                    container: {
                                                        backgroundColor: '#ffffff'
                                                    }
                                                },
                                            ]
                                    }
                                />

                                {/* Validation Errors */}
                                {/* <div>
                                    {editorMarker.length > 0 && (
                                        <div className="mt-2 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 transition-all">
                                            <ul>
                                                {editorMarker.map((marker: any, index: number) => {
                                                    return (
                                                        <li key={index} className="text-sm list-disc list-inside">
                                                            Line {marker.startLineNumber}, Col {marker.startColumn}: {marker.message}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div> */}
                            </div>
                        </div>

                        <div className="w-full flex justify-end pr-4">
                            <button type="submit" className="font-medium text-center text-sm border w-fit px-8 py-2 rounded-md shadow-sm hover:bg-gray-100 transition-all">Save Changes</button>
                        </div>

                    </form>
                </div>
            </Modal>
        </section>
    )
}

export default ConfigTableComponent