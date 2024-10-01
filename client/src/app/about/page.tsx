'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import logo_2 from '@/assets/logo_2.svg'
import logo_2_dark from '@/assets/logo_dark_2.svg'
import Link from 'next/link'
import Markdown from 'react-markdown'
import { globalStore } from "@/lib/store"

const AboutPage = () => {
    const [data, setData] = React.useState<string>();
    const [scaleData] = globalStore((state) => [state.scaleData]);

    useEffect(() => {
        setData(scaleData?.about);
    }, [scaleData])

    return (
        <div className="w-screen">
            <section className="bg-white dark:bg-zinc-900">
                <div className="py-8 px-4">
                    <div className="flex mb-8 gap-2 items-center">
                        <Link href='/' className="flex items-center gap-2">
                            <Image src={logo_2} alt="FAQ" className="-mb-1 dark:hidden" width={50} height={50} />
                            <Image src={logo_2_dark} alt="FAQ" className="-mb-1 dark:block hidden" width={50} height={50} />

                            <h2 className="text-4xl font-extrabold text-primary900 dark:text-white">About Us</h2>
                        </Link>
                    </div>

                    <div className="mx-auto prose dark:prose-invert max-w-screen-2xl lg:prose-xl">
                        <Markdown>{data}</Markdown>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutPage