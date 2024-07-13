'use client'
import { axios_admin } from "@/lib/axios"
import { userStore } from "@/lib/store";

type Props = {}

const ManageInvites = (props: Props) => {
  const company = userStore((state) => state.company);

  const handleAcceptRequest = (request: string) => async () => {
    console.log('hey')
    try {
      const result = await axios_admin.post("/company/accept-request", { email: request });
      alert(result.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      alert(error.response.data.message)
    }
  }

  const handleRejectRequest = (request: string) => async () => {
    try {
      const result = await axios_admin.post("/company/reject-request", { email: request });
      alert(result.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      alert(error.response.data.message)
    }
  }

  return (
    <div className="w-full border rounded-md mt-8">
      <div className="flex px-4 my-4 w-full justify-between">
        <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Manage Invites</label>
      </div>

      <div className="border bg-white h-[40vh] overflow-y-scroll p-4 items-center mt-2 gap-2 justify-between">
        {company?.joinRequests.map((request, index) => (
          <div key={index} className="flex justify-between">
            <label htmlFor="companyname" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
              {index + 1}. {request}
            </label>

            {/* Accept / Reject Button using Icons */}
            <div className="flex gap-6">
              <button
                type="button"
                className="flex items-center text-sm font-semibold leading-6 text-green-600 dark:text-green-400 hover:underline"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    handleAcceptRequest(request)();
                  }
                }}
              >
                Accept
              </button>

              <button
                type="button"
                className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    handleRejectRequest(request)();
                  }
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageInvites