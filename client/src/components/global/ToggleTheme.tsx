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
    <button className="border border-gray-800 dark:border-gray-300 dark:bg-transparent p-2 rounded-full hover:bg-gray-800 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:bg-zinc-800 transition-all" onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark') }} >
      {theme === 'dark' ? (
        <BsFillSunFill className="text-xl " />
      ) : (
        <BsFillMoonFill className="text-xl " />
      )}
    </button>
  )
}