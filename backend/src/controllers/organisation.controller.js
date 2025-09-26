import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Organisation } from "../models/organisation.model.js"
import { User } from "../models/user.model.js";

//create organisation
const createOrganisation = asyncHandler( async(req,res) => {
    //get organisation details
    const {organisationName,description} = req.body;
    
    //verify details
    if(organisationName===""){
        throw new ApiError(400,"Organisation name is required")
    }

    //get User
    const user  = req.user;

    try {
        //create Organisation
        const organisation = await Organisation.create({
            organisationName,
            createdBy : user._id,
            description
        })
    
        //update organisation in User Model
        await User.findByIdAndUpdate(
            user._id,
            {
                $push : {
                    organisations : {
                        organisation : organisation._id,
                        role : "admin"
                    }
                }
            },
            { new : true }
        )

        const populatedOrganisation = await organisation.populate("createdBy","userName email")
        
        //return response
        return res.status(200).json(
            new ApiResponse(
                200,
                {organisation : populatedOrganisation},
                "New Organisation created successfully"
            )
        )
    } catch (error) {
        console.error(error);
        throw new ApiError(500,"Error occured while creating organisation");
    }
})

//update organisation
const updateOrganisation = asyncHandler( async(req,res) => {
    //get organisation details
    const { organisationId } = req.body;
    const requiredFields = [ "organisationName", "description" ];

    //verify details
    // if(!organisationId) {
    //     throw new ApiError(400,"OrganisationID is requried")
    // }

    if(requiredFields.every((field) => !req.body[field] || req.body[field].trim() === "")) {
        throw new ApiError(400,"Atleast one field is required");
    }

    try {
        //verify organisation in db
        const existingOrganisation = await Organisation.findOne({_id : organisationId}).populate("createdBy","userName email");
    
        if(!existingOrganisation) {
            throw new ApiError(404, "Organisation doesn't exist")
        }

        //update organisation
        let isOrganisationUpdated = false;

        requiredFields.forEach(field => {
            if(req.body[field] && req.body[field] !== existingOrganisation[field]) {
                existingOrganisation[field] = req.body[field];
                isOrganisationUpdated = true;
            }
        })

        if(isOrganisationUpdated) {
            console.log("Saving to DB");
            await existingOrganisation.save();
        }
    
        //return response
        return res.status(200).json(
            new ApiResponse(
                200,
                {organisation : existingOrganisation},
                "Organisaiton data updated successfully"
            )
        )
    } catch (error) {
        throw new ApiError(500,"Error Occured while updating organisation data")
    }
})

//delete organisation
const deleteOrganisation = asyncHandler( async(req,res) => {
    
})

//get organisation
const getOrganisation = asyncHandler( async(req,res) => {
    
})

//add user
//update user
//delete user
//get users

export { 
    createOrganisation,
    updateOrganisation,
    deleteOrganisation,
    getOrganisation }