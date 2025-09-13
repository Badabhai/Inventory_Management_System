import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const existingUser = await User.findById(userId)
        const accessToken = existingUser.generateAccessToken()
        const refreshToken = existingUser.generateRefreshToken()

        existingUser.refreshToken = refreshToken
        await existingUser.save({validateBeforeSave: false})
        
        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}

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


const loginUser = asyncHandler( async(req,res) => {
    // get user details
    console.log(req);
    
    const {email,password} = req.body
    // check if email & password are not empty
    if (!email && !password) {
        throw new ApiError(400, "Email and Password are required!")
    }
    // find user by email
    const existingUser = await User.findOne({email});

    if(!existingUser) {
        throw new ApiError(404, "User doesn't exist")
    }

    // verify password
    const isPasswordValid = await existingUser.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(404, "Invalid user credentials")
    }

    // send tokens
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existingUser._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("User : ",existingUser);
    

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user : {
                    userName : existingUser.userName,
                    userImage : existingUser.userImage,
                    role : existingUser.role,
                    email : existingUser.email
                },
                accessToken,
                refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const logoutUser = asyncHandler( async(req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken : undefined
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logged Out"
        )
    )

})

export { registerUser, loginUser, logoutUser}