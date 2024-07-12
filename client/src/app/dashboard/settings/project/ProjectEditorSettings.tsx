'use client'
import { IoExitSharp } from "react-icons/io5";
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

    return (
        <div className="p-4 bg-white rounded-lg dark:bg-darkblue">
            <div className="pb-6 dark:border-gray-500">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-200">Project Settings</h2>

                <hr className="my-4 border-gray-900/10 dark:border-gray-500" />

                <div className="mt-5">
                    <label htmlFor="companyid" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                        ProjectID: <span className="text-gray-600 font-light"> {activeProject?.projectID} </span>
                    </label>

                    {activeProject?.name && (
                        <label htmlFor="companyname" className="block mt-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Project Name: <span className="text-gray-600 font-light"> {activeProject?.name} </span>
                        </label>
                    )}

                    {activeProject?.type && (
                        <label htmlFor="companyname" className="block mt-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Project Type: <span className="text-gray-600 font-light"> {activeProject?.type} </span>
                        </label>
                    )}

                    {activeProject?.owners && (
                        <label htmlFor="companyname" className="block mt-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Owners: <span className="text-gray-600 font-light"> {activeProject?.owners.join(", ")} </span>
                        </label>
                    )}
                </div>

                <div>
                    {/* Leave Project */}
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
                </div>
            </div>
        </div>
    )
}
