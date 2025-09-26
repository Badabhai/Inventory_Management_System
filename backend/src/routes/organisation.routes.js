import { Router } from "express";
import { createOrganisation, updateOrganisation } from "../controllers/organisation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/authorizeRole.middleware.js"

const router = Router();

router.route('/create').post(verifyJWT,createOrganisation)

//require admin
router.route('/update').patch(verifyJWT, verifyUserRole, updateOrganisation)

export default router