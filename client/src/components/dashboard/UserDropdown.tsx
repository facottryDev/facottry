'use client'
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { userStore } from "@/lib/store";
import { AiOutlineUser } from "react-icons/ai";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const options = [
    { href: '/', label: 'Home' },
    { href: '/dashboard/settings/user', label: 'Profile' },
    { href: '/auth/logout', label: 'Logout' }
]

const UserDropdown = () => {
    const user = userStore(state => state.user);

    return (
        <Menu as="div" className="relative inline-block text-left flex-shrink-0 border border-black dark:border-white md:px-4 px-2 py-2 rounded-full text-black hover:bg-gray-800 hover:text-white transition dark:text-slate-200 dark:hover:bg-slate-700">
            <div>
                <Menu.Button
                    className="text-sm flex items-center transition-all rounded-lg font-semibold"
                >
                    <div className="hidden sm:flex items-center gap-2 ">
                        {user?.name || user?.email}
                        <BsChevronDown />
                    </div>

                    <div className="sm:hidden">
                        <AiOutlineUser fontSize={"1.2rem"} />
                    </div>
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
                                        active ? "bg-zinc-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200" : "text-slate-700 dark:text-slate-200",
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
