'use client'
import { userStore } from "@/lib/store"
import Link from 'next/link'
import { MdEdit } from "react-icons/md"

export default function SecuritySettings() {
    const user = userStore((state) => state.user);

    return (
        <form>
            <div className="p-4 bg-white rounded-lg dark:bg-darkblue">
                <div className="pb-6 dark:border-gray-500">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-200">Security Settings</h2>
                    <p className="text-sm leading-6 text-gray-600 dark:text-slate-400">Secure your account below</p>

                    <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                Sign-in Email
                            </label>
                            <Link href={'/auth/change-email'} className="flex items-center gap-2 text-sm font-semibold text-primary">
                                {user?.email}
                                <MdEdit />
                            </Link>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block mb-1 text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                Password
                            </label>
                            <Link href={'/auth/password/update'} className="flex items-center gap-2 text-sm font-semibold text-primary">
                                Update Password
                                <MdEdit />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
