import { NGO } from "../models/NGO.model.js";
import { FoodDonation } from "../models/foodDonation.model.js";
import { Volunteer } from "../models/volunteer.model.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllNGOs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = {
    username: { $regex: search, $options: "i" },
  };

  const totalVolunteers = await NGO.countDocuments(query);

  const volunteers = await NGO.find(query)
    .select("-password -refreshToken")
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: totalVolunteers,
        page: parseInt(page),
        limit: parseInt(limit),
        volunteers,
      },
      "NGOs fetched Successfully!",
    ),
  );
});

const getAllNGOIdsAndNames = asyncHandler(async (req, res) => {
  try {
    const ngos = await NGO.find(
      {},
      { _id: 1, name: 1, avatar: 1, address: 1, ngoId: 1 },
    ).sort({ name: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(200, ngos, "NGO IDs and names fetched successfully!"),
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch NGOs"));
  }
});

const getNGOProfile = asyncHandler(async (req, res) => {
  const id = req.user.userId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO ID!");
  }

  const ngo = await NGO.findById(id)
    .select("-password -refreshToken")
    .populate("volunteers")
    .populate("deliveryAgents")
    .populate("pendingFoodDonations")
    .populate("foodCollected")
    .populate("distributedFood");

  if (!ngo) {
    throw new ApiError(404, "NGO not Found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ngo, "NGO profile fetched successfully!"));
});

const getNGOById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO ID!");
  }

  const ngo = await NGO.findById(id)
    .select("-password -refreshToken")
    .populate("volunteers")
    .populate("deliveryAgents")
    .populate("pendingFoodDonations")
    .populate("foodCollected")
    .populate("distributedFood");

  if (!ngo) {
    throw new ApiError(404, "NGO not Found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ngo, "NGO profile fetched successfully!"));
});

const changeCurrentNGOPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const id = req.user.userId;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please provide all the details!");
  }

  const user = await NGO.findById(id);
  if (!user) {
    throw new ApiError(404, "NGO not found!");
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is Incorrect!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfully!!"));
});

const updateNGOProfile = asyncHandler(async (req, res) => {
  const id = req.user.userId;
  const { name, ngoId, email, phone, address } = req.body;
  if (!email || !phone || !address || !name || !ngoId) {
    throw new ApiError(400, "Please provide all the details!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO Id!");
  }

  const user = await NGO.findByIdAndUpdate(
    id,
    {
      $set: {
        email,
        phone,
        address,
        name,
        ngoId,
      },
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    },
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "NGO not Found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "NGO updated Successfully!"));
});

const updateNGOAvatar = asyncHandler(async (req, res) => {
  const id = req.user.userId;
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Aavatar file is missing!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO Id!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(
      500,
      "Something went wrong while uploading on cloudinary!",
    );
  }

  const user = await NGO.findByIdAndUpdate(
    id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    },
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "NGO not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully!"));
});

const deleteNGO = asyncHandler(async (req, res) => {
  const id = req.user.userId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO ID");
  }

  const deletedVolunteer = await NGO.findByIdAndDelete(id);
  if (!deletedVolunteer) {
    throw new ApiError(404, "NGO not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedVolunteer, "NGO deleted Successfully!"));
});

// const getAllVolunteersUnderNGO = asyncHandler( async (req,res)=>{
//     const id = req.user.userId
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         throw new ApiError(400,"Invalid NGO Id!")
//     }

//     const ngo = await NGO.findById(id).populate("volunteers")
//     if(!ngo){
//         throw new ApiError(404,"NGO not found!")
//     }

//     return res.status(200).json(
//         new ApiResponse(200,ngo.volunteers,"Volunteers fetched successfully!")
//     )

// })

const getAllDeliveryAgentsUnderNGO = asyncHandler(async (req, res) => {
  const id = req.user.userId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO ID");
  }

  const ngo = await NGO.findById(id).populate("deliveryAgents");
  if (!ngo) {
    throw new ApiError(404, "NGO not found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ngo.deliveryAgents,
        "Delivery Agents fetched successfully!",
      ),
    );
});

