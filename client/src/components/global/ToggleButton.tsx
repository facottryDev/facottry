'use client'
import React, { useState } from 'react'
import { Switch } from '@headlessui/react'

export const ToggleButton = () => {
    const [enabled, setEnabled] = useState(false);

    return (
        <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`bg-slate-800 dark:bg-slate-200 relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 scale-75`}
        >
            <span className="sr-only">Theme Switch</span>
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white dark:bg-slate-800 shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
        </Switch>
    )
}