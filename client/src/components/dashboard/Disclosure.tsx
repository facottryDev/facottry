'use client'
import { Disclosure, Transition } from '@headlessui/react';
import { BsChevronDown } from 'react-icons/bs';

type Props = {
    title: string;
    content: string;
}

export default function DisclosureItem({ title, content }: Props) {
    return (
        <div className="w-full rounded-2xl">
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-bgblue200 px-4 py-2 text-left text-sm font-medium text-darkblue300 hover:bg-primary200  focus:outline-none transition-all focus-visible:ring focus-visible:ring-primary300 focus-visible:ring-opacity-75 items-center">
                            <span>{title}</span>
                            <BsChevronDown
                                className={`${open ? 'rotate-180 transform' : ''
                                    } h-4 transition-all w-5 text-primary800`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                {content}
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    )
}
