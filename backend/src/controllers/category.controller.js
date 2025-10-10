import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

//create Category
const createCategory = asyncHandler(async (req, res) => {
  //get category details and verify
  const { categoryName, categoryDescription, organisationId } = req.body;

  if (categoryName === "" || categoryDescription === "") {
    throw new ApiError(400, "All fields are required");
  }

  try {
    //create category
    const newCategory = await Category.create({
      categoryName,
      categoryDescription,
      createdBy: req.user._id,
      organisation: organisationId,
    });

    const populatedCategory = await newCategory.populate([
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "organisation",
        select: "organisationName",
      },
    ]);

    //return res
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { populatedCategory },
          "Category created successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error occured while creating category");
  }
});

//update Category
const updateCategoryDetials = asyncHandler(async (req, res) => {
  //get category details and verify
  const { categoryId } = req.body;
  const requiredFields = ["categoryName" , "categoryDescription"];

  if (
    requiredFields.every(
      (field) => !req.body[field] || req.body[field].trim() === ""
    )
  ) {
    throw new ApiError(400, "Atleast one field is required");
  }

  //check category in db
  const existingCategory = await Category.findOne({_id : categoryId}).populate([
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "organisation",
        select: "organisationName",
      },
    ]);

    if(!existingCategory) {
      throw new ApiError(404,"Category doesnt exist")
    }

  
  try {
    //update catergory
    let isCategoryUpdated = false;

    requiredFields.forEach((field) => {
      if (req.body[field] && req.body[field] !== existingCategory[field]) {
        existingCategory[field] = req.body[field];
        isCategoryUpdated = true;
      }
    });

    if(isCategoryUpdated) {
      await existingCategory.save();
    }

    //return res
    return res.status(200).json(
      new ApiResponse(
        200,
        {existingCategory},
        "Category details updated successfully"
      )
    )
  } catch (error) {
    throw new ApiError(500,"Error occured while updating category")
  }
});

//get Category Details
const getCategoryDetails = asyncHandler(async (req, res) => {
  //get categoryId
  const {categoryId} = req.query;
  if(categoryId === "") {
    throw new ApiError(400,"Category Id is required")
  }

  //find category in db
  const categoryDetails = await Category.findOne({ _id : categoryId }).populate([
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "organisation",
        select: "organisationName",
      },
    ]);

    if(!categoryDetails) {
      throw new ApiError(404,"Category doesnt exist")
    }

  //return res
  return res.status(200).json(
    new ApiResponse(
      200,
      {categoryDetails},
      "Category details fetched successfully"
    )
  )
});

//delete Category
const deleteCategory = asyncHandler(async (req, res) => {

  //get categoryId
  const {categoryId} = req.body;
  if(categoryId === "") {
    throw new ApiError(400,"Category Id is required")
  }

  //delete category
  await Category.findByIdAndDelete({_id : categoryId})

  //retrun res
  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Category deleted successfully"
    )
  )
});


//get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
  //get organisation Id
  const { organisationId } = req.query;

  //find all categories
  const allCategories = await Category.find({ organisation:organisationId}).populate([
      {
        path: "createdBy",
        select: "userName email",
      },
      {
        path: "organisation",
        select: "organisationName",
      },
    ]);

  if(!allCategories) {
    throw new ApiError(404,"No Categories found")
  }

  //return res
  return res.status(200).json(
    new ApiResponse(
      200,
      {allCategories},
      "All categories fetch successfully"
    )
  )
});

export {
  createCategory,
  getCategoryDetails,
  updateCategoryDetials,
  deleteCategory,
  getAllCategories,
};
