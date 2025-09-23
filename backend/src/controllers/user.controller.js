import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOtp } from "../utils/generateOtp.js"
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const existingUser = await User.findById(userId);
    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    existingUser.refreshToken = refreshToken;
    await existingUser.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { userName, email, password, role } = req.body;

  // validation for not empty
  if ([userName, email, password, role].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, "Email is already registered");
  }

  // check for userImage
  const userImageLocalPath = req.file.path;
  console.log("Files ", userImageLocalPath);

  // upload to cloudinary if userImage
  const userImage = await uploadOnCloudinary(userImageLocalPath);
  console.log("userImage", userImage);

  // create user object - create entry in db
  const user = await User.create({
    userName,
    email,
    password,
    role,
    userImage: userImage?.url || "",
    userImagePublicId: userImage?.public_id || ""
  });

  console.log("User Created", user);

  // remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -otp"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // return res
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details
  console.log(req);

  const { email, password } = req.body;
  // check if email & password are not empty
  if (!email && !password) {
    throw new ApiError(400, "Email and Password are required!");
  }
  // find user by email
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(404, "User doesn't exist");
  }

  //check if user is verified
  if(!existingUser.isVerified) {
    throw new ApiError(404, "Please veify your account");
  }

  // verify password
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid user credentials");
  }

  // send tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log("User : ", existingUser);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            userName: existingUser.userName,
            userImage: existingUser.userImage,
            role: existingUser.role,
            email: existingUser.email,
          },
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //find user by Id and remove refresh token
  User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  //return res and clear cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  // get refresh token from req
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    //Verfiy refresh token with existing user
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const existingUser = await User.findById(decodedRefreshToken._id);

    if (!existingUser) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== existingUser.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    //Generate new access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    //return res
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const updateUserData = asyncHandler(async (req, res) => {
  //get new user data from req.body
  const { userName } = req.body;

  //verify new user data
  if (!userName) {
    throw new ApiError(400, "UserName is required");
  }

  try {
    //update user data
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          userName,
        },
      }
    );

    const newUserData = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    //return res
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: newUserData },
          "User data updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error Occured while updating user data");
  }
});

//updatepassword
const changePassword = asyncHandler( async(req,res) => {
  // get otp & new password
  const { email,otp,newPassword } = req.body
  // check if otp & new password are not empty
  if( email === "" || otp === "" || newPassword === "")
  {
    throw new ApiError(400, "All fields are required")
  }
  // get user & verify otp
  const existingUser = await User.findOne({email})

  if(!existingUser) 
  {
    throw new ApiError(404, "User doen't exist")
  }

  if(existingUser.otp !== otp) 
  {
    throw new ApiError(404, "OTP is invalid")
  }

  try {
    // update password
    existingUser.password = newPassword,
    existingUser.otp = undefined
    await existingUser.save({validateBeforeSave:false})
    // User.findByIdAndUpdate(
    //   existingUser._id,
    //   {
    //     $set : {
    //       password : newPassword,
    //       otp: undefined
    //     }
    //   }
    // )
    // return response
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "Password updated successfully"
      )
    )
  } catch (error) {
    throw new ApiError(500, "Error Occured while updating password");
  }
})

//getOtp
const getOtp = asyncHandler(async( req,res ) => {
  // get email,otpType
  const { email,otpType } =req.body;

  // verify email & otpType are non-empty
  if( email === "" || otpType === "" )
  {
    throw new ApiError(400, "All fields are required")
  }

  try {
    // check if user Exists
    const existingUser = await User.findOne({email});
    
    if(!existingUser) {
      throw new ApiError(404, "User doesn't exist");
    }
    
    // Generate OTP
    const otp = generateOtp();
  
    // Save otp to DB
    await User.findByIdAndUpdate(
      existingUser._id,
      {
        $set : {
          otp
        }
      }
    )
  
    // send otp
    await sendOtpEmail(email,otpType,otp);
  
    //return response
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "OTP Sent Successfully"
      )
    )
  } catch (error) {
    throw new ApiError(500, "Error Occured while sending OTP");
  }
})

//verifyUser
const verifyUser = asyncHandler(async(req,res)=> {
  //get email,otp
  const { email,otp } = req.body;

  //check email,otp are non-empty
  if( email === "" || otp === "" )
  {
    throw new ApiError(400, "All fields are required")
  }

  try {
    //find user and verify otp
    const existingUser = await User.findOne({email});
  
    if(!existingUser) {
        throw new ApiError(404, "User doesn't exist");
    }
  
    if(existingUser.otp !== otp) {
      throw new ApiError(404, "OTP is invalid");
    }
  
    //update user as verified in DB and reset otp
    existingUser.isVerified = true
    existingUser.otp = null
    await existingUser.save({validateBeforeSave:false})
    // await User.findByIdAndUpdate(
    //   existingUser._id,
    //   {
    //     $set : {
    //       isVerified : true,
    //       otp : undefined
    //     }
    //   }
    // )
    //additionally we can also send email as acknowlegement
  
    //return res
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "User Verified Successfully"
      )
    )
  } catch (error) {
    console.error("Error Occured while verifying User ",error);
    
    throw new ApiError(500, "Error Occured while verifying User");
  }
})

//update userImage
const updateUserImage = asyncHandler( async(req,res) => {
  // get user
  const user = req.user;

  // check userImage
  const localImagePath = req?.file.path;

  if(!localImagePath) {
    throw new ApiError(400,"User Image is required")
  }

try {
    // upload new image on cloudinary
    const newCoverImage = await uploadOnCloudinary(localImagePath)
  
    if(!newCoverImage) {
      throw new ApiError(400, "User Image is required")
    }
    // remove old image
    if(user.userImagePublicId) {
      const removeImageResponse = await deleteFromCloudinary(user.userImagePublicId)
    
      if(!removeImageResponse) {
        throw new ApiError(500, "Error occured while deleting Image")
      }
    }
    // update in db
    await User.findByIdAndUpdate(
      user._id,
      {
        $set : {
          userImage : newCoverImage.url,
          userImagePublicId : newCoverImage.public_id
        }
      }
    )
    // return res
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "User Image Updated Successfully"
      )
    )
} catch (error) {
  throw new ApiError(500,"Something went wrong while updating image")
}
})

//get User Profile
const getUserProfile = asyncHandler( async(req,res) => {
  //get user
  const user = req.user;
  //return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {user},
      "User Data fetched successfully"
    )
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  updateUserData,
  changePassword,
  getOtp,
  verifyUser,
  updateUserImage,
  getUserProfile
};
