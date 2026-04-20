import { Volunteer } from "../models/volunteer.model.js";
import { FoodDonation } from "../models/foodDonation.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVolunteers = asyncHandler( async (req,res)=>{
    const {page=1,limit=10,search=""} = req.query

    const query = {
        username:{$regex:search,$options:"i"}
    }

    const totalVolunteers = await Volunteer.countDocuments(query)

    const volunteers = await Volunteer.find(query)
    .select("-password -refreshToken")
    .skip((parseInt(page)-1)*parseInt(limit))
    .limit(parseInt(limit))
    .sort({createdAt:-1})

    return res.status(200).json(
        new ApiResponse(200,
            {
                total:totalVolunteers,
                page:parseInt(page),
                limit:parseInt(limit),
                volunteers
            },
            "Volunteers fetched Successfully!")
    )

})

const getVolunteerProfile = asyncHandler( async (req,res)=>{
    const id = req.user.userId
    const volunteer = await Volunteer.findById(id)
    .select("-password -refershToken")
    .populate("pendingFoodDonations")
    .populate("completedFoodDonations")

    if(!volunteer){
        throw new ApiError(404,"Volunteer not found!")
    }

    return res.status(200).json(
        new ApiResponse(200,volunteer,"Volunteer fetched Successfully!")
    )
})

const getVolunteerById = asyncHandler( async (req,res)=>{
    const {id} = req.params
    const volunteer = await Volunteer.findById(id)
    .select("-password -refershToken")
    .populate("pendingFoodDonations")
    .populate("completedFoodDonations")

    if(!volunteer){
        throw new ApiError(404,"Volunteer not found!")
    }

    return res.status(200).json(
        new ApiResponse(200,volunteer,"Volunteer fetched Successfully!")
    )
})

const changeCurrentVolunteerPassword = asyncHandler( async (req,res)=>{
    const {currentPassword,newPassword} = req.body
    const id = req.user.userId
    if(!currentPassword || !newPassword){
        throw new ApiError(400,"Please provide all the details!")
    }

    const user = await Volunteer.findById(id)
    if (!user) {
        throw new ApiError(404, "Volunteer not found!");
    }

    const isPasswordValid = await user.isPasswordCorrect(currentPassword)
    if(!isPasswordValid){
        throw new ApiError(401,"Password is Incorrect!")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:true})

    return res.status(200).json(
        new ApiResponse(200,{},"Password changed Successfully!!")
    )

})

const updateVolunteerProfile = asyncHandler( async (req,res)=>{
    const id = req.user.userId
    const {email,phone,address} =req.body
    if(!email || !phone || !address){
        throw new ApiError(400,"Please provide all the details!")
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"Invalid Volunteer Id!")
    }

    const user = await Volunteer.findByIdAndUpdate(
        id,
        {
            $set:{
                email,
                phone,
                address
            }
        },
        {
            new:true,
            runValidators:true,
            context:"query"
        }
    ).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404,"Volunteer not Found!!")
    }

    return res.status(200).json(
        new ApiResponse(200,user,"Volunteer updated Successfully!")
    )

})

const updateVolunteerAvatar = asyncHandler( async (req,res)=>{
    const id = req.user.userId
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Aavatar file is missing!")
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"Invalid Volunteer Id!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(500,"Something went wrong while uploading on cloudinary!")
    }

    const user = await Volunteer.findByIdAndUpdate(
        id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new:true,
            runValidators:true,
            context:"query"
        }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "Volunteer not found!");
    }

    return res.status(200).json(
        new ApiResponse(200,user,"Avatar updated successfully!")
    )

})

const deleteVolunteer = asyncHandler( async (req,res)=>{
    const id = req.user.userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Volunteer ID");
    }

    const deletedVolunteer = await Volunteer.findByIdAndDelete(id)
    if(!deletedVolunteer){
        throw new ApiError(404,"Volunteer not found")
    }

    return res.status(200).json(
        new ApiResponse(200,deletedVolunteer,"Volunteer deleted Successfully!")
    )
})

const getPendingFoodDonations = asyncHandler(async (req, res) => {
    const id = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Volunteer ID");
    }

    const donations = await FoodDonation.find({
        volunteer: id,
        status: {
            $in: ["Awaiting Collection","Collected by NGO"]
        }
    })
        .populate("ngo collectionAgent")
        // .populate("deliveries", "status pickup destination");

    // if (!donations || donations.length === 0) {
    //     throw new ApiError(404, "No pending donations found for this volunteer.");
    // }

    return res.status(200).json(
        new ApiResponse(200, donations, "Pending food donations retrieved!")
    );
});

const getCompletedFoodDonations = asyncHandler(async (req, res) => {
    const id = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Volunteer ID");
    }

    const donations = await FoodDonation.find({
        volunteer: id,
        status: "Distributed to Needy"
    })
        .populate("ngo collectionAgent distributionAgent")
        // .populate("deliveries", "status pickup destination");

    // if (!donations || donations.length === 0) {
    //     throw new ApiError(404, "No completed donations found for this volunteer.");
    // }

    return res.status(200).json(
        new ApiResponse(200, donations, "Completed food donations retrieved!")
    );
});


export {getAllVolunteers,getVolunteerProfile,getVolunteerById,changeCurrentVolunteerPassword,updateVolunteerProfile,updateVolunteerAvatar,deleteVolunteer,getCompletedFoodDonations,getPendingFoodDonations}