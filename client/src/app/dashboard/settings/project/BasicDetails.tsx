'use client'
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"
import { useState } from "react";

type Props = {}

const BasicDetails = (props: Props) => {
    const company = userStore(state => state.company);
    const activeProject = userStore(state => state.activeProject);

    const updateProjectDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string || activeProject?.name;
        const type = formData.get("type") as string || activeProject?.type;

        try {
            await axios_admin.post("/update-project", {
                companyID: company?.companyID,
                projectID: activeProject?.projectID,
                name,
                type
            })

            alert("Updated Successfully");
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

    return (
        <div className="w-full border rounded-md mt-8">
            <div className="flex px-4 my-4 w-full justify-between">
                <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Basic Details</label>
            </div>

            <div className="flex flex-col">
                <form className="p-5 bg-white border rounded-lg" onSubmit={updateProjectDetails}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="projectID" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                ProjectID
                            </label>
                            <input
                                type="text"
                                name="projectID"
                                id="projectID"
                                disabled
                                value={activeProject?.projectID}
                                className="block mt-2 w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                Project Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder={activeProject?.name}
                                autoComplete="name"
                                className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
                            />
                        </div>

                        <div className="mb-4 sm:col-span-3">
                            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Change Project Type</label>
                            <select name="type" id="type" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">SELECT</option>
                                <option value="PROD">PROD</option>
                                <option value="UAT">UAT</option>
                                <option value="DEV">DEV</option>
                                <option value="TEST">TEST</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-4">
                        <button
                            type="submit"
                            className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BasicDetails