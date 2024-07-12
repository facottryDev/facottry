'use client'
import { IoExitSharp, IoTrashBin } from "react-icons/io5";
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"

export default function CompanyEmployeeSettings() {
    const company = userStore((state) => state.company);
    const setCompany = userStore((state) => state.setCompany);
    const setProjects = userStore((state) => state.setProjects);
    const setActiveProject = userStore((state) => state.setActiveProject);

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

    const handleAcceptRequest = (request: string) => async () => {
        console.log('hey')
        try {
            const result = await axios_admin.post("/company/accept-request", { email: request });
            alert(result.data.message);
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

    const handleRejectRequest = (request: string) => async () => {
        try {
            const result = await axios_admin.post("/company/reject-request", { email: request });
            alert(result.data.message);
            window.location.reload();
        } catch (error: any) {
            console.error(error)
            alert(error.response.data.message)
        }
    }

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
            alert('Company updated successfully');
            window.location.reload();
        } catch (error) {
            console.error(error)
            alert('Error updating company')
        }
    }

    return (
        <div className="p-4 bg-white rounded-lg dark:bg-darkblue">
            <div className="pb-6 dark:border-gray-500">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-200">Company Settings</h2>

                <hr className="my-4 border-gray-900/10 dark:border-gray-500" />

                <div className="flex flex-col">
                    <label htmlFor="companyname" className="block text-sm font-bold leading-6 text-gray-900 dark:text-slate-200">
                        Company Details
                    </label>

                    <form className="p-5 border rounded-lg mt-2" onSubmit={updateCompanyDetails}>
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
                                className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>

                <hr className="my-4 border-gray-900/10 dark:border-gray-500" />

                {/* Manage Company Owners */}
                <div>
                    <label htmlFor="companyname" className="block mt-4 text-sm font-bold leading-6 text-gray-900 dark:text-slate-200">
                        Manage Owners
                    </label>

                    <div className="border rounded-lg p-4 items-center mt-2 gap-2 justify-between">
                        {company?.owners.map((owner, index) => (
                            <div key={index} className="flex justify-between">
                                <label htmlFor="companyname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                    {index + 1}. {owner}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manage Company Employees */}
                <div>
                    <label htmlFor="companyname" className="block mt-4 text-sm font-bold leading-6 text-gray-900 dark:text-slate-200">
                        Manage Employees
                    </label>

                    <div className="border rounded-lg p-4 items-center mt-2 gap-2 justify-between">
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


                {/* Manage Company Join Requests */}
                <div>
                    <label htmlFor="companyname" className="block mt-4 text-sm font-bold leading-6 text-gray-900 dark:text-slate-200">
                        Manage Join Requests
                    </label>

                    <div className="border rounded-lg p-4 items-center mt-2 gap-2 justify-between">
                        {company?.joinRequests.map((request, index) => (
                            <div key={index} className="flex justify-between">
                                <label htmlFor="companyname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                    {index + 1}. {request}
                                </label>

                                {/* Accept / Reject Button using Icons */}
                                <div className="flex gap-6">
                                    <button
                                        type="button"
                                        className="flex items-center text-sm font-semibold leading-6 text-green-600 dark:text-green-400 hover:underline"
                                        onClick={() => {
                                            if (window.confirm('Are you sure?')) {
                                                handleAcceptRequest(request)();
                                            }
                                        }}
                                    >
                                        Accept
                                    </button>

                                    <button
                                        type="button"
                                        className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                                        onClick={() => {
                                            if (window.confirm('Are you sure?')) {
                                                handleRejectRequest(request)();
                                            }
                                        }}
                                    >
                                        Reject
                                    </button>
                                </div>
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
                            if (window.confirm('This action is irreversible and you will lose access to all your projects. Are you sure you want to leave the company? ')) {
                                leaveCompany();
                            }
                        }}
                    >
                        <IoExitSharp className="w-5 h-5 mr-2" />
                        Leave Company
                    </button>

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
                </div>
            </div>
        </div>
    )
}
