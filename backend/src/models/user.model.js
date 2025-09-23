import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        userName : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true,
        },
        userImage : {
            type: String, //Cloudinary url
        },
        userImagePublicId : {
            type: String, //Cloudinary public id
        },
        refreshToken : {
            type: String,
        },
        isVerified : {
            type : Boolean,
            default : false
        },
        organisations : [
            {
                organisation : {
                    type : Schema.Types.ObjectId,
                    ref : "Organisation"
                },
                role : {
                    type : String,
                    enum : ["admin","user"],
                    default : "user"
                }
            }
        ],
        otp : {
            type: Number
        }
    },
    {timestamps: true}
)

userSchema.pre("save", async function (next) {
    //If password is not modified then just return
    if(!this.isModified("password")) return next()

    //If password is modified then encrypt it
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//Method to verify Password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//Method to Generate Access Token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//Method to Generate Refresh Token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)