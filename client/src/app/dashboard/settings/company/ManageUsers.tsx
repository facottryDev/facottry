'use client'
import { userStore } from '@/lib/store'
import { axios_admin } from "@/lib/axios"
import { toast } from "react-toastify"
import { MdDeleteSweep, MdEditNote } from "react-icons/md"
import { useState } from "react"
import Modal from 'react-modal';
import { IoClose } from "react-icons/io5"

type Props = {}

const ManageUsers = (props: Props) => {
  const company = userStore((state) => state.company);
  const [InviteUserModal, setInviteUserModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: "", role: "owner" });
  const activeProject = userStore(state => state.activeProject);

  const inviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await axios_admin.post("/company/invite", {
        ...inviteData, projectID: activeProject?.projectID
      });
      toast(result.data.message);
      setInviteUserModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }

  const deleteUser = (email: string) => async () => {
    try {
      await axios_admin.post("/company/delete-user", {
        email, projectID: activeProject?.projectID
      })
      toast("User Removed Successfully");
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const changeAccess = (email: string, e: React.ChangeEvent<HTMLSelectElement>) => async () => {
    try {
      await axios_admin.post("/company/change-access", {
        email, role: e.target.value, projectID: activeProject?.projectID
      })
      toast("Access Changed Successfully");
      window.location.reload();
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div>
      <div className="w-full border rounded-md mt-8 text-sm">
        <div className="flex px-4 my-4 w-full justify-between items-center">
          <label className="font-bold leading-6 text-gray-900 dark:text-slate-200">Manage Users</label>

          <button
            onClick={() => setInviteUserModal(true)}
            className="border font-medium p-2 px-3 rounded-md shadow-sm hover:bg-gray-100 transition-all cursor-pointer"
          >
            Invite User
          </button>
        </div>

        <div className="w-full">
          <table className="table-auto w-full border-t">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {company?.owners.map((owner: any, index: number) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{owner}</p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Owner</p>
                  </td>

                  <td className="border-b border-gray-200 text-sm">
                    <button className="ml-2 p-2 rounded-full bg-primary600 text-white hover:bg-primary700 transition-all">
                      <MdEditNote fontSize={18} />
                    </button>

                    <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                      if (window.confirm("Are you sure you want to delete this user?")) {
                        deleteUser(owner)();
                      }
                    }}>
                      <MdDeleteSweep fontSize={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {company?.employees.map((employee: any, index: number) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{employee}</p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Employee</p>
                  </td>

                  <td className="border-b border-gray-200 text-sm">
                    <button className="ml-2 p-2 rounded-full bg-primary600 text-white hover:bg-primary700 transition-all">
                      <MdEditNote fontSize={18} />
                    </button>

                    <button className="ml-2 p-2 rounded-full bg-primary900 hover:bg-primary700 text-white transition-all" onClick={() => {
                      if (window.confirm("Are you sure you want to delete this user?")) {
                        deleteUser(employee)();
                      }
                    }}>
                      <MdDeleteSweep fontSize={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <Modal
        isOpen={InviteUserModal}
        onRequestClose={() => setInviteUserModal(false)}
        contentLabel="Invite User To Company"
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
        <div className="text-sm">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-bold">Invite User</h1>

            <button
              onClick={() => setInviteUserModal(false)}
            >
              <IoClose fontSize={'1.2rem'} />
            </button>
          </div>

          <form className="flex flex-col items-center gap-4 text-sm" onSubmit={inviteUser}>
            <div className="w-full">
              <label className="font-medium" htmlFor="newuseremail"> Email </label>
              <input type="email" placeholder="demo@gmail.com" autoComplete='email' id="newuseremail" name="newuseremail" className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" onChange={
                (e) => setInviteData({ ...inviteData, email: e.target.value })
              } />
            </div>

            <div className="w-full">
              <label className="font-medium" htmlFor="newuserrole">Select Role</label>
              <select
                id="newuserrole"
                name="newuserrole"
                className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                onChange={
                  (e) => setInviteData({ ...inviteData, role: e.target.value })
                }>
                <option value="owner">Owner</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <button className="px-3 py-2 text-sm font-semibold text-white transition-all rounded-md shadow-sm bg-primary hover:bg-primary400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary600" type="submit">
              Invite
            </button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default ManageUsers