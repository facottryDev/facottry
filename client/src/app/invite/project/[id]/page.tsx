'use client'
import { useEffect } from 'react'
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { userStore } from "@/lib/store"
import { axios_admin } from "@/lib/axios"
import { Loader } from "@/components/global/Loader"

type Props = {
  params: {
    id: string
  }
}

const ProjectInvitePage = ({ params }: Props) => {
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
          return router.push("/auth/login?redirect=/invite/project/" + params.id);
        } else {
          const inviteCode = decodeURIComponent(params.id);
          const result = await axios_admin.get(`/project/verify`, {
            params: {
              inviteCode
            }
          });

          toast.success(result.data.message);
          return router.push('/dashboard/home');
        }
      } catch (error: any) {
        console.log(error.response.data);
        toast.error(error.response.data.message);
      }
    }

    inviteFlow();
  }, [user, params.id]);

  return <Loader />
}

export default ProjectInvitePage