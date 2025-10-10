import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/authorizeRole.middleware.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryDetails, updateCategoryDetials } from "../controllers/category.controller.js";


const router = Router(); 

router.route("/create-category").post(verifyJWT,verifyUserRole(["owner","admin"]),createCategory)
router.route("/update-category").patch(verifyJWT,verifyUserRole(["owner","admin"]),updateCategoryDetials)
router.route("/delete-category").delete(verifyJWT,verifyUserRole(["owner","admin"]),deleteCategory)

router.route("/get-categorydetails").get(verifyJWT,verifyUserRole(["owner","admin","member"]),getCategoryDetails)
router.route("/get-allcategories").get(verifyJWT,verifyUserRole(["owner","admin","member"]),getAllCategories)

export default router