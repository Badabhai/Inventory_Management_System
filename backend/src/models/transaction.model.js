import mongoose, { Schema } from "mongoose";

const transactionSchema = mongoose.Schema(
    {
        item : {
            type : Schema.Types.ObjectId,
            ref : "Item",
            required : true
        },
        user : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        category : {
            type : Schema.Types.ObjectId,
            ref : "Category",
            required : true
        },
        action : {
            type : String,
            enum : ["ADD","USE","DELETE","UPDATE"],
            default : "USE"
        },
        quantityChange : {
            type : Number,
            required : true
        },
        remark : {
            type : String,
        },
        organisation : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },
    {timestamps : true}
)