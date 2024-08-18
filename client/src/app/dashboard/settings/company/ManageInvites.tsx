'use client'
import { axios_admin } from "@/lib/axios"
import { userStore } from "@/lib/store";
import { useState } from "react";
import Modal from 'react-modal';
import { toast } from "react-toastify";

type Props = {}

const ManageInvites = (props: Props) => {
  const company = userStore((state) => state.company);
  const activeProject = userStore(state => state.activeProject);
  const [role, setRole] = useState("employee");
  const [AcceptRequestModal, setAcceptRequestModal] = useState(false);

  const handleAcceptRequest = (request: string, role: string) => async () => {
    try {
      await axios_admin.post("/company/accept-request", {
        email: request, role
      })
      toast.success("Request Accepted Successfully");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const handleRejectRequest = (request: string) => async () => {
    try {
      const result = await axios_admin.post("/company/reject-request", { email: request });
      toast.success(result.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const cancelInvite = (invite: string) => async () => {
    try {
      const result = await axios_admin.post("/company/cancel-invite", {
        invite
      });
      toast.success(result.data.message);
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div>
      <div className="w-full border rounded-md mt-8">
        <div className="flex px-4 my-4 w-full justify-between">
          <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Join Requests</label>
        </div>

        <div className="border p-4 min-h-[25vh] max-h-[40vh] bg-white items-center gap-2 justify-between">
          {company?.joinRequests.map((request, index) => (
            <div key={index} className="flex justify-between">
              <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                {index + 1}. {request}
              </h2>

              {/* Accept / Reject Button using Icons */}
              <div className="flex gap-6">
                <button
                  type="button"
                  className="flex items-center text-sm font-semibold leading-6 text-green-600 dark:text-green-400 hover:underline"
                  onClick={() => setAcceptRequestModal(true)}
                >
                  Accept
                </button>

                <Modal
                  isOpen={AcceptRequestModal}
                  onRequestClose={() => setAcceptRequestModal(false)}
                  contentLabel="Employee Role Selector"
                  style={
                    {
                      overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                      },
                      content: {
                        width: '50%',
                        height: 'fit-content',
                        margin: 'auto',
                        padding: '2rem',
                        borderRadius: '10px',
                        backgroundColor: 'white'
                      }
                    }
                  }
                >
                  <div className="flex flex-col items-center gap-4">
                    <p className="font-bold text-primary">{request}</p>

                    <div className="w-full">
                      <label className="font-medium" htmlFor="projectrole">Select Role</label>
                      <select
                        id="projectrole"
                        name="projectrole"
                        className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        defaultValue={role}
                        onChange={(e) => setRole(e.target.value)}>
                        <option value="owner">Owner</option>
                        <option value="employee">Employee</option>
                      </select>
                    </div>

                    <button className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600" onClick={() => {
                      handleAcceptRequest(request, role)();
                      setAcceptRequestModal(false);
                    }}>
                      Confirm
                    </button>
                  </div>
                </Modal>

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

      <div className="w-full border rounded-md mt-8">
        <div className="flex px-4 my-4 w-full justify-between">
          <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Active Invites</label>
        </div>

        <div className="border p-4 min-h-[25vh] max-h-[40vh] bg-white items-center gap-2 justify-between">
          {company?.activeInvites.map((invite, index) => (
            <div key={index} className="flex justify-between">
              <h2 className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                {index + 1}. {invite.split('_')[1]}
              </h2>

              <button
                type="button"
                className="flex items-center text-sm font-semibold leading-6 text-red-600 dark:text-red-400 hover:underline"
                onClick={() => {
                  if (window.confirm('Are you sure?')) {
                    cancelInvite(invite)();
                  }
                }}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageInvites