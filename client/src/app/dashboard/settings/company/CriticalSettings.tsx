'use client'
import { IoExitSharp, IoTrashBin } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"

export default function CompanyEmployeeSettings() {
  const { setCompany, setProjects, setActiveProject, company } = userStore((state) => ({
    setCompany: state.setCompany,
    setProjects: state.setProjects,
    setActiveProject: state.setActiveProject,
    company: state.company
  }));

  const role = company?.role;

  const leaveCompany = async () => {
    try {
      await axios_admin.post("/company/leave");
      setCompany(null);
      setProjects([]);
      setActiveProject(null);

      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.message);
      console.log(error);
    }
  }

  const deactivateCompany = async () => {
    try {
      await axios_admin.delete("/company/deactivate")
      setCompany(null);
      setProjects([]);
      setActiveProject(null);

      window.location.reload();
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full border rounded-md mt-8">
      <div className="flex px-4 my-4 w-full justify-between">
        <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Critical Settings</label>
      </div>

      <div className="p-5 border bg-white">
        <button
          type="button"
          className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
          onClick={() => {
            if (window.confirm('This action is irreversible and you will lose access to all your projects. Are you sure you want to leave the company? ')) {
              leaveCompany();
            }
          }}
        >
          <IoExitSharp className="w-5 h-5 mr-2" />
          Leave Company
        </button>

        {role === 'owner' && (
          <button
            type="button"
            className="flex items-center mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
            onClick={() => {
              if (window.confirm('All the projects under this company will be deactivated as well. Are you sure you want to deactivate the company? ')) {
                deactivateCompany();
              }
            }}
          >
            <IoTrashBin className="w-5 h-5 mr-2" />
            Deactivate Company
          </button>
        )}
      </div>
    </div>
  )
}
