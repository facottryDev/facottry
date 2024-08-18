import ThemeSwitch from "@/components/global/ToggleTheme";
import UserDropdown from "@/components/dashboard/UserDropdown";
import PricingCard from "@/components/dashboard/PricingCard";
import Sidebar from "@/components/dashboard/Sidebar";
import React from 'react';
import { FiEdit3 } from "react-icons/fi"

const Free = {
    title: 'Free',
    description: 'Best option for personal use & for your next project.',
    price: '$0',
    features: [
      'Individual configuration',
      'No setup, or hidden fees',
      'Team size: 1 developer',
      'Standard support: 3 months',
      'Free updates: 6 months',
    ],
    buttonText: 'Get started',
  };

const Basic = {
    title: 'Basic',
    description: 'Relevant for individuals and small teams.',
    price: '$49',
    features: [
        'Individual configuration',
        'No setup, or hidden fees',
        'Team size: 5 developers',
        'Standard support: 6 months',
        'Free updates: 12 months',
    ],
    buttonText: 'Buy now',
};

const Pro = {
    title: 'Pro',
    description: 'For growing businesses and advanced teams.',
    price: '$99',
    features: [
        'Individual configuration',
        'No setup, or hidden fees',
        'Team size: 20 developers',
        'Premium support: 12 months',
        'Free updates: 24 months',
        'Advanced analytics',
    ],
    buttonText: 'Buy now',
};

const Pricing = () => {
    return (
        <section className="flex min-h-screen bg-bggray dark:bg-darkblue300">
            <Sidebar />
            <div className="py-8 px-8 mx-auto ">
                <nav className="flex justify-between">
                    <div className="flex items-center mr-10 space-x-4">
                        <h1 className="text-2xl font-bold">Pricing Models</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeSwitch />
                        <UserDropdown />
                    </div>
                </nav>

                <hr className="w-full mt-4" />

                <div className="mx-auto max-w-screen-md text-center my-6">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for business teams like yours</h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">Find the plan that suits your needs.</p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    <PricingCard {...Free} />
                    <PricingCard {...Basic} />
                    <PricingCard {...Pro} />
                </div>
            </div>
        </section>
    );
};

export default Pricing;