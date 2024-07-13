'use client'
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"

type Props = {}

const ManageUsers = (props: Props) => {
  const company = userStore((state) => state.company);


  const handleRemoveEmployee = (employee: string) => async () => {
    try {
      const result = await axios_admin.post("/company/delete-employee", { email: employee });
      alert(result.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      alert(error.response.data.message)
    }
  }

  return (
    <div>
      <div className="w-full border rounded-md mt-8">
        <div className="flex px-4 my-4 w-full justify-between">
          <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Manage Owners</label>
        </div>

        <div className="border bg-white overflow-y-scroll min-h-[25vh] max-h-[40vh] p-4 items-center mt-2 gap-2 justify-between">
          {company?.owners.map((owner, index) => (
            <div key={index} className="flex justify-between">
              <label htmlFor="companyname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                {index + 1}. {owner}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border rounded-md mt-8">
        <div className="flex px-4 my-4 w-full justify-between">
          <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Manage Employees</label>
        </div>

        <div className="border min-h-[25vh] overflow-y-scroll max-h-[40vh] bg-white p-4 items-center mt-2 gap-2 justify-between">
          {company?.employees.map((employee, index) => (
            <div key={index} className="flex justify-between">
              <label htmlFor="companyname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                {index + 1}. {employee}
              </label>

              <button
                type="button"
                className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    handleRemoveEmployee(employee)();
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageUsers