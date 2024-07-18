'use client'
import Image from "next/image"
import logo_2 from '@/assets/logo_2.svg'
import logo_dark_2 from '@/assets/logo_dark_2.svg'
import Link from "next/link"
import ToggleSwitch from "../global/ToggleTheme"
import { usePathname } from 'next/navigation'
import Button from "../global/ButtonGradient"

const NavBar = ({ isLoggedin }: { isLoggedin: boolean; }) => {
    const pathname = usePathname();

    return (
        <nav>
            {/* Desktop Navbar */}
            <div className="flex justify-between max-w-7xl items-center m-auto">
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
                    <p className="font-extrabold text-2xl dark:text-slate-200 text-black">
                        Fac<span className="text-primary">OTT</span>ry
                    </p>
                </Link>
                {pathname === '/' ? (
                    <div className="space-x-4 hidden text-black lg:flex font-semibold dark:text-slate-200">
                        <Link href={'#about'} className="hover:text-primary transition-all">About</Link>
                        <Link href={'#demo'} className="hover:text-primary transition-all">Demo</Link>
                        <Link href={'#videos'} className="hover:text-primary transition-all">Videos</Link>
                        <Link href={'#testimonial'} className="hover:text-primary transition-all">Testimonial</Link>
                        <Link href={'#pricing'} className="hover:text-primary transition-all">Pricing</Link>
                        <Link href={'#contact'} className="hover:text-primary transition-all">Contact</Link>
                    </div>
                ) : null}
                <div className="flex space-x-8 items-center">
                    <ToggleSwitch />

                    {isLoggedin ? (
                        <div className="flex gap-4">
                            <Link href='/dashboard/home' className="relative inline-flex items-center justify-center p-4 px-8 py-3 overflow-hidden font-medium text-cyan-600 rounded-full shadow-2xl group">
                                <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-500 bg-primary rounded-full blur-md ease"></span>
                                <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-90 ease">
                                    <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-sky-500 rounded-full blur-md"></span>
                                    <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-primary rounded-full blur-md"></span>
                                </span>
                                <span className="relative text-white">Dashboard</span>
                            </Link>

                            <Link href='auth/logout' className="flex-shrink-0 flex border border-slate-700 px-8 py-2 rounded-full hover:bg-black text-black hover:text-white transition items-center dark:text-slate-200 dark:hover:bg-slate-700">
                                Sign Out
                            </Link>
                        </div>
                    ) : (
                        <Link href='/auth/login' className="flex-shrink-0 border border-black px-10 py-2 rounded-full text-black hover:bg-black hover:text-white transition dark:text-slate-200 dark:hover:bg-slate-700">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar