'use client'
import { axios_auth, axios_admin } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userStore, activeFilterStore, globalStore } from "@/lib/store";
import { Loader } from "@/components/global/Loader";
import { useSearchParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectURL = searchParams.get('redirect') || null;
    const [activeFilter, setActiveFilter, scaleFilter, setScaleFilter] = activeFilterStore(state => [state.activeFilter, state.setActiveFilter, state.scaleFilter, state.setScaleFilter]);

    const { activeProject, setActiveProject, setCompany, setProjects, setUser, user } = userStore(state => ({
        activeProject: state.activeProject,
        setActiveProject: state.setActiveProject,
        setCompany: state.setCompany,
        setProjects: state.setProjects,
        setUser: state.setUser,
        user: state.user
    }));

    const fetchData = async () => {
        try {
            const userResponse = await axios_auth.get('/get-user');
            setUser(userResponse.data);

            if(redirectURL) {
                return router.push(redirectURL.replace('@', '%40'));
            }

            const adminResponse = await axios_admin.get('/get-admin');
            const { company, projects } = adminResponse.data;

            setProjects(projects);
            setCompany(company);

            const currentProject = projects.find((p: any) => p.projectID === activeProject?.projectID) || projects[0];
            setActiveProject(currentProject);

            if (Object.keys(activeFilter).length === 0 && projects.length > 0) {
                const defaultFilter = Object.keys(currentProject.filters).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
                setActiveFilter(defaultFilter);
            }

            if (Object.keys(scaleFilter).length === 0 && projects.length > 0) {
                const defaultFilter = Object.keys(currentProject.filters).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
                setScaleFilter(defaultFilter);
            }

            setIsLoading(false);
        } catch (error: any) {
            console.log(error);
            if (error.response?.data.code === "NO_COMPANY") {
                router.push('/onboarding');
            } else if (error.response?.data.code === "NO_PROJECT") {
                setCompany(error.response.data.company);
                router.push('/dashboard/project/join-project');
                setIsLoading(false);
            } else {
                router.push('/');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <main>
                {children}
            </main>
        )
    }
}