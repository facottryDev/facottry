'use client'
import Image from "next/image"
import logo_1_dark from '@/assets/logo_dark_1.svg'
import logo_1 from '@/assets/logo_1.svg'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { axios_admin } from "@/lib/axios"
import { useEffect } from "react"
import { userStore } from "@/lib/store"

const LoginForm = () => {
    const router = useRouter()
    const company = userStore(state => state.company)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        const { projectid } = Object.fromEntries(formData.entries())

        try {
            const res = await axios_admin.post(`/join-project`, { projectID: projectid });

            console.log(res.data);
            alert('Request sent successfully');
        } catch (error: any) {
            console.log(error.response)
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        const checkCompany = async () => {
            try {
                const res = await axios_admin.get(`/has-company`);

                if (res.data) {
                    router.push('/dashboard/home')
                }
            } catch (error: any) {
                console.log(error.response)
            }
        }

        checkCompany();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center px-6 mx-auto h-screen">
            {/* Logo */}
            <Link href='/'>
                <Image src={logo_1} alt="logo" className="dark:hidden" width={100} height={100} />
                <Image src={logo_1_dark} alt="logo" className="hidden dark:block" width={100} height={100} />
            </Link>

            {/* Login Form */}
            <div className="w-full bg-white shadow-lg border rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-darkblue dark:border-slate-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Join Project
                        <p className="text-sm text-gray-500 font-light mt-2"> If you&apos;re already part of any project, ask your manager for the project ID.</p>
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="projectid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Project ID</label>
                            <input type="text" name="projectid" id="projectid" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="project_12c5791e-110f-4fdd-874b-6fc3106778e4" />
                        </div>

                        <button type="submit" className="mb-4 w-full bg-primary bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 dark:bg-slate-400 dark:hover:bg-slate-300 transition-all text-white hover:bg-primary/80 dark:text-black">Submit</button>

                        {company?.role === 'owner' && (
                            <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                                Don&apos;t have a project? <Link href="/dashboard/project/create-project" className="font-semibold text-primary-600 hover:underline dark:text-primary-500">Click Here</Link>
                            </p>
                        )}

                        <div className="w-full flex justify-center">
                            <Link href="/dashboard/home" className="font-bold dark:text-gray-400 hover:underline text-primary600">Go Back</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default LoginForm