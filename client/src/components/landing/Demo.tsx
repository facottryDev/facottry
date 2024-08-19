import React from 'react'
import { FaUser, FaChartLine, FaCog, FaBell } from 'react-icons/fa';
import { useAutoAnimate } from '@formkit/auto-animate/react'

type TogglesType = {
    users: boolean,
    analytics: boolean,
    settings: boolean,
    notifications: boolean,
    darkMode: boolean
}

type Props = {}

const Demo = (props: Props) => {
    const [toggles, setToggles] = React.useState<TogglesType>({
        users: true,
        analytics: true,
        settings: true,
        notifications: true,
        darkMode: false,
    })

    const [animationParent] = useAutoAnimate()

    return (
        <div className="mx-auto max-w-screen-xl">
            <div className="mt-10">
                <h2 className="mb-2 text-4xl font-extrabold text-center text-gray-900 dark:text-zinc-200">See it in action!</h2>
                <p className="ont-light text-center text-gray-500">Try out the demo...</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 mx-4 justify-between ">
                <section className="border dark:border-zinc-600 dark:bg-zinc-900 h-full w-full rounded-xl p-4 bg-zinc-100">
                    <div>
                        <div className="mb-2">
                            <h2 className="text-lg font-bold">Flags</h2>
                        </div>
                        <hr className="mb-4 border-gray-300" />
                    </div>
                    <div>
                        {Object.keys(toggles).map((key) => (
                            <div key={key} className="flex items-center justify-between mb-4">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox"
                                        onChange={() => setToggles({
                                            ...toggles,
                                            [key]: !toggles[key as keyof TogglesType]
                                        })}
                                        checked={toggles[key as keyof TogglesType]}
                                        className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 capitalize">{key}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Demo Display */}
                <section className="border dark:border-zinc-600 dark:bg-zinc-900 h-full w-full rounded-xl p-4 bg-zinc-100">
                    <div>
                        <div className="mb-2">
                            <h2 className="text-lg font-bold">Components</h2>
                        </div>
                        <hr className="mb-4 border-gray-300" />
                    </div>
                    <div ref={animationParent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Section */}
                        {toggles.users && (
                            <div className={`p-4 border cursor-pointer  transition-all rounded-lg shadow-md flex items-center ${toggles.darkMode ? "bg-zinc-800 hover:bg-zinc-700 text-white dark:border-zinc-600" : "bg-zinc-100 text-gray-900  hover:bg-primary200"}`}>
                                <FaUser className={`text-3xl mr-4 ${toggles.darkMode ? "text-blue-300 " : "text-blue-500"}`} />
                                <div>
                                    <h3 className="text-lg font-semibold">Users</h3>
                                    <p className={`${toggles.darkMode ? "text-gray-300" : "text-gray-500"}`}>1,234</p>
                                </div>
                            </div>
                        )}

                        {/* Analytics Section */}
                        {toggles.analytics && (
                            <div className={`p-4 border cursor-pointer rounded-lg shadow-md flex items-center ${toggles.darkMode ? "bg-zinc-800 hover:bg-zinc-700 text-white dark:border-zinc-600" : "bg-zinc-100 hover:bg-primary200 text-gray-900"}`}>
                                <FaChartLine className={`text-3xl mr-4 ${toggles.darkMode ? "text-green-300" : "text-green-500"}`} />
                                <div>
                                    <h3 className="text-lg font-semibold">Analytics</h3>
                                    <p className={`${toggles.darkMode ? "text-gray-300" : "text-gray-500"}`}>567</p>
                                </div>
                            </div>
                        )}

                        {/* Settings Section */}
                        {toggles.settings && (
                            <div className={`p-4 border cursor-pointer rounded-lg shadow-md flex items-center ${toggles.darkMode ? "bg-zinc-800 hover:bg-zinc-700 text-white dark:border-zinc-600" : "bg-zinc-100 hover:bg-primary200 text-gray-900"}`}>
                                <FaCog className={`text-3xl mr-4 ${toggles.darkMode ? "text-yellow-300" : "text-yellow-500"}`} />
                                <div>
                                    <h3 className="text-lg font-semibold">Settings</h3>
                                    <p className={`${toggles.darkMode ? "text-gray-300" : "text-gray-500"}`}>12</p>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {toggles.notifications && (
                            <div className={`p-4 border cursor-pointer rounded-lg shadow-md flex items-center ${toggles.darkMode ? "bg-zinc-800 hover:bg-zinc-700 text-white dark:border-zinc-600" : "bg-zinc-100 hover:bg-primary200 text-gray-900"}`}>
                                <FaBell className={`text-3xl mr-4 ${toggles.darkMode ? "text-red-300" : "text-red-500"}`} />
                                <div>
                                    <h3 className="text-lg font-semibold">Notifications</h3>
                                    <p className={`${toggles.darkMode ? "text-gray-300" : "text-gray-500"}`}>34</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section >
            </div >
        </div >
    )
}

export default Demo