import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/authorizeRole.middleware.js";
import { createItem, deleteItem, getAllItems, getItemDetails, updateItem } from "../controllers/item.controller.js";

const router = Router();

router.route('/create-item').post(verifyJWT,verifyUserRole(["member","admin","owner"]),createItem);
router.route('/update-item').patch(verifyJWT,verifyUserRole(["member","admin","owner"]),updateItem);
router.route('/delete-item').delete(verifyJWT,verifyUserRole(["member","admin","owner"]),deleteItem);
router.route('/get-allitems').get(verifyJWT,verifyUserRole(["member","admin","owner"]),getAllItems);
router.route('/get-itemdetails').get(verifyJWT,verifyUserRole(["member","admin","owner"]),getItemDetails)

export default router