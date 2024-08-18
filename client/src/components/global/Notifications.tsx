'use client'
import { IoIosNotifications } from "react-icons/io";
import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const options = [
    {
        title: 'Project Invite',
        message: 'You have been invited to join APNECK_DEMO',
        href: '#',
    },
]

export default function Notifications() {
    return null;
    return (
        <div>
            <Menu as="div" className="relative inline-block text-left flex-shrink-0 border border-black dark:border-white px-2 py-2 rounded-full text-black hover:bg-zinc-800 hover:text-white transition dark:text-slate-200 dark:hover:bg-zinc-700">
                <div>
                    <Menu.Button
                        className="text-sm flex items-center transition-all rounded-lg font-semibold"
                    >
                        <div><IoIosNotifications className="text-xl" /></div>
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
                        className={`absolute right-0 bg-white z-10 mt-6 w-96 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800`}
                    >
                        <div className="m-4">
                            <h1 className="font-bold text-xl text-black dark:text-white"> Notifications </h1>
                            <hr className="my-2" />
                            {options.map((option: any) => (
                                <Menu.Item key={option.href} as={Fragment}>
                                    {({ active }) => (
                                        <Link
                                            href={option.href}
                                            className={classNames(
                                                active ? "bg-zinc-100 dark:bg-slate-700 px-2 transition-all rounded-md text-slate-900 dark:text-slate-200" : "text-slate-700 dark:text-slate-200",
                                                "block w-full py-2 text-left text-sm"
                                            )}
                                        >
                                            <div>
                                                <h1 className="font-bold">{option.title}</h1>
                                                <p>{option.message}</p>
                                            </div>
                                        </Link>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}