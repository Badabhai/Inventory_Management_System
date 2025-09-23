import mongoose, { Schema } from "mongoose";

const categorySchema = mongoose.Schema(
    {
        categoryName : {
            type : String,
            required : true,
            unique : true
        },
        description : {
            type : String
        },
        createdBy : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        organisation : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },
    {timestamps: true}
)

export const Category = mongoose.model("Category",categorySchema)