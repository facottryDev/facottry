'use client'
import Modal from 'react-modal';
import { useState } from "react";
import { axios_admin } from "@/lib/axios"
import { userStore } from "@/lib/store";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { MdDeleteSweep } from "react-icons/md";

const ManageUsers = (props: {}) => {
    const [InviteUserModal, setInviteUserModal] = useState(false);
    const [inviteData, setInviteData] = useState({ email: "", role: "owner" });
    const activeProject = userStore(state => state.activeProject);

    const inviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inviteLoader = toast.loading("Working...")

        try {
            const result = await axios_admin.post("/project/invite", {
                ...inviteData, projectID: activeProject?.projectID
            });
            toast.update(inviteLoader, { render: result.data.message, type: "success", isLoading: false, autoClose: 1000 });
            setInviteUserModal(false);
        } catch (error: any) {
            console.error(error);
            toast.update(inviteLoader, { render: error.response.data.message, type: "error", isLoading: false, autoClose: 1000 });
        }
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
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
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
        <div className="w-full border rounded-md mt-8 text-sm">
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
            </div>

            <div className="w-full">
                <table className="table-auto w-full border-t">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {activeProject?.owners.map((user: any, index: number) => (
                            <tr key={index}>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user}</p>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <select
                                        id={user}
                                        name={user}
                                        className="p-2 border bg-bggray rounded-md shadow-sm focus:outline-none  focus:border-gray-400 cursor-pointer transition-all sm:text-sm w-28"
                                        defaultValue={"owner"}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            if (window.confirm('Are you sure?')) {
                                                changeAccess(user, e)();
                                            }
                                        }}
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                </td>

                                <td className="border-b border-gray-200 text-sm pl-3">
                                    <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this user?")) {
                                            deleteUser(user)();
                                        }
                                    }}>
                                        <MdDeleteSweep fontSize={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {activeProject?.editors.map((user: any, index: number) => (
                            <tr key={index}>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user}</p>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <select
                                        id={user}
                                        name={user}
                                        className="p-2 border bg-bggray rounded-md shadow-sm focus:outline-none  focus:border-gray-400 cursor-pointer transition-all sm:text-sm w-28"
                                        defaultValue={"editor"}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            if (window.confirm('Are you sure?')) {
                                                changeAccess(user, e)();
                                            }
                                        }}
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                </td>

                                <td className="border-b border-gray-200 text-sm pl-3">
                                    <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this user?")) {
                                            deleteUser(user)();
                                        }
                                    }}>
                                        <MdDeleteSweep fontSize={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {activeProject?.viewers.map((user: any, index: number) => (
                            <tr key={index}>
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user}</p>
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <select
                                        id={user}
                                        name={user}
                                        className="p-2 border bg-bggray rounded-md shadow-sm focus:outline-none  focus:border-gray-400 cursor-pointer transition-all sm:text-sm w-28"
                                        defaultValue={"viewer"}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            if (window.confirm('Are you sure?')) {
                                                changeAccess(user, e)();
                                            }
                                        }}
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                </td>

                                <td className="border-b border-gray-200 text-sm pl-3">
                                    <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this user?")) {
                                            deleteUser(user)();
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



            {/* <div className="border bg-white p-4 items-center gap-2 justify-between min-h-[50vh] overflow-y-scroll">
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
            </div> */}

            <Modal
                isOpen={InviteUserModal}
                onRequestClose={() => setInviteUserModal(false)}
                contentLabel="Invite User To Company"
                style={
                    {
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                        },
                        content: {
                            width: '50%',
                            height: 'fit-content',
                            margin: 'auto',
                            padding: '2rem',
                            borderRadius: '10px',
                            backgroundColor: 'white'
                        }
                    }
                }
            >
                <div className="text-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-lg font-bold">Invite User</h1>

                        <button
                            onClick={() => setInviteUserModal(false)}
                        >
                            <IoClose fontSize={'1.2rem'} />
                        </button>
                    </div>

                    <form className="flex flex-col items-center gap-4 text-sm" onSubmit={inviteUser}>
                        <div className="w-full">
                            <label className="font-medium" htmlFor="newuseremail"> Email </label>
                            <input type="email" placeholder="demo@gmail.com" autoComplete='email' id="newuseremail" name="newuseremail" className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" onChange={
                                (e) => setInviteData({ ...inviteData, email: e.target.value })
                            } />
                        </div>

                        <button className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600" type="submit">
                            Invite
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default ManageUsers