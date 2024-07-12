import DisclosureItem from "@/components/dashboard/Disclosure"
import React from 'react'
import Image from 'next/image'
import logo_2 from '@/assets/logo_2.svg'
import Link from 'next/link'

const disclosures = [
    {
        title: 'What is your refund policy?',
        content: "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        title: 'What is your refund policy?',
        content: "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        title: 'What is your refund policy?',
        content: "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },

];

const page = () => {
    return (
        <div className="w-full px-4">
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-7xl">
                    <div className="flex mb-8 gap-2 items-center">
                        <Link href='/'>
                            <Image src={logo_2} alt="FAQ" className="-mb-1" width={40} height={40} />
                        </Link>
                        <h2 className="text-4xl font-extrabold text-primary900 dark:text-white">Frequently asked questions</h2>
                    </div>
                    <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700">
                        <div className="rounded-2xl flex flex-col space-y-4">
                            {disclosures.map((item, index) => (
                                <DisclosureItem key={index} title={item.title} content={item.content} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default page