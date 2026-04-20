import {asyncHandler} from "../utils/asyncHandler.js";
import { NGO } from "../models/NGO.model.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";
import { Delivery } from "../models/delivery.model.js";
import { FoodDonation } from "../models/foodDonation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const getAllDeliveryAgents = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
  
    const query = {
      username: { $regex: search, $options: "i" } 
    };
  
    const totalAgents = await DeliveryAgent.countDocuments(query);
  
    const agents = await DeliveryAgent.find(query)
      .select("-password -refreshToken")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
  
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total: totalAgents,
          page: parseInt(page),
          limit: parseInt(limit),
          agents
        },
        "Delivery agents fetched successfully!"
      )
    );
});

const getDeliveryAgentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Delivery Agent ID!");
    }
  
    const agent = await DeliveryAgent.findById(id)
      .select("-password -refreshToken")
      .populate("assignedNGO", "username email address")
      .populate({
        path: "deliveries",
        populate: [
          { path: "foodDonation", select: "foodType quantity status" },
          { path: "ngo", select: "name" },
          { path: "volunteer", select: "username" }
        ]
      });
  
    if (!agent) {
      throw new ApiError(404, "Delivery Agent not found!");
    }
  
    return res.status(200).json(
      new ApiResponse(200, agent, "Delivery Agent profile fetched successfully!")
    );
});
  
const getDeliveryAgentProfile = asyncHandler(async (req, res) => {
  const agentId = req.user._id;

  const agent = await DeliveryAgent.findById(agentId)
    .select("-password -refreshToken")
    .populate("assignedNGO", "username email address")
    .populate({
      path: "deliveries",
      populate: [
        { path: "foodDonation", select: "foodType quantity status" },
        { path: "ngo", select: "username" },
        { path: "volunteer", select: "username" }
      ]
    });

  if (!agent) {
    throw new ApiError(404, "Delivery Agent not found!");
  }

  return res.status(200).json(
    new ApiResponse(200, agent, "Delivery Agent profile fetched successfully!")
  );
});

const changeCurrentDeliveryAgentPassword = asyncHandler( async (req,res)=>{
    const {currentPassword,newPassword} = req.body
    const id = req.user.userId
    if(!currentPassword || !newPassword){
        throw new ApiError(400,"Please provide all the details!")
    }

    const user = await DeliveryAgent.findById(id)
    if (!user) {
        throw new ApiError(404, "Delivery Agent not found!");
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

const updateDeliveryAgentProfile = asyncHandler( async (req,res)=>{
    const id = req.user.userId
    const {name,drivingId,bio,email,phone,address} =req.body
    if(!email || !phone || !address || !name ||!drivingId){
        throw new ApiError(400,"Please provide all the details!")
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"Invalid Delivery Agent Id!")
    }

    const user = await DeliveryAgent.findByIdAndUpdate(
        id,
        {
            $set:{
                email,
                bio:bio?bio:"",
                phone,
                address,
                name,
                drivingId
            }
        },
        {
            new:true,
            runValidators:true,
            context:"query"
        }
    ).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404,"Delivery Agent not Found!!")
    }

    return res.status(200).json(
        new ApiResponse(200,user,"Delivery Agent updated Successfully!")
    )

})

const updateDeliveryAgentAvatar = asyncHandler( async (req,res)=>{
  const id = req.user.userId
  const avatarLocalPath = req.file?.path
  if(!avatarLocalPath){
      throw new ApiError(400,"Aavatar file is missing!")
  }
  if(!mongoose.Types.ObjectId.isValid(id)){
      throw new ApiError(400,"Invalid Delivery Agent Id!")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if(!avatar){
      throw new ApiError(500,"Something went wrong while uploading on cloudinary!")
  }

  const user = await DeliveryAgent.findByIdAndUpdate(
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
      throw new ApiError(404, "Delivery Agent not found!");
  }

  return res.status(200).json(
      new ApiResponse(200,user,"Avatar updated successfully!")
  )

})

const deleteDeliveryAgent = asyncHandler( async (req,res)=>{
    const id = req.user.userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Delivery Agent ID");
    }

    const deletedVolunteer = await DeliveryAgent.findByIdAndDelete(id)
    if(!deletedVolunteer){
        throw new ApiError(404,"Delivery Agent not found")
    }

    return res.status(200).json(
        new ApiResponse(200,deletedVolunteer,"Delivery Agent deleted Successfully!")
    )
})

const getMyDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await Delivery.find({ deliveryAgent: req.user.userId})
    .populate("foodDonation ngo volunteer")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, deliveries, "Deliveries fetched"));
});

