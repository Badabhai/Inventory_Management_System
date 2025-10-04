import mongoose, { Schema } from "mongoose";

const categorySchema = mongoose.Schema(
    {
        categoryName : {
            type : String,
            required : true,
            unique : true
        },
        categoryDescription : {
            type : String
        },
        createdBy : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        organisation : {
            type : Schema.Types.ObjectId,
            ref : "Organisation",
            required : true
        }
    },
    {timestamps: true}
)

export const Category = mongoose.model("Category",categorySchema)