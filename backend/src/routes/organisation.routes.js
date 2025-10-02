import { Router } from "express";
import {
  createOrganisation,
  deleteOrganisation,
  getOrganisationDetails,
  updateOrganisation,
} from "../controllers/organisation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createOrganisation);
router.route("/get").post(verifyJWT, getOrganisationDetails);

//require admin
router.route("/update").patch(verifyJWT, verifyUserRole(["admin","owner"]), updateOrganisation);


//require owner
router
  .route("/delete")
  .post(verifyJWT, verifyUserRole(["owner"]), deleteOrganisation);



export default router;
