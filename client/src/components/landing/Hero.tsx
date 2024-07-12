import React from 'react'
import hero_illustration from '@/assets/hero_illustration.svg'
import Image from 'next/image'
import Button from "../global/ButtonGradient"

export const Hero = ({ isLoggedin }: { isLoggedin: boolean }) => {


  return (
    <div id="hero" className="flex flex-col-reverse items-center justify-between h-full max-w-7xl mx-10 sm:flex-row sm:mt-14 xl:mx-auto">
      <div className="sm:w-[40%] lg:w-[35%] space-y-4 mt-10 sm:mt-0">
        {/* Text */}
        <h1 className="text-5xl dark:text-white text-black font-bold font-lexend xl:text-6xl">
          <p>OTT Factory,<span className=""> For All Your Needs</span></p>

        </h1>
        <p className="text-body dark:text-slate-300 font-light text-slate-500">
          A simple, customizable, and, beautiful SaaS business focused landing page to make your project closer to launch!
        </p>

        {/* Button */}
        {isLoggedin ? (<Button label="Documentation" link="/docs" />) : (<Button label="Sign Up" link="/auth/signup" />)}
      </div>

      {/* Hero Image */}
      <Image
        src={hero_illustration}
        alt="logo"
        title="Hero Image"
        priority={true}
        className="w-[45vh] sm:w-[45%] mt-5 sm:mt-0"
      />
    </div>
  )
}