const getAllFoodDonations = asyncHandler(async (req, res) => {
  const id = req.user.userId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid NGO Id!");
  }

  const ngo = await NGO.findById(id)
    .populate("pendingFoodDonations")
    .populate("foodCollected")
    .populate("distributedFood");

  if (!ngo) {
    throw new ApiError(404, "NGO not found!");
  }

  const allDonations = {
    pending: ngo.pendingFoodDonations,
    collected: ngo.foodCollected,
    distributed: ngo.distributedFood,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allDonations,
        "All food Donations fetched successfully!",
      ),
    );
});

// const addVolunteerToNGO = asyncHandler( async (req,res)=>{
//     const {volunteerId} = req.body
//     const ngoId = req.user.userId
//     const ngo = await NGO.findById(ngoId)
//     if(!ngo){
//         throw new ApiError(404,"NGO not found!")
//     }

//     const volunteer = await Volunteer.findById(volunteerId)
//     if(!volunteer){
//         throw new ApiError(404,"Volunteer not found!")
//     }

//     if(!ngo.volunteers.includes(volunteerId)){
//         ngo.volunteers.push(volunteerId)
//         await ngo.save({validateBeforeSave:false})
//     }

//     return res.status(200).json(
//         new ApiResponse(200,ngo,"Volunteers added to NGO!!")
//     )
// })

// const hireDeliveryAgent = asyncHandler( async (req,res)=>{
//     const {deliveryAgentId} = req.body
//     const ngoId = req.user.userId
//     const ngo = await NGO.findById(ngoId)
//     if(!ngo){
//         throw new ApiError(404,"NGO not found!")
//     }

//     const volunteer = await DeliveryAgent.findById(deliveryAgentId)
//     if(!volunteer){
//         throw new ApiError(404,"Delivery Agent not found!")
//     }

//     if(!ngo.deliveryAgents.includes(deliveryAgentId)){
//         ngo.deliveryAgents.push(deliveryAgentId)
//         await ngo.save({validateBeforeSave:false})
//     }

//     return res.status(200).json(
//         new ApiResponse(200,ngo,"Delivery Agent added to NGO!!")
//     )
// })

const getPendingDonationsForNGO = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.userId) {
    throw new ApiError(401, "Unauthorized: missing or invalid token");
  }
  const ngoId = req.user.userId; // <-- now guaranteed string

  // (Optional) sanity check it’s a valid ObjectId
  // if (!mongoose.Types.ObjectId.isValid(ngoId)) {
  //   throw new ApiError(400, "Invalid NGO ObjectId");
  // }

  const ngo = await NGO.findById(ngoId).populate("pendingFoodDonations");
  if (!ngo) {
    throw new ApiError(404, "NGO not found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ngo.pendingFoodDonations,
        "Pending donations fetched successfully!",
      ),
    );
});

const getCollectedDonationsForNGO = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.userId) {
    throw new ApiError(401, "Unauthorized: missing or invalid token");
  }

  const ngoId = req.user.userId;

  const ngo = await NGO.findById(ngoId).populate("foodCollected");

  if (!ngo) {
    throw new ApiError(404, "NGO not found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ngo.foodCollected,
        "Collected donations fetched successfully!",
      ),
    );
});

const getDistributedDonationsForNGO = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.userId) {
    throw new ApiError(401, "Unauthorized: missing or invalid token");
  }

  const ngoId = req.user.userId;

  const ngo = await NGO.findById(ngoId).populate("distributedFood");

  if (!ngo) {
    throw new ApiError(404, "NGO not found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ngo.distributedFood,
        "Distributed donations fetched successfully!",
      ),
    );
});

const getRejectedDonations = asyncHandler(async (req, res) => {
  const ngoId = req.user.userId;

  const donations = await FoodDonation.find({
    ngo: ngoId,
    qualityStatus: "Rejected",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, donations, "Rejected donations fetched"));
});

export {
  getAllNGOs,
  getAllNGOIdsAndNames,
  getNGOProfile,
  getNGOById,
  changeCurrentNGOPassword,
  updateNGOProfile,
  updateNGOAvatar,
  deleteNGO,
  getAllDeliveryAgentsUnderNGO,
  getAllFoodDonations,
  getPendingDonationsForNGO,
  getCollectedDonationsForNGO,
  getDistributedDonationsForNGO,
  getRejectedDonations,
};
