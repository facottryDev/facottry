'use client'
import { userStore } from "@/lib/store";
import { useRouter } from "next/navigation";

type Props = {}

const Page = (props: Props) => {
  const [company, projects] = userStore(state => [state.company, state.projects]);

  const router = useRouter();

  if (projects.length === 0) {
    router.push('/dashboard/project');
  } else if (!company) {
    router.push('/onboarding/company');
  } else {
    router.push('/dashboard/home');
  }
}

export default Page