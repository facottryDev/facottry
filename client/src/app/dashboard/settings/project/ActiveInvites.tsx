'use client'
import { IoExitSharp, IoTrashBin } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"

type Props = {}

const ActiveInvites = (props: Props) => {
  const activeProject = userStore(state => state.activeProject);

  return (
    <div className="w-full border rounded-md mt-8">
      <div className="flex px-4 my-4 w-full justify-between">
        <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Active Invites</label>
      </div>

      <div className="border p-4 min-h-[50vh] bg-white items-center gap-2 justify-between">
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
  )
}

export default ActiveInvites