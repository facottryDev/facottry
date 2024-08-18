'use client'
import { PieChart } from "@/components/global/PieChart"
import ThemeSwitch from "@/components/global/ToggleTheme"
import UserDropdown from "@/components/dashboard/UserDropdown"
import Sidebar from "@/components/dashboard/Sidebar"
import Filter from "@/components/dashboard/Filter"

const SubscriptionStats = {
    title: 'Subscriptions',
    value: '5,321',
    distribution: [
        { name: 'Paid', value: 40 },
        { name: 'Trial', value: 60 },
    ]
}

const UserStats = {
    title: 'Users',
    value: '1,234',
    distribution: [
        { name: 'Premium', value: 20 },
        { name: 'Pro', value: 50 },
        { name: 'Free', value: 30 },
    ]
}

const Analytics = () => {
    return (
        <div className="flex w-screen min-h-screen bg-bggray dark:bg-darkblue300">
            <Sidebar />

            {/* Dashboard Home */}
            <div className="flex flex-col w-full m-8">
                {/* Top Navbar */}
                <nav className="flex justify-between">
                    <div className="flex items-center mr-10 space-x-4">
                        <h1 className="text-2xl font-bold">Analytics</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeSwitch />
                        <UserDropdown />
                    </div>
                </nav>

                <hr className="w-full mt-4" />

                <div className="flex flex-col mt-6 items-center justify-center">
                    <Filter />
                    <div className="grid lg:grid-cols-3 gap-10 justify-around">
                        <PieChart data={SubscriptionStats} />
                        <PieChart data={SubscriptionStats} />
                        <PieChart data={SubscriptionStats} />
                        <PieChart data={UserStats} />
                        <PieChart data={UserStats} />
                        <PieChart data={UserStats} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics