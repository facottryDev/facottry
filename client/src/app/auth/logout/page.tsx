'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { axios_auth } from "@/lib/axios"
import { activeFilterStore, globalStore, userStore } from "@/lib/store"
import { Loader } from "@/components/global/Loader"

const Logout = () => {
    const router = useRouter();
    const [setNotibar] = globalStore(state => [state.setNotibar]);

    useEffect(() => {
        const logout = async () => {
            try {
                await axios_auth.get('/logout');

                var global = localStorage.getItem('global');
                var theme = localStorage.getItem('theme');
                localStorage.clear();
                localStorage.setItem('global', global || '');
                localStorage.setItem('theme', theme || '');
                setNotibar(true);

                router.push('/auth/login');
            } catch (error: any) {
                console.log(error.response.data);
                router.push('/');
            }
        }

        logout();
    }, [])

    return (
        <Loader />
    )
}

export default Logout