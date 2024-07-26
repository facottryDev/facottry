'use client';
import { axios_admin } from "@/lib/axios";
import React from 'react'
import { toast } from "react-toastify";

const ContactForm = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            email: e.currentTarget.email.value,
            subject: e.currentTarget.subject.value,
            message: e.currentTarget.message.value
        }

        // message length validation
        if (data.message.length < 10) {
            toast.error('Message too short');
            return;
        }

        try {
            const result = await axios_admin.post('/update-contact', data);
            console.log(result);
        } catch (error: any) {
            console.log(error.message);
        }

    }

    return (
        <div className="mx-auto max-w-screen-md">
            <h2 className="mb-2 text-4xl font-extrabold text-center text-gray-900 dark:text-zinc-200">Contact Us</h2>
            <p className="mb-8 font-light text-center text-gray-500">Got a technical issue or Need details about our Business plan? Let us know.</p>
            <form onSubmit={handleSubmit} className="space-y-8 bg-bgblue200 dark:bg-zinc-800 p-10 rounded-xl">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-zinc-200">Your email</label>
                    <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 dark:bg-zinc-300 focus:border-primary-500 block w-full p-2.5 dark:placeholder:text-zinc-600" placeholder="example@gmail.com" required />
                </div>
                <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-zinc-200">Subject</label>
                    <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-zinc-300 dark:placeholder:text-zinc-600" placeholder="What is this related to?" required />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-zinc-200">Your message</label>
                    <textarea id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 dark:bg-zinc-300 focus:border-primary-500 dark:placeholder:text-zinc-600" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="py-3 px-5 bg-primary600 text-sm font-medium dark:bg-black dark:hover:bg-zinc-900 text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary300 dark:focus:ring-zinc-300 hover:bg-primary700 transition-all">Send message</button>
            </form>
        </div>
    )
}

export default ContactForm
