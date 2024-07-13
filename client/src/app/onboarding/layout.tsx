'use client'
import { axios_auth, axios_admin } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStore } from "@/lib/store";
import { Loader } from "@/components/global/Loader";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const setUser = userStore(state => state.setUser);
    const setCompany = userStore(state => state.setCompany);
    const setProjects = userStore(state => state.setProjects);

    useEffect(() => {
        const isAuth = async () => {
            try {
                const { data } = await axios_auth.get('/get-user');
                setUser(data);

                try {
                    await axios_admin.get('/get-admin');
                    return router.push("/dashboard/home");
                } catch (error: any) {
                    if (error.response.data.code === "NO_PROJECT") {
                        setProjects([]);
                        setCompany(error.response.data.company);
                        router.push("/onboarding/project");
                    }
                }

                setIsLoading(false);
            } catch (error: any) {
                console.log(error.response.data);
                router.push("/");
            }
        }

        isAuth();
    }, [])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <main>{children}</main>
        )
    }
}