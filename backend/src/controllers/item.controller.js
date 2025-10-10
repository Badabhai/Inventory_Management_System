import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Item } from "../models/item.model.js";
import { Category } from "../models/category.model.js"
import { Transaction } from "../models/transaction.model.js"
import mongoose from "mongoose";

//create Item
const createItem = asyncHandler( async(req,res) => {
    //get Item details and verify
    const { itemName,serialNumber,quantity,location,categoryId,organisationId } = req.body;
    
    if ([itemName,serialNumber,location,categoryId].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All Fields are required");
    }

    if(quantity === undefined || isNaN(quantity)) {
        throw new ApiError(400, "Quantity should be a number");
    }

    //verify category
    const existingCategory = await Category.findById(categoryId);

    if(!existingCategory) {
        throw new ApiError(404, "Category doesnt exist");
    }

    //create item
    const newItem = await Item.create({
        itemName,
        serialNumber,
        quantity,
        location,
        category : categoryId,
        organisation : organisationId,
        addedBy : req.user._id,
        updatedBy : req.user._id,
    })

    if(!newItem) {
        throw new ApiError(500, "Error occured while creating Item");
    }

    //create a transaction
    const newTransaction = await Transaction.create({
        item : newItem._id,
        user : req.user._id,
        organisation : organisationId,
        action : "ADD",
        quantityChange : quantity,
        remark : "New Item Added"
    })

    if(!newTransaction) {
        throw new ApiError(500, "Error occured while creating Transaction");
    }

    //populating the jsom
    const populatedItem = await newItem.populate([
        {
            path: "category",
            select : "categoryName"
        },
        {
            path: "addedBy",
            select : "userName email"
        },
        {
            path: "updatedBy",
            select : "userName email"
        },
    ])

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            populatedItem,
            "New Itme created successfully"
        )
    )
})

//update Item 
const updateItem = asyncHandler( async(req,res) => {
    //get itemId,other fields and veify
    const { itemId,updatedData } = req.body;
    const restrictedFields = ["addedBy","updatedBy","organisation","quantity"]
    
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        throw new ApiError(400, "Invalid Item ID");
    }

    const updatedDataKeys = Object.keys(updatedData || {});

    if (updatedDataKeys.length === 0 ) {
        throw new ApiError(400, "Atleast one field is required");
    }
    
    if(updatedDataKeys.some((key) => restrictedFields.includes(key))) {
        throw new ApiError(400,"Invalid parameters to change")
    }

    if(updatedDataKeys.includes("category")) {
        const existingCategory = await Category.findById(updatedData.category);

        if(!existingCategory) {
            throw new ApiError(404,"Category Not found")
        }
    }

    //update and check Item in DB
    updatedData.updatedBy = req.user._id;

    const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        updatedData,
        { new : true}
    ).populate([
        {
            path: "category",
            select : "categoryName"
        },
        {
            path: "addedBy",
            select : "userName email"
        },
        {
            path: "updatedBy",
            select : "userName email"
        },
    ]);

    if(!updatedItem) {
        throw new ApiError(404,"Item not found")
    }

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedItem,
            "Item data updated successfully"
        )
    )

})

//delete Item
const deleteItem = asyncHandler( async(req,res) => {
    //get ItemId and verify
    const { itemId,organisationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        throw new ApiError(400, "Invalid Item ID");
    }

    const existingItem = await Item.findById(itemId);

    if(!existingItem) {
        throw new ApiError(404,"Item not Found")
    }

    //create a new transaction
    const newTransaction = await Transaction.create({
        item : itemId,
        user : req.user._id,
        action : "DELETE",
        quantityChange : existingItem.quantity,
        remark : "Item Deleted",
        organisation : organisationId
    })

    if(!newTransaction) {
        throw new ApiError(400,"Error occured while creating delete transaction")
    }

    //set isDeleted to true
    existingItem.isDeleted = true;
    existingItem.quantity = 0;

    await existingItem.save();

    //return response
    return res.status(200).json(
        new ApiResponse(
            200,
            existingItem,
            "Item Marked as deleted"
        )
    )
})

//get Items
const getAllItems = asyncHandler( async(req,res) => {
    //get parameters and create filter
    const {organisationId,categories,deleted} = req.query

    let isDeleted = false;

    if(deleted?.trim() === "true") {
        isDeleted = true
    }

    const filter = {
        organisation : organisationId,
        isDeleted
    }

    const filterCategories = categories ? categories.split(",").map(id => id.trim()) : [];

    if(filterCategories?.length !== 0) {
        for(const categoryId of filterCategories) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                throw new ApiError(400, `Invalid Category ID : ${categoryId}`);
            }
        }

        filter.category = { $in : filterCategories}
    }

    //find items in DB
    const allItems = await Item.find(filter).populate([
        {
            path: "category",
            select : "categoryName"
        },
        {
            path: "addedBy",
            select : "userName email"
        },
        {
            path: "updatedBy",
            select : "userName email"
        },
    ]);

    if(!allItems) {
        throw new ApiError(404,"No Items found")
    }

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            allItems,
            "All Items fetched successfully"
        )
    )

})

//get Item details
const getItemDetails = asyncHandler( async(req,res) => {
    //get ItemId and verify
    const { itemId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        throw new ApiError(400, "Invalid Item ID");
    }

    const existingItem = await Item.findById(itemId).populate([
        {
            path: "category",
            select : "categoryName"
        },
        {
            path: "addedBy",
            select : "userName email"
        },
        {
            path: "updatedBy",
            select : "userName email"
        },
    ]);

    if(!existingItem) {
        throw new ApiError(404,"Item not Found")
    }

    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            existingItem,
            "Item details fetched successfully"
        )
    )
})

export { createItem,updateItem,deleteItem,getAllItems,getItemDetails }