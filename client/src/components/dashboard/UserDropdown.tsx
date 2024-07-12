'use client'
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { userStore } from "@/lib/store";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const options = [
    { href: '/dashboard/settings', label: 'Profile' },
    { href: '/dashboard/settings/user', label: 'Settings' },
    { href: '/auth/logout', label: 'Logout' }
]

const UserDropdown = () => {
    const user = userStore(state => state.user);

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    className="flex items-center gap-2 text-sm transition-all rounded-lg font-semibold"
                >
                    {user?.name || user?.email}
                    <BsChevronDown />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={`absolute right-0 bg-white z-10 mt-6 w-44 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-darkblue`}
                >
                    {options.map((option: any) => (
                        <Menu.Item key={option.href} as={Fragment}>
                            {({ active }) => (
                                <Link
                                    href={option.href}
                                    className={classNames(
                                        active ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200" : "text-slate-700 dark:text-slate-200",
                                        "block w-full px-4 py-2 text-left text-sm"
                                    )}
                                >
                                    {option.label}
                                </Link>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default UserDropdown;
