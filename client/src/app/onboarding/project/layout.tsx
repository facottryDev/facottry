'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStore } from "@/lib/store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const projects = userStore(state => state.projects);
    const company = userStore(state => state.company);

    useEffect(() => {
        const isAuth = async () => {
            if(!company){
                return router.push('/onboarding/company/join-company')
            }

            if(projects.length > 0){
                return router.push('/dashboard/home')
            }
            
            setIsLoading(false);
        }

        isAuth();
    }, [])

    if (isLoading) {
        return <div> Loading... </div>
    } else {
        return (
            <main>{children}</main>
        )
    }
}