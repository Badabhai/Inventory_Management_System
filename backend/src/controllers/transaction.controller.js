import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js"
import { Item } from "../models/item.model.js";
import mongoose from "mongoose";

//create transaction
const createTransaction = asyncHandler( async(req,res) =>{
    //get transaction details and verify
    const { itemId,action,quantityChange,remark} = req.body;

    const actionTypes = ["ADD","USE","UPDATE"];
    const userAction = action.toUpperCase();

    if(!actionTypes.includes(userAction)) {
        throw new ApiError(400,"Invalid Action type")
    }

    if(isNaN(quantityChange) || quantityChange<1) {
        throw new ApiError(400,"Quantitychange should be positive number")
    }

    //verify itemId and find item
    if( !mongoose.Types.ObjectId.isValid(itemId) ) {
        throw new ApiError(400,"Invalid Item Id")
    }

    const existingItem = await Item.findById(itemId);

    if(!existingItem) {
        throw new ApiError(404,"Item not found")
    }

    if(userAction === "USE" && quantityChange>existingItem.quantity ) {
        throw new ApiError(400,"Used quantity cannot be greater than stock quantity")
    }

    //create transaction
    const newTransaction = await Transaction.create({
        item : itemId,
        user : req.user._id,
        action : userAction,
        quantityChange,
        remark,
        organisation : existingItem.organisation
    })

    if(!newTransaction) {
        throw new ApiError(400,"Failed to create new transaction")
    }

    //update item details
    existingItem.updatedBy = req.user._id;
    if(userAction === "ADD"){
        existingItem.quantity = existingItem.quantity + quantityChange
    }
    else if(userAction === "USE"){
        existingItem.quantity = existingItem.quantity - quantityChange
    }
    if(userAction === "UPDATE"){
        existingItem.quantity = quantityChange
    }

    await existingItem.save();

    //populate new transaction
    const populatedTransaction = await newTransaction.populate([
        {
            path : "item",
            select : "itemName"
        },
        {
            path : "user",
            select : "userName email"
        }
    ]);

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            newTransaction,
            "Transaction created successfully"
        )
    )
})

//get all transactions
const getAllTransactions = asyncHandler( async(req,res) => {
    //get organisationId,categoryIds and verify
    const { organisationId,categories } = req.query;

    const filterCategories = categories ? 
        categories
        .split(",")
        .map((id) => {
            if (!mongoose.Types.ObjectId.isValid(id.trim())) {
                throw new ApiError(400, `Invalid Category ID : ${id}`);
            }
            return new mongoose.Types.ObjectId(id.trim())
        })
        : [];


    console.log(filterCategories);
    
    //make aggregation pipeline

    const pipeline = [
        {
            $match : {
                organisation :  new mongoose.Types.ObjectId(organisationId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "user",
                foreignField : "_id",
                as : "userDetails"
            }
        },
        {
            $lookup : {
                from : "items",
                localField : "item",
                foreignField : "_id",
                as : "itemDetails"
            }
        },
        {
            $unwind : "$userDetails"
        },
        {
            $unwind : "$itemDetails"
        },
        {
            $lookup : {
                from : "categories",
                localField : "itemDetails.category",
                foreignField : "_id",
                as : "categoryDetails"
            }
        },
        {
            $unwind : "$categoryDetails"
        },
        {
            $project : {
                "itemDetails.itemName" : 1,
                "categoryDetails._id" : 1,
                "categoryDetails.categoryName" : 1,
                "userDetails.userName" : 1,
                "userDetails.email" : 1,
                action : 1,
                quantityChange : 1,
                remark : 1,
                createdAt : 1
            }
        },
    ];

    if(filterCategories?.length !== 0) {
        pipeline.push(
            {
            $match : {
                "categoryDetails._id" : {
                    $in : filterCategories
                }
            }
        }
        )
    }

    //find transactions in db
    const allTransactions = await Transaction.aggregate(pipeline);

    if(!allTransactions) {
        throw new ApiError(404,"No transactions found")
    }

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            allTransactions,
            "All Transactions fetched successfully"
        )
    )
})

//get transaction detials
const getTransactionDetails = asyncHandler( async(req,res) => {
    //get transactionId and verify
    const { transactionId } = req.query;

    if(!mongoose.Types.ObjectId.isValid(transactionId)) {
        throw new ApiError(400,"Invalid transaction Id")
    }

    //find transaction
    const existingTransaction = await Transaction.findById(transactionId).populate([
        {
            path : "item",
            select : "itemName",
            populate : {
                path : "category",
                select : "categoryName"
            }
        },
        {
            path : "user",
            select : "userName email"
        }
    ]);

    if(!existingTransaction) {
        throw new ApiError(404,"Transaction not found")
    }

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            existingTransaction,
            "Transaction fetched successfully"
        )
    )
})


export { createTransaction,getAllTransactions,getTransactionDetails}