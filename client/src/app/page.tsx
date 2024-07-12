'use client'
import { useEffect, useState } from 'react'
import { axios_auth } from "@/lib/axios"
import ContactForm from "@/components/landing/ContactForm"
import NavBar from "@/components/landing/NavBar"
import { Hero } from "@/components/landing/Hero"

const LandingPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    const isAuth = async () => {
      try {
        await axios_auth.get('/');
        setIsLoggedin(true);
      } catch (error: any) {
        console.log(error);
      }
    }

    isAuth();
  }, [])

  return (
    <div className="bg-white dark:bg-darkblue300">
      <div className="bg-bgblue dark:bg-darkblue py-8 px-8">
        <NavBar isLoggedin={isLoggedin} />

        <section id="about">
          <Hero isLoggedin={isLoggedin} />
        </section>
      </div>

      <section id="contact" className="mt-10 py-8 px-8">
        <ContactForm />
      </section>
    </div>
  )
}

export default LandingPage