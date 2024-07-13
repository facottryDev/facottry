'use client'
import { IoExitSharp, IoTrashBin } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"

export default function ProjectOwnerSettings() {
    const activeProject = userStore(state => state.activeProject);

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

    

    return (
        <div className="bg-bggray rounded-lg p-8 dark:bg-darkblue">


            <div className="pb-6 dark:border-gray-500">


                {/* Modify User Box */}

            </div>

            {/* Manage Project Join Requests */}
            

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
