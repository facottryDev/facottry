'use client'
import { useEffect, useState } from 'react'
import { axios_auth, axios_scale } from "@/lib/axios"
import ContactForm from "@/components/landing/ContactForm"
import NavBar from "@/components/landing/NavBar"
import { Hero } from "@/components/landing/Hero"
import Notibar from "@/components/global/Notibar"
import { globalStore } from "@/lib/store"

const LandingPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [setScaleData] = globalStore((state) => [state.setScaleData]);

  useEffect(() => {
    const isAuth = async () => {
      try {
        await axios_auth.get('/');
        setIsLoggedin(true);
      } catch (error: any) {
        console.log(error);
      }
    }

    const fetchData = async () => {
      try {
        const response = await axios_scale.post('get-mapping', {
          projectID: process.env.NEXT_PUBLIC_BASE_PROJECT_ID,
          filter: {
            COUNTRY: "IN",
            SUBSCRIPTION: "FREE"
          }
        });

        setScaleData(response.data.mappings.appConfig);
      } catch (error: any) {
        console.log(error);
      }
    }

    isAuth();
    fetchData();
  }, [])

  return (
    <div className="bg-white dark:bg-zinc-950">

      <div className="bg-gray-100 dark:bg-zinc-900 py-8 px-8">
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