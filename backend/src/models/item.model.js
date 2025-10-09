import mongoose, { Schema } from "mongoose";

const itemSchema = mongoose.Schema(
    {
        itemName : {
            type : String,
            required : true,
            unique : true
        },
        serialNumber : {
            type : String,
            required : true,
            unique : true
        },
        category : {
            type : Schema.Types.ObjectId,
            ref : "Category",
            required : true
        },
        quantity : {
            type : Number,
            required : true
        },
        location : {
            type : String,
            required : true
        },
        addedBy : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        updatedBy : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        organisation : {
            type : Schema.Types.ObjectId,
            ref : "Organisation",
            required : true
        },
        isDeleted : {
            type : Boolean,
            default : false
        }

    },
    {timestamps : true}
)

export const Item = mongoose.model("Item",itemSchema)