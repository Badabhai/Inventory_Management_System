import { Membership } from "../models/membership.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyUserRole = (allowedRoles = []) => asyncHandler( async(req,res,next) => {
        const { organisationId } = req.body || req.query;

        if(!organisationId) {
            throw new ApiError(400,"OrganisationId is required")
        }

        const userMembershipData = await Membership.findOne({organisation:organisationId,member:req.user._id});
        
        if(!userMembershipData) {
            throw new ApiError(401,"User doesn't belong to organisation")
        }

        if(!allowedRoles.includes(userMembershipData.role)) {
            throw new ApiError(401,"Forbidden: insuffiecient rights")
        }

        req.userRole = userMembershipData.role;

        next();
}) 