'use client'
import Image from "next/image"
import React, { useEffect, useState } from 'react'
import logo_1_dark from '@/assets/logo_dark_1.svg'
import logo_1 from '@/assets/logo_1.svg'
import GoogleIcon from '@/assets/Google.svg'
import Link from "next/link"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { axios_auth } from "@/lib/axios"
import { toast } from "react-toastify"
import { globalStore, userStore } from "@/lib/store"

const LoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const rawQueryString = typeof window !== 'undefined' ? window.location.search : '';

    useEffect(() => {
        const isAuth = async () => {
            try {
                await axios_auth.get('/');
                router.push('/');
            } catch (error: any) {
                console.log(error);
            }
        }

        isAuth();
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios_auth.post('/login', {
                email: e.currentTarget.email.value,
                password: e.currentTarget.password.value,
                remember_me: e.currentTarget.remember_me.checked
            });
            setIsLoading(false);

            return router.push('/dashboard/home' + rawQueryString);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center px-6 mx-auto h-screen ">
            {/* Logo */}
            <Link href='/'>
                <Image src={logo_1} alt="logo" className="dark:hidden" width={100} height={100} />
                <Image src={logo_1_dark} alt="logo" className="hidden dark:block" width={100} height={100} />
            </Link>

            {/* Login Form */}
            <div className="w-full bg-white shadow-lg border rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-darkblue dark:border-slate-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Login
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@gmail.com" />
                        </div>

                        <div className="relative mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type={isPasswordVisible ? "text" : "password"} name="password" id="password" placeholder="Enter Password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                            <div onClick={() => {
                                setIsPasswordVisible((prevState) => !prevState);
                            }} className="cursor-pointer absolute right-3 bottom-2 text-slate-400 dark:text-slate-400">
                                {isPasswordVisible ? (
                                    <AiOutlineEyeInvisible fontSize='1.4rem' />
                                ) : (
                                    <AiOutlineEye fontSize='1.4rem' />
                                )}
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center mb-4">
                            <input defaultChecked type="checkbox" id="remember_me" name="remember_me" className="text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-600 dark:focus:ring-primary-600 rounded" />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-white">Remember me</label>
                        </div>

                        <button type="submit" className="mb-4 w-full bg-primary bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 dark:bg-slate-400 dark:hover:bg-slate-300 transition-all text-white hover:bg-primary/80 dark:text-black">Sign in</button>

                        <Link href={process.env.NEXT_PUBLIC_AUTH_BASE_URL + '/google'} type="button" className="flex items-center justify-center mb-4 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-slate-700 dark:focus:ring-primary-800 border dark:border-slate-400 transition-all hover:bg-slate-100 dark:text-slate-300">
                            <Image src={GoogleIcon} alt="google icon" width={20} height={20} className="inline-block mr-2" />
                            <p className="text-black dark:text-slate-300">Continue with Google</p>
                        </Link>

                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            Forgot Password? <Link href="/auth/forgot-password" className="font-semibold text-primary-600 hover:underline dark:text-primary-500">Reset</Link>
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <Link href="/auth/signup" className="font-semibold text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Loader Icon */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-20">
                    <div className="flex items-center justify-center  dark:bg-gray-800 p-8 w-72 h-72">
                        <svg className="animate-spin h-14 w-14 text-primary-600 dark:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    </div>
                </div>
            )}
        </div>

    )
}

export default LoginForm