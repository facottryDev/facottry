'use client'
import { IoExitSharp, IoTrashBin } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"
import { toast } from "react-toastify";

export default function ProjectOwnerSettings() {
  const activeProject = userStore(state => state.activeProject);

  const leaveProject = async () => {
    try {
      const result = await axios_admin.post("/project/leave", { projectID: activeProject?.projectID });
      toast(result.data.message);
      window.location.reload();
    } catch (error: any) {
      toast(error.response.data.message);
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
      toast(error.response.data.message);
    }
  }

  return (
    <div className="w-full border rounded-md mt-8">
      <div className="flex px-4 my-4 w-full justify-between">
        <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Critical Settings</label>
      </div>

      <div className="border p-4 bg-white items-center gap-2 justify-between">
        <button
          type="button"
          className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
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
