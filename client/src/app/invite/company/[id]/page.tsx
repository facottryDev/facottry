'use client'
import { useEffect } from 'react'
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { userStore } from "@/lib/store"
import { axios_admin } from "@/lib/axios"

type Props = {
  params: {
    id: string
  }
}

const CompanyInvitePage = ({ params }: Props) => {
  const [user] = userStore(state => [state.user]);
  const router = useRouter();

  useEffect(() => {
    const inviteFlow = async () => {
      try {
        if(!params.id) {
          console.log('No invite code found');
          return router.push('/');
        }

        if (!user) {
          return router.push("/auth/login?redirect=/invite/company/" + params.id);
        } else {
          toast.info("Verifying invite code...");
          const inviteCode = decodeURIComponent(params.id);
          const result = await axios_admin.get(`/company/verify`, {
            params: {
              inviteCode
            }
          });

          router.push('/dashboard/home')
        }
      } catch (error: any) {
        console.log(error.response.data);
      }
    }

    inviteFlow();
  }, [user, params.id]);
}

export default CompanyInvitePage