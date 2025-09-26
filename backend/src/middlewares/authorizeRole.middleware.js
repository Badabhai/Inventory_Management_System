import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyUserRole = asyncHandler( async(req,res,next) => {
    // try {
        const userOrganisations = req.user.organisations;
        const { organisationId } = req.body;

        if(!organisationId) {
            throw new ApiError(400,"OrganisationId is required")
        }

        if(!userOrganisations || userOrganisations.length === 0) {
            throw new ApiError(404,"User doesn't belong to any Organisaiton")
        }

        const selectedOrganisation = userOrganisations.find((field)=> field.organisation.toString() === organisationId)
        console.log(selectedOrganisation);
        
        if(!selectedOrganisation) {
            throw new ApiError(401,"User doesn't belong to organisation")
        }

        if(selectedOrganisation?.role !== "admin") {
            throw new ApiError(401,"Forbidden: insuffiecient rights")
        }
        // userOrganisations.forEach((field)=> {
        //     if(field.organisation === organisationId && field.role !=="admin") {
        //     }
        // })

        next();
    // } catch (error) {
    //     throw new ApiError(500,"Error occured while verifying User Rights")
    // }
}) 