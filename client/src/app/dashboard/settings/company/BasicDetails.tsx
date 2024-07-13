'use client'
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"
import { toast } from "react-toastify"

type Props = {}

const BasicDetails = (props: Props) => {
  const company = userStore((state) => state.company);

  const updateCompanyDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      let body = {};

      if (data.name) {
        const isValidName = (name: string) => {
          const nameRegex = /^[a-zA-Z\s]+$/;
          return nameRegex.test(name);
        };

        if (!isValidName(String(data.name))) {
          throw new Error('Invalid name');
        }

        body = { ...body, name: data.name };
      }

      if (data.address) {
        body = { ...body, address: data.address };
      }

      axios_admin.post('/company/update', body);
      toast.success('Company updated successfully');
      window.location.reload();
    } catch (error) {
      console.error(error)
      toast.error('Error updating company')
    }
  }

  return (
    <div className="w-full border rounded-md mt-8">
      <div className="flex px-4 my-4 w-full justify-between">
        <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Basic Details</label>
      </div>

      <form className="p-5 border bg-white" onSubmit={updateCompanyDetails}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              CompanyID
            </label>
            <input
              type="email"
              name="email"
              id="email"
              disabled
              value={company?.companyID}
              className="block mt-2 w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={company?.name}
              autoComplete="name"
              className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
            />
          </div>

          <div className="col-span-full">
            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              Company Address
            </label>
            <div className="mt-2">
              <textarea
                name="address"
                id="address"
                autoComplete="address"
                placeholder={company?.address}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 justify-end gap-x-4">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200">
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary600 hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default BasicDetails