'use client'
import { userStore } from '@/lib/store'
import { axios_auth } from "@/lib/axios"
import { IoTrashBin } from "react-icons/io5"
import { useRouter } from "next/navigation"

export default function AccountSettings() {
    const user = userStore(state => state.user)
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

            if (data.mobile) {
                const isValidMobile = (mobile: string) => {
                    const mobileRegex = /^[0-9]{10}$/;
                    return mobileRegex.test(mobile);
                };

                if (!isValidMobile(String(data.mobile))) {
                    throw new Error('Invalid mobile number');
                }

                body = { ...body, mobile: data.mobile };
            }

            if (data.address) {
                body = { ...body, address: data.address };
            }

            axios_auth.patch('/update-user', body);
            alert('User updated successfully')
            window.location.reload();
        } catch (error) {
            console.error(error)
            alert('Error updating user')
        }
    }

    const deleteUser = async () => {
        try {
            await axios_auth.delete('/delete-user');
            alert('User deleted successfully');
            router.push('/auth/logout');
        } catch (error) {
            console.error(error);
            alert('Error deleting user');
        }
    }

    return (
        <form className="p-4 bg-white rounded-lg dark:bg-darkblue" onSubmit={handleSubmit}>
            <div className="pb-6 border-b border-gray-900/10 dark:border-gray-500">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-200">Account Settings</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-400">Edit your information below</p>

                <hr className="my-4 border-gray-900/10 dark:border-gray-500" />

                {/* <div className="flex mt-8 items-center justify-around">
                    <div className="col-span-full flex flex-col items-center">

                        <div className="flex flex-col items-center mt-2 gap-x-3">
                            {!user?.profilePic ? (<PiUserCircleFill className="w-12 h-12 text-gray-300" aria-hidden="true" />) : (
                                <Image src={user.profilePic} alt="Profile Picture" width={150} height={150} className="rounded-full" />
                            )}
                        </div>
                        <button
                            type="button"
                            className="mt-4 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Change
                        </button>
                    </div>
                </div> */}

                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            disabled
                            defaultValue={user?.email}
                            className="block mt-2 w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder={user?.name}
                            autoComplete="name"
                            className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
                        />
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Address
                        </label>
                        <div className="mt-2">
                            <textarea
                                name="address"
                                id="address"
                                autoComplete="address"
                                placeholder={user?.address}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3 sm:col-start-1">
                        <label htmlFor="mobile" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                            Mobile
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="mobile"
                                id="mobile"
                                autoComplete="phone"
                                placeholder={user?.mobile}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center mt-4 justify-end gap-x-6">
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

            <button
                type="button"
                className="flex items-center mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account?')) {
                        deleteUser();
                    }
                }}
            >
                <IoTrashBin className="w-5 h-5 mr-2" />
                Delete Account
            </button>
        </form>
    )
}
