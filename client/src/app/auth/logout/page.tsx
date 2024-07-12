'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { axios_auth } from "@/lib/axios"
import { activeFilterStore, userStore } from "@/lib/store"
import { Loader } from "@/components/global/Loader"

const Logout = () => {
    const router = useRouter();
    const setActiveFilter = activeFilterStore(state => state.setActiveFilter);
    const setUser = userStore(state => state.setUser);
    const setCompany = userStore(state => state.setCompany);
    const setProjects = userStore(state => state.setProjects);
    const setActiveProject = userStore(state => state.setActiveProject);

    useEffect(() => {
        const logout = async () => {
            try {
                await axios_auth.get('/logout');

                setProjects([]);
                setActiveProject(null);
                setUser(null);
                setCompany(null);
                setActiveFilter({});

                //clear local storage
                localStorage.removeItem('selectedDashboardTab');
                localStorage.removeItem('selectedSettingTab');
                localStorage.removeItem('selectedPlaygroundTab');

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