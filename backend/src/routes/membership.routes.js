import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/authorizeRole.middleware.js";
import { addMember, getMemberDetails, getMembers, getUserOrganisations, removeMember, updateMemberDetails } from "../controllers/membership.controller.js";

const router = Router();

router.route("/addmember").post(verifyJWT,verifyUserRole(["admin","owner"]),addMember);
router.route("/getmemberdetails").get(verifyJWT,verifyUserRole(["admin","owner"]),getMemberDetails);
router.route("/updatemember").patch(verifyJWT,verifyUserRole(["admin","owner"]),updateMemberDetails);
router.route("/removemember").delete(verifyJWT,verifyUserRole(["admin","owner"]),removeMember);
router.route("/members-list").get(verifyJWT,verifyUserRole(["admin","owner"]),getMembers);
router.route("/user-organisations").get(verifyJWT,getUserOrganisations);

export default router;
