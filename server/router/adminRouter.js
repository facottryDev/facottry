import { Router } from "express";
import {
  createJoinCompanyRequest,
  leaveCompany,
  createJoinProjectRequest,
  leaveProject,
  acceptJoinCompanyRequest,
  sendProjectInvite,
  verifyCompanyInvite,
  addProject,
  addCompany,
  getAdmin,
  deactivateCompany,
  deactivateProject,
  updateCompanyDetails,
  updateProjectDetails,
  rejectJoinCompanyRequest,
  deleteCompanyUser,
  acceptJoinProjectRequest,
  rejectJoinProjectRequest,
  deleteProjectUser,
  changeAccess,
  deleteFilter,
  addFilter,
  updateFilter,
  cloneProject,
  addConfigType,
  deleteConfigType,
  getProject,
  updateContacts,
  inviteUserToCompany,
  verifyUserInvite
} from "../controllers/admin.js";
import { isAuth } from "../lib/middlewares.js";
import { toggleConfigTypeStatus } from "../controllers/config.js";
const router = Router();

router.post('/update-contact', updateContacts);

router.use(isAuth);
router.get("/get-admin", getAdmin);
router.get("/get-project", getProject);

// FOR COMPANY OWNERS
router.post("/company/create", addCompany);
router.delete("/company/deactivate", deactivateCompany);
router.post("/company/update", updateCompanyDetails);
router.post("/company/accept-request", acceptJoinCompanyRequest);
router.post("/company/reject-request", rejectJoinCompanyRequest);
router.post("/company/delete-user", deleteCompanyUser);
// router.get("/company/verify-invite", verifyCompanyInvite);
router.post("/company/invite", inviteUserToCompany);
router.get("/company/verify", verifyUserInvite);

// FOR PROJECT OWNERS
router.post("/add-project", addProject);
router.post("/update-project", updateProjectDetails);
router.post("/project/deactivate", deactivateProject);
router.post("/project/accept-request", acceptJoinProjectRequest);
router.post("/project/reject-request", rejectJoinProjectRequest);
router.post("/project/invite", sendProjectInvite);
router.post("/project/delete-user", deleteProjectUser);
router.post('/project/change-access', changeAccess);
router.post('/project/clone', cloneProject);

router.post('/project/config-type/add', addConfigType);
router.delete('/project/config-type/delete', deleteConfigType);
router.put('/project/config-type/toggle-status', toggleConfigTypeStatus);

router.post('/filter/add', addFilter);
router.post('/filter/update', updateFilter);
router.post('/filter/delete', deleteFilter);

// WHEN ANY COMPANY USER
router.post("/join-company", createJoinCompanyRequest);
router.post("/company/leave", leaveCompany);

// WHEN ANY PROJECT USER
router.post("/join-project", createJoinProjectRequest);
router.post("/project/leave", leaveProject);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Admin Router" });
});

export default router;