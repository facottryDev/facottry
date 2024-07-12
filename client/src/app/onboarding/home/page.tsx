'use client'
import Image from "next/image"
import logo_1_dark from '@/assets/logo_dark_1.svg'
import logo_1 from '@/assets/logo_1.svg'
import Link from "next/link"
import { userStore } from "@/lib/store"
import { PiUserCircleFill } from "react-icons/pi"
import { axios_auth } from "@/lib/axios"

const LoginForm = () => {
  const user = userStore(state => state.user);
  const company = userStore(state => state.company);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      let body = {};

      if (data.name) {
        const isValidName = (name: string) => {
          const nameRegex = /^[a-zA-Z\s]+$/;
          return nameRegex.test(name);
        };

        if (!isValidName(String(data.name))) {
          throw new Error('Invalid name');
        }

        body = { ...body, name: data.name };
      }

      if (data.mobile) {
        const isValidMobile = (mobile: string) => {
          const mobileRegex = /^[0-9]{10}$/;
          return mobileRegex.test(mobile);
        };

        if (!isValidMobile(String(data.mobile))) {
          throw new Error('Invalid mobile number');
        }

        body = { ...body, mobile: data.mobile };
      }

      if (data.address) {
        body = { ...body, address: data.address };
      }

      const result = await axios_auth.patch('/update-user', body);
      alert('Updated successfully')
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 mx-auto mt-5 mb-10">
      {/* Logo */}
      <Link href='/'>
        <Image src={logo_1} alt="logo" className="dark:hidden" width={100} height={100} />
        <Image src={logo_1_dark} alt="logo" className="hidden dark:block" width={100} height={100} />
      </Link>

      {/* Login Form */}
      <div className="w-full bg-white shadow-lg border rounded-lg dark:border mt-2 sm:max-w-lg xl:p-0 dark:bg-darkblue dark:border-slate-700">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Welcome to FacOTTry!
            <p className="text-sm text-gray-500 font-light mt-2"> Tell us about yourself.</p>
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex mt-5 items-center justify-around">
              <div className="col-span-full flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 gap-x-3 hover:brightness-75 transition-all cursor-pointer">
                  {!user?.profilePic ? (<PiUserCircleFill className="w-12 h-12 text-gray-300" aria-hidden="true" />) : (
                    <Image src={user.profilePic} alt="Profile Picture" width={150} height={150} className="rounded-full" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  disabled
                  placeholder={user?.email}
                  className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder={user?.name}
                  autoComplete="name"
                  className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:placeholder:text-slate-200"
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                  Address
                </label>
                <div className="mt-2">
                  <textarea
                    name="address"
                    id="address"
                    autoComplete="address"
                    placeholder={user?.address}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3 sm:col-start-1">
                <label htmlFor="mobile" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                  Mobile
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    autoComplete="phone"
                    placeholder={user?.mobile}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-2 focus:ring-inset sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="mt-6 w-full bg-primary bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 dark:bg-slate-400 dark:hover:bg-slate-300 transition-all text-white hover:bg-primary/80 dark:text-black">Save Changes</button>

            <div className="w-full flex justify-center -mb-2 mt-4">
              <Link href={company ? "/onboarding/project" : "/onboarding/company"} className="font-semibold dark:text-gray-400 hover:underline text-primary600">Next Step</Link>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default LoginForm