'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStore } from "@/lib/store";
import { axios_auth } from "@/lib/axios";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const company = userStore(state => state.company);

    useEffect(() => {
        const isAuth = async () => {
            try {
                await axios_auth.get('/');
                setIsLoading(false);
            } catch (error) {
                router.push('/auth/login');
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