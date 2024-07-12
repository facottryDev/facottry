'use client'
import { useRouter } from "next/navigation";

type Props = {}

const Page = (props: Props) => {
  const router = useRouter();
  return router.push('/onboarding/company/join-company');
}

export default Page