import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async(req,res) => {
    // get user details from frontend
    const { userName, email, password, role} = req.body;

    // validation for not empty
    if(
        [userName, email, password, role].some((field) => field.trim() === "") 
    ){
        throw new ApiError(400,"All Fields are required")
    }

    // check if user exists
    const userExists = await User.findOne({email})
    if (userExists) {
        throw new ApiError(409,"Email is already registered")
    }

    // check for userImage
    const userImageLocalPath = req.file.path;
    console.log("Files ",userImageLocalPath);

    // upload to cloudinary if userImage
    const userImage = await uploadOnCloudinary(userImageLocalPath)
    console.log("userImage",userImage);
    


    // create user object - create entry in db
    const user = await User.create({
        userName,
        email,
        password,
        role,
        userImage: userImage?.url || ""
    })

    console.log("User Created",user);


    // remove password and refresh token from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering user")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )

})

export {registerUser}