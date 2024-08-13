import React from 'react'
import { FaUser, FaChartLine, FaCog, FaBell } from 'react-icons/fa';

type Props = {}

const Demo = (props: Props) => {
    const [toggles, setToggles] = React.useState({
        users: true,
        analytics: true,
        settings: true,
        notifications: true,
        hoverEffect: true,
        darkMode: false
    })

    return (
        <div className="mx-auto max-w-screen-xl">
            <div className="mt-10">
                <h2 className="mb-2 text-4xl font-extrabold text-center text-gray-900 dark:text-zinc-200">Demo</h2>
                <p className="mb-8 font-light text-center text-gray-500">Check out our demo</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mx-4 justify-between">
                {/* Toggle Buttons to display or hide components of demo */}
                <section className="border h-full w-full rounded-xl p-4 bg-zinc-100">

                </section>

                {/* Demo Display */}
                <section className="border h-full w-full rounded-xl p-4 bg-zinc-100">
                    <div className="border p-4 rounded-lg">
                        <div className="mb-2">
                            <h2 className="text-lg font-bold">Quick Stats</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* User Section */}
                            {toggles.users && (<div className= n'
                        {`bg-white p-4 rounded-lg shadow-md flex items-center ${toggles.darkMode ? "bg-zinc-100" : "bgz  "}`}>
                                <FaUser className="text-blue-500 text-3xl mr-4" />
                                <div>
                                    <h3 className="text-lg font-semibold">Users</h3>
                                    <p className="text-gray-600">1,234</p>
                                </div>
                            </div>)}

                            {/* Analytics Section */}
                            {toggles.analytics && (
                                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                                    <FaChartLine className="text-green-500 text-3xl mr-4" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Analytics</h3>
                                        <p className="text-gray-600">567</p>
                                    </div>
                                </div>
                            )}

                            {/* Settings Section */}
                            {toggles.settings && (
                                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                                    <FaCog className="text-yellow-500 text-3xl mr-4" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Settings</h3>
                                        <p className="text-gray-600">12</p>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {toggles.notifications && (
                                <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                                    <FaBell className="text-red-500 text-3xl mr-4" />
                                    <div>
                                        <h3 className="text-lg font-semibold">Notifications</h3>
                                        <p className="text-gray-600">34</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Demo