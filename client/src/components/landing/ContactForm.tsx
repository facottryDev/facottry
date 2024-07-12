import React from 'react'

const ContactForm = () => {
    return (
        <div className="mx-auto max-w-screen-md">
            <h2 className="mb-2 text-4xl font-extrabold text-center text-gray-900 dark:text-slate-200">Contact Us</h2>
            <p className="mb-8 font-light text-center text-gray-500">Got a technical issue or Need details about our Business plan? Let us know.</p>
            <form className="space-y-8 bg-bgblue200 dark:bg-darkblue p-10 rounded-xl">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200">Your email</label>
                    <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 dark:bg-slate-300 focus:border-primary-500 block w-full p-2.5 dark:placeholder:text-slate-600" placeholder="example@gmail.com" required />
                </div>
                <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200">Subject</label>
                    <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-300 dark:placeholder:text-slate-600" placeholder="What is this related to?" required />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-slate-200">Your message</label>
                    <textarea id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 dark:bg-slate-300 focus:border-primary-500 dark:placeholder:text-slate-600" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="py-3 px-5 bg-primary text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:bg-primary/80 transition-all">Send message</button>
            </form>
        </div>
    )
}

export default ContactForm
