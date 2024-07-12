'use client'
import { userStore } from "@/lib/store";
import { useRouter } from "next/navigation";

type Props = {}

const Page = (props: Props) => {
  const company = userStore((state) => state.company);
  const router = useRouter();
  
  if(company?.role === 'owner') {
    return router.push('/onboarding/project/create-project');
  } else {
    return router.push('/onboarding/project/join-project');
  }
}

export default Page