'use client'
import { IoExitSharp, IoTrashBin } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"
import Modal from 'react-modal';
import { useState } from "react";

export default function ProjectOwnerSettings() {
    const company = userStore(state => state.company);
    const activeProject = userStore(state => state.activeProject);
    const [role, setRole] = useState("viewer");
    const [AcceptRequestModal, setAcceptRequestModal] = useState(false);

    const leaveProject = async () => {
        try {
            const result = await axios_admin.post("/project/leave", { projectID: activeProject?.projectID });
            alert(result.data.message);
            window.location.reload();
        } catch (error: any) {
            alert(error.response.data.message);
            console.log(error.response)
        }
    }

    const deactivateProject = async () => {
        try {
            await axios_admin.post("/project/deactivate", { projectID: activeProject?.projectID });
            userStore.setState({ company: null });
            userStore.setState({ projects: [] });
            userStore.setState({ activeProject: null });
            window.location.reload();
        } catch (error: any) {
            console.log(error.response);
            alert(error.response.data.message);
        }
    }

    const handleAcceptRequest = (request: string, role: string) => async () => {
        try {
            await axios_admin.post("/project/accept-request", {
                email: request, role, projectID: activeProject?.projectID
            })
            alert("Request Accepted Successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

    const handleRejectRequest = (request: string) => async () => {
        try {
            await axios_admin.post("/project/reject-request", {
                email: request, projectID: activeProject?.projectID
            })
            alert("Request Rejected Successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

    return (
        <div className="bg-bggray rounded-lg p-8 dark:bg-darkblue">


            <div className="pb-6 dark:border-gray-500">


                {/* Modify User Box */}

            </div>

            {/* Manage Project Join Requests */}
            <div>
                <label className="block mt-4 text-sm font-bold leading-6 text-gray-900 dark:text-slate-200">
                    Manage Join Requests
                </label>

                <div className="border rounded-lg p-4 items-center mt-2 gap-2 justify-between">
                    {activeProject?.joinRequests.map((request, index) => (
                        <div key={index} className="flex justify-between">
                            <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                {index + 1}. {request}
                            </h2>

                            {/* Accept / Reject Button using Icons */}
                            <div className="flex gap-6">
                                <button
                                    type="button"
                                    className="flex items-center text-sm font-semibold leading-6 text-green-600 dark:text-green-400 hover:underline"
                                    onClick={() => setAcceptRequestModal(true)}
                                >
                                    Accept
                                </button>

                                <Modal
                                    isOpen={AcceptRequestModal}
                                    onRequestClose={() => setAcceptRequestModal(false)}
                                    contentLabel="Employee Role Selector"
                                    style={
                                        {
                                            overlay: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                            },
                                            content: {
                                                width: '50%',
                                                height: '30%',
                                                margin: 'auto',
                                                padding: '2rem',
                                                borderRadius: '10px',
                                                backgroundColor: 'white'
                                            }
                                        }
                                    }
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="font-bold text-primary">{request}</p>

                                        <div className="w-full">
                                            <label className="font-medium" htmlFor="projectrole">Select Role</label>
                                            <select id="projectrole" className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" onChange={(e) => setRole(e.target.value)}>
                                                <option value="owner">Owner</option>
                                                <option value="editor">Editor</option>
                                                <option value="viewer">Viewer</option>
                                            </select>
                                        </div>

                                        <button className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600" onClick={() => {
                                            handleAcceptRequest(request, role)();
                                            setAcceptRequestModal(false);
                                        }}>
                                            Confirm
                                        </button>
                                    </div>
                                </Modal>

                                <button
                                    type="button"
                                    className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                                    onClick={() => {
                                        if (window.confirm('Are you sure?')) {
                                            handleRejectRequest(request)();
                                        }
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manage Active Invites */}
            <div>
                <label className="block mt-4 text-sm font-bold leading-6 text-gray-900 dark:text-slate-200">
                    Manage Active Invites
                </label>

                <div className="border rounded-lg p-4 items-center mt-2 gap-2 justify-between">
                    {activeProject?.activeInvites.map((invite, index) => (
                        <div key={index} className="flex justify-between">
                            <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                {index + 1}. {invite}
                            </h2>

                            <button
                                type="button"
                                className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="mt-6 border-gray-900/10 dark:border-gray-500" />

            <div>
                {/* Leave Company */}
                <button
                    type="button"
                    className="flex items-center mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                    onClick={() => {
                        if (window.confirm('Are you sure?')) {
                            leaveProject();
                        }
                    }}
                >
                    <IoExitSharp className="w-5 h-5 mr-2" />
                    Leave Project
                </button>

                <button
                    type="button"
                    className="flex items-center mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                    onClick={() => {
                        if (window.confirm('Are you sure?')) {
                            deactivateProject();
                        }
                    }}
                >
                    <IoTrashBin className="w-5 h-5 mr-2" />
                    Deactivate Project
                </button>
            </div>
        </div>
    )
}