const markCollectionAsComplete = asyncHandler(async (req, res) => {
  const { donationId } = req.body;

  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");

  if (donation.status !== "Awaiting Collection") {
      throw new ApiError(400, "Invalid status. Collection cannot be marked complete.");
  }

  donation.status = "Quality Check Pending";
  await donation.save({ validateBeforeSave: false });

  await NGO.findByIdAndUpdate(donation.ngo, {
          $pull: { pendingFoodDonations: donation._id },
          $push: { foodCollected: donation._id },
        });

  const delivery = await Delivery.findOne({
      foodDonation: donationId,
      phase: "Collection"
  });

  if (delivery) {
      delivery.status = "Completed";
      await delivery.save({ validateBeforeSave: false });
  }

  return res.status(200).json(
      new ApiResponse(200, { donation, delivery }, "Collection marked as complete.")
  );
});

const markDistributionAsComplete = asyncHandler(async (req, res) => {
  const { donationId } = req.body;

  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");

  if (donation.status !== "Quality Check Pending") {
      throw new ApiError(400, "Invalid status. Distribution cannot be marked complete.");
  }

  donation.status = "Distributed to Needy";
  await donation.save({ validateBeforeSave: false });

  await NGO.findByIdAndUpdate(donation.ngo, {
          $pull: { foodCollected: donation._id },
          $push: { distributedFood: donation._id },
      });
    
  await Volunteer.findByIdAndUpdate(donation.volunteer,{
          $pull: { pendingFoodDonations: donation._id},
          $push: { completedFoodDonations: donation._id}
      });
  
  const delivery = await Delivery.findOne({
      foodDonation: donationId,
      phase: "Distribution"
  });

  if (delivery) {
      delivery.status = "Completed";
      await delivery.save({ validateBeforeSave: false });
  }

  return res.status(200).json(
      new ApiResponse(200, { donation, delivery }, "Distribution marked as complete.")
  );
});

const getUnassignedDeliveryAgents = asyncHandler(async (req, res) => {
  const agents = await DeliveryAgent.find({
    $or: [
      { assignedNGO: { $exists: false } },
      { assignedNGO: null }
    ]
  })
  .select("-password -refreshToken")
  .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, agents, "Unassigned delivery agents fetched successfully!")
  );
});

const getHiredAgents = asyncHandler(async (req, res) => {
  // must be set by verifyJwt
  const ngoId = req.user?.userId;
  if (!ngoId) {
    throw new ApiError(401, "Unauthorized");
  }

  const ngo = await NGO.findById(ngoId)
    .select("deliveryAgents")
    .populate("deliveryAgents", "-password -refreshToken -__v");

  if (!ngo) {
    throw new ApiError(404, "NGO not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ngo.deliveryAgents || [], "Hired agents fetched"));
});

// export const markDeliveryAsDelivered = asyncHandler(async (req, res) => {
//   const { deliveryId } = req.params;

//   const delivery = await Delivery.findById(deliveryId);
//   if (!delivery) throw new ApiError(404, "Delivery not found");

//   // Ensure only the assigned delivery agent can confirm delivery
//   if (!delivery.deliveryAgent.equals(req.user.userId)) {
//     throw new ApiError(403, "You are not authorized to update this delivery");
//   }

//   // Update delivery status
//   delivery.status = "Delivered";
//   await delivery.save();

//   // Only proceed if it's a Distribution phase delivery
//   if (delivery.phase === "Distribution") {
//     const donation = await FoodDonation.findById(delivery.foodDonation);
//     if (donation) {
//       donation.status = "Distributed to Needy";
//       await donation.save({ validateBeforeSave: false });

//       // Update NGO's food tracking
//       await NGO.findByIdAndUpdate(donation.ngo, {
//         $push: { distributedFood: donation._id },
//         $pull: { foodCollected: donation._id },
//       });

//       // Update Volunteer record
//       await Volunteer.findByIdAndUpdate(donation.volunteer, {
//         $pull: { pendingFoodDonations: donation._id },
//         $push: { completedFoodDonations: donation._id },
//       });
//     }
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, delivery, "Delivery marked as delivered"));
// });

export {getUnassignedDeliveryAgents,getHiredAgents,markDistributionAsComplete,markCollectionAsComplete,getMyDeliveries,deleteDeliveryAgent,updateDeliveryAgentAvatar,updateDeliveryAgentProfile,changeCurrentDeliveryAgentPassword,getDeliveryAgentProfile,getDeliveryAgentById,getAllDeliveryAgents}