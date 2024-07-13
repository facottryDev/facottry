'use client'
import { axios_admin } from "@/lib/axios"
import Modal from 'react-modal';
import { useState } from "react";
import { userStore } from "@/lib/store";
import { IoClose, IoTrashBin } from "react-icons/io5";
import { toast } from 'react-toastify';

type Props = {}

const ConfigTypeComponent = (props: Props) => {
    const [AddConfigTypeModal, setAddConfigTypeModal] = useState(false);
    const [activeProject, setActiveProject, setProjects] = userStore(state => [state.activeProject, state.setActiveProject, state.setProjects]);

    const refreshAdmin = async () => {
        const adminResponse = await axios_admin.get('/get-admin');
        const { projects } = adminResponse.data;
        setProjects(projects);
        const currentProject = projects.find((p: any) => p.projectID === activeProject?.projectID);
        setActiveProject(currentProject);
    }

    const handleAddConfigType = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const config = {
            name: formData.get('name') as string,
            desc: formData.get('desc') as string,
            status: formData.get('status') as string,
        }

        try {
            await axios_admin.post('/project/config-type/add', {
                projectID: activeProject?.projectID,
                config
            })
            toast.success("Config Type Added Successfully");
            setAddConfigTypeModal(false);
            refreshAdmin();
        } catch (error: any) {
            console.error(error)
            toast.error(error.response.data.message)
        }
    }

    const handleDeleteConfigType = async (name: string) => {
        try {
            await axios_admin.delete('/project/config-type/delete', {
                params: {
                    projectID: activeProject?.projectID,
                    name
                }
            })
            toast.success("Config Type Deleted Successfully");
            refreshAdmin();
        } catch (error: any) {
            console.error(error)
            toast.error(error.response.data.message)
        }
    }

    const handleToggleStatus = async (name: string) => {
        try {
            await axios_admin.put('/project/config-type/toggle-status', {
                projectID: activeProject?.projectID,
                name
            })
            toast.success("Config Type Status Updated Successfully");
            refreshAdmin();
        } catch (error: any) {
            console.error(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <section className="text-sm flex flex-col items-center justify-center dark:text-white dark:bg-darkblue300">
            <div className="w-full border bg-white">
                <div className="overflow-y-auto max-h-[60vh]">
                    <table className="min-w-full">
                        <thead className="sticky top-0">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeProject?.configTypes && activeProject?.configTypes.map((config, index) => (
                                <tr key={index} >
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-bold">{config.name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{config.desc}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <div className="flex">
                                            {config.name !== 'app' && config.name !== 'player' && (
                                                <div className="flex items-center">
                                                    <button className={`ml-2 px-4 py-2 rounded-full text-white transition-all text-sm ${config.status !== 'active' ? 'bg-primary600 hover:bg-primary600' : 'bg-primary800 hover:bg-primary900'

                                                        }`} onClick={
                                                            () => {
                                                                if (window.confirm('Are you sure?')) {
                                                                    handleToggleStatus(config.name);
                                                                }
                                                            }
                                                        }>
                                                        {config.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </button>

                                                    <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={
                                                        () => {
                                                            if (window.confirm('Are you sure?')) {
                                                                handleDeleteConfigType(config.name);
                                                            }
                                                        }
                                                    }>
                                                        <IoTrashBin />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add New Config Type */}
            <button className="font-medium text-center text-sm border my-4 p-2 rounded-md shadow-sm hover:bg-gray-100 transition-all" onClick={() =>
                setAddConfigTypeModal(true)
            }>
                Create New Config Type
            </button>

            <Modal
                isOpen={AddConfigTypeModal}
                onRequestClose={() => setAddConfigTypeModal(false)}
                contentLabel="Add Config Type Modal"
                style={
                    {
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                        },
                        content: {
                            width: 'max-content',
                            height: 'max-content',
                            maxHeight: '80%',
                            margin: 'auto',
                            padding: '2rem',
                            borderRadius: '10px',
                            backgroundColor: 'white'
                        }
                    }
                }
            >
                <div>
                    <div className="flex justify-between w-full ">
                        <h1 className="font-bold uppercase text-lg">Create New Type</h1>
                        <button className="p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => setAddConfigTypeModal(false)}>
                            <IoClose />
                        </button>
                    </div>

                    <form className="flex flex-col mt-4 gap-2" onSubmit={handleAddConfigType}>
                        <div>
                            <label htmlFor="name" className="mt-4">Name</label>
                            <input id="name" name="name" type="text" className="w-full p-2 mt-2 border rounded-md" required onKeyDown={(e) => e.stopPropagation()} />
                        </div>

                        <div>
                            <label htmlFor="desc" className="mt-4">Description</label>
                            <input id="desc" name="desc" type="text" className="w-full p-2 mt-2 border rounded-md" required onKeyDown={(e) => e.stopPropagation()} />
                        </div>

                        <div>
                            <label htmlFor="status" className="mt-4">Status</label>
                            <select id="status" name="status" className="w-full p-2 mt-2 border rounded-md" required onKeyDown={(e) => e.stopPropagation()}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <button type="submit" className="font-medium self-center text-center text-sm border mt-4 px-5 py-2 w-fit rounded-md shadow-sm hover:bg-slate-200 transition-all">Submit</button>
                    </form>
                </div>
            </Modal>
        </section>
    )
}

export default ConfigTypeComponent