'use client'
import { userStore } from "@/lib/store";
import { useRouter } from "next/navigation";

type Props = {}

const Page = (props: Props) => {
  const company = userStore(state => state.company);

  const router = useRouter();
  if(company?.role !== 'owner'){
    return router.push('/dashboard/project/join-project')
  } else {
    return router.push('/dashboard/project/create-project')
  }
}

export default Page