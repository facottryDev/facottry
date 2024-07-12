'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs'

export default function ToggleSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="">
      <button className="bg-slate-200 dark:bg-slate-600 p-2 rounded-xl hover:bg-slate-300 transition-all" onClick={()=>{setTheme(theme === 'dark' ? 'light' : 'dark')}} >
        {theme === 'dark' ? (
          <BsFillSunFill className="text-2xl dark:text-slate-200 text-slate-800" />
        ) : (
          <BsFillMoonFill className="text-2xl dark:text-slate-200 text-slate-800" />
        )}
      </button>
    </div>
  )
}