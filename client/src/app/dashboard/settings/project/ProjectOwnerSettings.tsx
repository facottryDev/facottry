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
        <div>
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
    )
}
