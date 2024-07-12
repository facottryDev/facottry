'use client'
import { IoExitSharp } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"
import Image from "next/image"

export default function CompanyEmployeeSettings() {
    const company = userStore(state => state.company)
    
    const leaveCompany = async () => {
        try {
            await axios_admin.post("/company/leave")
            userStore.setState({ company: null })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-4 bg-white rounded-lg dark:bg-darkblue">
            <div className="pb-6 border- border-gray-900/10 dark:border-gray-500">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-200">Company Settings</h2>

                <hr className="my-4 border-gray-900/10 dark:border-gray-500" />

                <div className="mt-5">
                    <label htmlFor="companyid" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                        CompanyID: <span className="text-gray-600 font-light"> {company?.companyID} </span>
                    </label>

                    {company?.name && (
                        <label htmlFor="companyname" className="block mt-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Company Name: <span className="text-gray-600 font-light"> {company?.name} </span>
                        </label>
                    )}

                    {company?.address && (
                        <label htmlFor="companyname" className="block mt-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Company Address: <span className="text-gray-600 font-light"> {company?.address} </span>
                        </label>
                    )}

                    {company?.owners && (
                        <label htmlFor="companyname" className="block mt-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Company Owners: <span className="text-gray-600 font-light"> {company?.owners.join(", ")} </span>
                        </label>
                    )}
                </div>

                <div>
                    {/* Leave Company */}
                    <button
                        type="button"
                        className="flex items-center mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                        onClick={() => {
                            if (window.confirm('This action is irreversible and you will lose access to all your projects. Are you sure you want to leave the company? ')) {
                              leaveCompany();
                            }
                          }}
                    >
                        <IoExitSharp className="w-5 h-5 mr-2" />
                        Leave Company
                    </button>
                </div>
            </div>
        </div>
    )
}
