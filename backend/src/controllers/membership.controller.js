import { asyncHandler } from "../utils/asyncHandler.js";
import { Membership } from "../models/membership.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

//add Member
const addMember = asyncHandler(async (req, res) => {
  // get new user email and role and verify for non-empty
  const { newMemberEmail, newMemberRole, organisationId } = req.body;

  if (newMemberEmail === "" || newMemberRole === "") {
    throw new ApiError(400, "All fields are required");
  }

  // check if user exists
  const newMember = await User.findOne({ email: newMemberEmail }).select(
    "-password -refreshToken"
  );

  if (!newMember) {
    throw new ApiError(404, "User with email doesn't exist");
  }

  //check if user is already in organisation
  const alreadyMember = await Membership.findOne({
    organisation: organisationId,
    member: newMember?._id,
  });

  if (alreadyMember) {
    throw new ApiError(400, "Member already exists in organisaiton");
  }

  try {
    // update user
    // newMember.organisations.push({
    //   organisation: organisationId,
    //   role: newMemberRole,
    // });

    // await newMember.save();

    await Membership.create({
      organisation: organisationId,
      member: newMember._id,
      role: newMemberRole,
    });

    // return res
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Member added to organisation."));
  } catch (error) {
    throw new ApiError(
      500,
      "Error occured while adding Member to organisation"
    );
  }
});

//get member details
const getMemberDetails = asyncHandler(async (req, res) => {
  //get member details & verify
  const { memberId, organisationId } = req.body;

  if (memberId === "") {
    throw new ApiError(400, "Member Email is required");
  }

  //find user
//   const memberData = await User.findOne({ email: memberEmail }).select(
//     "-password -refreshToken"
//   );
  const membershipData = await Membership.findOne({ organisation:organisationId,member:memberId }).populate("member","userName email userImage")

  if (!membershipData) {
    throw new ApiError(404, "Member does not exist in organisation");
  }

  try {
    //return res
    return res.status(200).json(
      new ApiResponse(
        200,
        { membershipData},
        "Member details fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error occured while fetching member data");
  }
});

//update member
const updateMemberDetails = asyncHandler(async (req, res) => {
  //get actor role
  const actorRole = req.userRole;

  //get member detials and verify
  const { memberId, memberUpdatedRole, organisationId } = req.body;

  if (memberId === "" || memberUpdatedRole === "") {
    throw new ApiError(400, "All fields are required");
  }

  if (memberUpdatedRole === "owner") {
    throw new ApiError(400, "Ownership can only be transfered");
  }

  //find member in db
  const membershipData = await Membership.findOne({ organisation:organisationId,member:memberId }).populate("member","userName email");

  if (!membershipData) {
    throw new ApiError(404, "Member doesn't exist in organisation");
  }

  //verify actor role with respect to member role
  //owner can change admin,user role
  //admin can change user role

  if (actorRole === "admin" && membershipData.role !== "user") {
    throw new ApiError(400, "Forbidden: insuffiecient rights");
  }

  try {
    //update member data
    membershipData.role = memberUpdatedRole;

    await membershipData.save();

    //return res
    return res.status(200).json(
      new ApiResponse(
        200,
        { membershipData },
        "Member data updated successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error occured while updating member data");
  }
});

//remove member
const removeMember = asyncHandler(async (req, res) => {
  //get actor role
  const actorRole = req.userRole;

  //get member data and verify
  const { memberId, organisationId } = req.body;

  if (memberId === "") {
    throw new ApiError(400, "Member Email is required");
  }

  //find member in db
  const membershipData = await Membership.findOne({ organisation:organisationId,member:memberId });

  if (!membershipData) {
    throw new ApiError(404, "Member doesn't exist in organisation");
  }

  //verify actor role with respect to member role
  //owner can change admin,user role
  //admin can change user role

  if (actorRole === "admin" && membershipData.role !== "user") {
    throw new ApiError(400, "Forbidden: insuffiecient rights");
  }

  try {
    //delete membership data
    await Membership.findByIdAndDelete(membershipData._id);

    //return res
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Member removed successfully"));
  } catch (error) {
    throw new ApiError(500, "Error occured while removing member");
  }
});

//get members
const getMembers = asyncHandler(async (req, res) => {
  //get organisationId
  const { organisationId } = req.body;

  //get all Members
  const allMembersData = await Membership.find({ organisation:organisationId }).select("-organisation").populate("member","userName email userImage");

  if(!allMembersData) {
    throw new ApiError(404,"No members found in organisation")
  }

  try {
    //return res
    return res.status(200).json(
        new ApiResponse(
            200,
            {allMembersData},
            "Fected All members in organisation"
        )
    )
  } catch (error) {
    throw new ApiError(500,"Error occured while fetching members")
  }

});

//get user organisations
const getUserOrganisations = asyncHandler( async(req,res)=> {
  //get userId 
  const userId = req.user._id

  if(!userId) {
    throw new ApiError(400,"User ID is required")
  }

    //get organisations
    const userOrganisations = await Membership.find({member:userId})
      .populate({
        path : "organisation",
        select : "organisationName createdBy description",
        populate : {
          path : "createdBy",
          select : "userName email"
        }
      });

    console.log(userOrganisations);
    if(!userOrganisations) {
      throw new ApiError(404,"User doesnt have any organisations")
    }

  try {
    //return res
    return res.status(200).json(
      new ApiResponse(
        200,
        {userOrganisations},
        "User Organisations fetched successfully"
      )
    )
  } catch (error) {
    throw new ApiError(500,"Error Occured while fetching organisations")
  }
})

export {
  addMember,
  getMemberDetails,
  updateMemberDetails,
  removeMember,
  getMembers,
  getUserOrganisations
};
