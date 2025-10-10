import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/authorizeRole.middleware.js";
import { createTransaction, getAllTransactions, getTransactionDetails } from "../controllers/transaction.controller.js";


const router = Router();

router.route("/create-transaction").post(verifyJWT,verifyUserRole(["member","admin","owner"]),createTransaction);
router.route("/get-alltransactions").get(verifyJWT,verifyUserRole(["member","admin","owner"]),getAllTransactions);
router.route("/get-transactiondetails").get(verifyJWT,verifyUserRole(["member","admin","owner"]),getTransactionDetails);


export default router