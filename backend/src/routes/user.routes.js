import { Router } from "express";
import { 
    changePassword,
    getOtp, 
    getUserProfile, 
    loginUser, 
    logoutUser, 
    refreshAcessToken, 
    registerUser, 
    updateUserData, 
    updateUserImage, 
    verifyUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(); 

router.route("/register").post(
    upload.single("userImage"),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/change-password").patch(changePassword)
router.route("/get-otp").get(getOtp)
router.route("/verify-user").post(verifyUser)

//Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAcessToken)
router.route("/update-userdata").patch(verifyJWT,updateUserData)
router.route("/get-userprofile").get(verifyJWT,getUserProfile)
router.route("/update-userimage").patch(
    upload.single("userImage"),
    verifyJWT,
    updateUserImage
)


export default router