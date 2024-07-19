'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { axios_auth } from "@/lib/axios"
import { activeFilterStore, globalStore, userStore } from "@/lib/store"
import { Loader } from "@/components/global/Loader"

const Logout = () => {
    const router = useRouter();
    const [setCompany, setProjects, setActiveProject, setUser] = userStore(state => [state.setCompany, state.setProjects, state.setActiveProject, state.setUser]);
    const [setActiveFilter, setScaleFilter] = activeFilterStore(state => [state.setActiveFilter, state.setScaleFilter]);
    const [setNotibar] = globalStore(state => [state.setNotibar]);

    useEffect(() => {
        const logout = async () => {
            try {
                await axios_auth.get('/logout');

                setProjects([]);
                setActiveProject(null);
                setUser(null);
                setCompany(null);
                setActiveFilter({});
                setScaleFilter({});
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