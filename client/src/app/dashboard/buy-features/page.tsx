'use client'
import ToggleSwitch from "@/components/global/ToggleTheme";
import UserDropdown from "@/components/dashboard/UserDropdown";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react"
import { MdShoppingCartCheckout } from "react-icons/md"

type Feature = {
    id: number;
    name: string;
    description: string;
    price: number;
}

const features = [
    {
        id: 1,
        name: "Theme 001",
        description: "Good for small applications",
        price: 9
    },
    {
        id: 2,
        name: "Theme 002",
        description: "Good for medium applications",
        price: 19
    },
    {
        id: 3,
        name: "Theme 003",
        description: "Good for large applications",
        price: 29
    },
    {
        id: 4,
        name: "Theme 004",
        description: "Good for very large applications",
        price: 39
    },
    {
        id: 5,
        name: "Theme 005",
        description: "Good for extra large applications",
        price: 49
    },
]

const calculateTotal = (selected: Feature[]) => {
    let total = 0;
    selected.forEach(item => {
        total += item.price;
    })
    return total;
}

const calculateDiscount = (total: number) => {
    return total * 0.1;
}

const BuyFeatures = () => {
    const [selected, setSelected] = useState<Feature[]>([]);

    // Track Selected Features
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, feature: Feature) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelected([...selected, feature]);
        } else {
            setSelected(selected.filter(item => item !== feature));
        }
    };

    // Declare Variables
    let total = calculateTotal(selected);
    let discount = Math.round(calculateDiscount(total));
    let tax = Math.round(total * 0.18);
    let grandTotal = total - discount + tax;

    return (
        <div className="flex w-screen min-h-screen bg-bggray dark:bg-darkblue300">
            <Sidebar />

            {/* Dashboard Home */}
            <div className="flex flex-col w-full m-8">

                {/* Top Navbar */}
                <nav className="flex justify-between">
                    <h1 className="text-2xl font-bold">Buy Features</h1>

                    <div className="flex items-center gap-6">
                        <ToggleSwitch />
                        <UserDropdown />
                    </div>
                </nav>

                <hr className="w-full mt-4" />

                <div className="flex justify-between mt-8 space-x-8">
                    <div className="w-full h-fit min-h-[80vh] p-8 bg-white rounded-lg flex justify-between dark:bg-darkblue gap-8">

                        {/* Select Features Panel */}
                        <div className="dark:bg-darkblue300 w-full p-6 bg-white border rounded-lg shadow-md h-fit dark:border-slate-600">
                            <h1 className="text-2xl font-bold">Select Features</h1>

                            <ul className="w-full mt-4 space-y-4">
                                {features.map((feature, index) => (
                                    <li key={index}>
                                        <input onChange={(e) => handleCheckboxChange(e, feature)} type="checkbox" id={feature.name} name="hosting" value="hosting-small" className="hidden peer" required />
                                        <label htmlFor={feature.name} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                                            <div className="block">
                                                <div className="w-full text-lg font-semibold">{feature.name}</div>
                                                <div className="w-full">{feature.description}</div>
                                            </div>

                                            <p>${feature.price}</p>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Calculation Panel */}
                        <div className="p-8 dark:bg-darkblue300 dark:text-gray-200 bg-white border rounded-lg shadow-md h-fit dark:border-slate-600">
                            <h1 className="mb-4 text-xl font-bold">Billing Summary</h1>

                            <div className="flex flex-col space-y-2 text-slate-500">
                                <div className="flex justify-between">
                                    <p>Subtotal</p>
                                    <p>${total}</p>
                                </div>
                                <div className="flex justify-between gap-36">
                                    <p>Discount</p>
                                    <p>${discount}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Tax</p>
                                    <p>${tax}</p>
                                </div>
                            </div>

                            <hr className="w-full my-2" />

                            <div className="flex justify-between font-bold">
                                <p>Grand Total</p>
                                <p>${grandTotal}</p>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="comment" className="text-sm text-slate-500">Order Comment</label>
                                <textarea id="comment" className="dark:bg-gray-800 w-full h-24 p-2 mt-2 border rounded-lg dark:border-slate-600" placeholder="Enter your comment here"></textarea>
                            </div>

                            <button type="submit" className="flex items-center justify-center w-full gap-2 p-2 mt-4 font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary400">
                                <MdShoppingCartCheckout />
                                <p>Checkout</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyFeatures