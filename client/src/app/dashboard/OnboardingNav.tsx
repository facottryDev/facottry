'use client'
import React from 'react'
import ThemeSwitch from "@/components/global/ToggleTheme"
import UserDropdown from "@/components/dashboard/UserDropdown"
import { GiHamburgerMenu } from "react-icons/gi";
import { userStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import logo_2 from '@/assets/logo_2.svg'
import logo_dark_2 from '@/assets/logo_dark_2.svg'
import Notifications from "@/components/global/Notifications";


const OnboardingNav = () => {
    return (
        <nav className="absolute w-full top-6">
            <div className="flex justify-between px-6">
                <Link href='/' className="flex gap-2 items-center">
                    <Image
                        src={logo_2}
                        alt="FacOTTry"
                        width={50}
                        height={50}
                        className="dark:hidden"
                    />
                    <Image
                        src={logo_dark_2}
                        alt="FacOTTry"
                        width={50}
                        height={50}
                        className="hidden dark:block"
                    />
                    <p className="hidden sm:block font-extrabold text-2xl dark:text-slate-200 text-black">
                        Fac<span className="text-primary dark:text-primary600">OTT</span>ry
                    </p>
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                    <ThemeSwitch />
                    <Notifications />
                    <UserDropdown />
                </div>
            </div>
        </nav>
    )
}

export default OnboardingNav