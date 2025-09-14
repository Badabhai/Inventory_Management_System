import { Router } from "express";
import { loginUser, logoutUser, refreshAcessToken, registerUser, updateUserData } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(); 

router.route("/register").post(
    upload.single("userImage"),
    registerUser
)

router.route("/login").post(loginUser)

//Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAcessToken)
router.route("/update-userdata").post(verifyJWT,updateUserData)


export default router