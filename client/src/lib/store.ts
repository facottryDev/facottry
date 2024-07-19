import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterStore = {
  activeFilter: Filter;
  scaleFilter: Filter;
  setScaleFilter: (item: Filter) => void;
  setActiveFilter: (item: Filter) => void;
};


export const activeFilterStore = create(
  persist<FilterStore>(
    (set) => ({
      activeFilter: [],
      scaleFilter:[],
      setActiveFilter: (item) => set({ activeFilter: item }),
      setScaleFilter: (item) => set({ scaleFilter: item }),
    }),
    { name: "activeFilter" }
  )
);

type UserStore = {
  user: User | null;
  company: Company | null;
  activeProject: Project | null;
  projects: Project[];
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  setActiveProject: (activeProject: Project | null) => void;
  setProjects: (projects: Project[]) => void;
};

export const userStore = create(
  persist<UserStore>((set) => ({
    user: null,
    company: null,
    projects: [],
    activeProject: null,

    setUser: (user) => set({ user }),
    setCompany: (company) => set({ company }),
    setProjects: (projects) => set({ projects }),
    setActiveProject: (activeProject) => set({ activeProject }),
  }),
  { name: "user" })
);

type GlobalStore = {
  sidebar: boolean;
  sideDetailsCollapsed: boolean;
  dashboardTab: string;
  playgroundTab: string;
  projectSettingTab: string;
  notibar: boolean;
  setNotibar: (notibar: boolean) => void;
  setProjectSettingTab: (projectSettingTab: string) => void;
  setPlaygroundTab: (playgroundTab: string) => void;
  setDashboardTab: (dashboardTab: string) => void;
  setDetailsCollapsed: (sideDetailsCollapsed: boolean) => void;
  setSidebar: (sidebar: boolean) => void;
};

export const globalStore = create(persist<GlobalStore>((set) => ({
  sidebar: true,
  sideDetailsCollapsed: true,
  dashboardTab: 'Manage Filters',
  playgroundTab: 'SDK Demo',
  projectSettingTab: 'Basic Details',
  notibar: true,
  setNotibar: (notibar: boolean) => set({ notibar }),
  setProjectSettingTab: (projectSettingTab: string) => set({ projectSettingTab }),
  setPlaygroundTab: (playgroundTab: string) => set({ playgroundTab }),
  setDashboardTab: (dashboardTab: string) => set({ dashboardTab }),
  setDetailsCollapsed: (sideDetailsCollapsed: boolean) => set({ sideDetailsCollapsed }),
  setSidebar: (sidebar) => set({ sidebar }),
}), { name: "global" }));