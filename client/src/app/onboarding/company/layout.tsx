'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStore } from "@/lib/store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const company = userStore(state => state.company);

    useEffect(() => {
        const isAuth = async () => {
            if(company){
                router.push('/onboarding/project')
            } else {
                setIsLoading(false);
            }
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