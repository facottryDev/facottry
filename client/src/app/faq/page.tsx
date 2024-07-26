'use client'
import DisclosureItem from "@/components/dashboard/Disclosure"
import React, { useEffect } from 'react'
import Image from 'next/image'
import logo_2 from '@/assets/logo_2.svg'
import Link from 'next/link'
import { axios_scale } from "@/lib/axios"

type FAQ = {
    title: string;
    content: string;
}

const FAQPage = () => {
    const [data, setData] = React.useState<FAQ[]>([]);

    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                const response = await axios_scale.post('get-mapping', {
                    projectID: process.env.NEXT_PUBLIC_BASE_PROJECT_ID,
                    filter: {
                        COUNTRY: "IN",
                        SUBSCRIPTION: "FREE"
                    }
                });

                setData(response.data.mappings.appConfig.faq);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFAQ();
    }, []);

    return (
        <div className="w-screen px-4">
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4">
                    <div className="flex mb-8 gap-2 items-center">
                        <Link href='/' className="flex items-center gap-2">
                            <Image src={logo_2} alt="FAQ" className="-mb-1" width={50} height={50} />

                            <h2 className="text-4xl font-extrabold text-primary900 dark:text-white">Frequently asked questions (FAQ)</h2>
                        </Link>
                    </div>
                    <div className="pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700">
                        <div className="rounded-xl flex flex-col space-y-4">
                            {data && data.map((item, index) => (
                                <div key={index}>
                                    <DisclosureItem title={item.title} content={item.content} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FAQPage