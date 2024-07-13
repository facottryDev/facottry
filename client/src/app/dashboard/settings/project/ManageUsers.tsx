'use client'
import Modal from 'react-modal';
import { useState } from "react";
import { axios_admin } from "@/lib/axios"
import { userStore } from "@/lib/store";

type Props = {}

export const ManageUsers = (props: Props) => {
    const [InviteUserModal, setInviteUserModal] = useState(false);
    const [inviteData, setInviteData] = useState({ email: "", role: "" });
    const activeProject = userStore(state => state.activeProject);

    const inviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`Not Implemented Yet`);
    }

    const deleteUser = (email: string) => async () => {
        try {
            await axios_admin.post("/project/delete-user", {
                email, projectID: activeProject?.projectID
            })
            alert("User Removed Successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

    const changeAccess = (email: string, e: React.ChangeEvent<HTMLSelectElement>) => async () => {
        try {
            await axios_admin.post("/project/change-access", {
                email, role: e.target.value, projectID: activeProject?.projectID
            })
            alert("Access Changed Successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

    return (
        <div className="w-full border rounded-md mt-8">
            <div className="my-4">
                <div className="flex px-4 w-full justify-between">
                    <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Manage Users</label>

                    <button
                        type="button"
                        className="flex items-center text-sm font-semibold leading-6 text-primary hover:underline"
                        onClick={() => setInviteUserModal(true)}
                    >
                        Invite User
                    </button>
                </div>

                {/* Invite User Dialog Box */}
                <Modal
                    isOpen={InviteUserModal}
                    onRequestClose={() => setInviteUserModal(false)}
                    contentLabel="Employee Role Selector"
                    style={
                        {
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.75)'
                            },
                            content: {
                                width: '50%',
                                height: '32%',
                                margin: 'auto',
                                padding: '2rem',
                                borderRadius: '10px',
                                backgroundColor: 'white'
                            }
                        }
                    }
                >
                    <form className="flex flex-col items-center gap-4" onSubmit={inviteUser}>
                        <div className="w-full">
                            <label className="font-medium" htmlFor="newuseremail"> Email </label>
                            <input type="email" placeholder="demo@gmail.com" autoComplete='email' id="newuseremail" name="newuseremail" className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" onChange={
                                (e) => setInviteData({ ...inviteData, email: e.target.value })
                            } />
                        </div>

                        <div className="w-full">
                            <label className="font-medium" htmlFor="newuserrole">Select Role</label>
                            <select
                                id="newuserrole"
                                name="newuserrole"
                                className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                onChange={
                                    (e) => setInviteData({ ...inviteData, role: e.target.value })
                                }>
                                <option value="owner">Owner</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>

                        <button className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600" type="submit">
                            Invite
                        </button>
                    </form>
                </Modal>
            </div>

            <div className="border bg-white p-4 items-center gap-2 justify-between min-h-[50vh] overflow-y-scroll">
                {activeProject?.owners.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            {index + 1}. {item}
                        </h2>

                        <div className="flex gap-6 text-sm items-center font-semibold">
                            <select
                                id={item}
                                name={item}
                                className="p-2 border bg-bggray w-full rounded-md shadow-sm focus:outline-none  focus:border-gray-400 cursor-pointer transition-all sm:text-sm"
                                defaultValue={"owner"}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    if (window.confirm('Are you sure?')) {
                                        changeAccess(item, e)();
                                    }
                                }}
                            >
                                <option value="owner">Owner</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>

                            <button
                                type="button"
                                className="flex items-center text-red-600 dark:text-red-400 hover:underline"
                                onClick={() => {
                                    if (window.confirm('Are you sure?')) {
                                        deleteUser(item)();
                                    }
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {activeProject && activeProject?.editors.length > 0 && <hr className="my-4 border-gray-900/10 dark:border-gray-500" />}

                {activeProject?.editors.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            {index + 1}. {item}
                        </h2>

                        <div className="flex gap-6 text-sm items-center font-semibold">
                            <select
                                id={item}
                                name={item}
                                className="p-2 border bg-bggray w-full rounded-md shadow-sm focus:outline-none  focus:border-gray-400 cursor-pointer transition-all sm:text-sm"
                                defaultValue={"editor"}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    if (window.confirm('Are you sure?')) {
                                        changeAccess(item, e)();
                                    }
                                }}
                            >
                                <option value="owner">Owner</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>

                            <button
                                type="button"
                                className="flex items-center text-red-600 dark:text-red-400 hover:underline"
                                onClick={() => {
                                    if (window.confirm('Are you sure?')) {
                                        deleteUser(item)();
                                    }
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {activeProject && activeProject?.viewers.length > 0 && <hr className="my-4 border-gray-900/10 dark:border-gray-500" />}

                {activeProject?.viewers.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            {index + 1}. {item}
                        </h2>

                        <div className="flex gap-6 text-sm items-center font-semibold">
                            <select
                                id={item}
                                name={item}
                                className="p-2 border bg-bggray w-full rounded-md shadow-sm focus:outline-none  focus:border-gray-400 cursor-pointer transition-all sm:text-sm"
                                defaultValue={"viewer"}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    if (window.confirm('Are you sure?')) {
                                        changeAccess(item, e)();
                                    }
                                }}
                            >
                                <option value="owner">Owner</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>

                            <button
                                type="button"
                                className="flex items-center text-red-600 dark:text-red-400 hover:underline"
                                onClick={() => {
                                    if (window.confirm('Are you sure?')) {
                                        deleteUser(item)();
                                    }
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}