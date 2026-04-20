import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FoodDonation } from "../models/foodDonation.model.js";
import { NGO } from "../models/NGO.model.js";
import { Volunteer } from "../models/volunteer.model.js";
import mongoose from "mongoose";

const getAllFoodDonations = asyncHandler(async (req, res) => {
  const donations = await FoodDonation.find()
    .populate("volunteer", "username email")
    .populate("ngo", "name email")
    .populate("collectionAgent", "username")
    .populate("distributionAgent", "username")
    .populate("deliveries", "status pickup destination");

  return res
    .status(200)
    .json(new ApiResponse(200, donations, "All Food Donations fetched"));
});

const getFoodDonationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Food Id!");
  }

  const donation = await FoodDonation.findById(id)
    .populate("volunteer", "username email")
    .populate("ngo", "name email")
    .populate("collectionAgent", "username")
    .populate("distributionAgent", "username")
    .populate("deliveries", "status pickup destination");

  if (!donation) {
    throw new ApiError(404, "Donation not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation fetched successfully"));
});

const createFoodDonation = asyncHandler(async (req, res) => {
  const { foodType, quantity, description, ngoId } = req.body;
  const volunteerId = req.user.userId;
  if (!foodType || !quantity) {
    throw new ApiError(400, "Please provide all the details!");
  }
  const volunteer = await Volunteer.findById(volunteerId);
  const ngo = await NGO.findById(ngoId);

  const newDonation = await FoodDonation.create({
    foodType,
    quantity,
    description: description ? description : "",
    volunteer: volunteerId,
    ngo: ngoId,
    status: "Awaiting Collection",
  });

  await Volunteer.findByIdAndUpdate(volunteerId, {
    $push: { pendingFoodDonations: newDonation._id },
  });

  await NGO.findByIdAndUpdate(ngoId, {
    $push: { pendingFoodDonations: newDonation._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newDonation, "Food Donation Created!"));
});

const deleteFoodDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Food Id!");
  }

  const donation = await FoodDonation.findByIdAndDelete(id);
  if (!donation) throw new ApiError(404, "Donation not found");

  await Volunteer.findByIdAndUpdate(donation.volunteer, {
    $pull: {
      pendingFoodDonations: donation._id,
      completedFoodDonations: donation._id,
    },
  });

  await NGO.findByIdAndUpdate(donation.ngo, {
    $pull: {
      pendingFoodDonations: donation._id,
      foodCollected: donation._id,
      distributedFood: donation._id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation deleted"));
});

const qualityCheckDonation = asyncHandler(async (req, res) => {
  const { donationId, decision, wasteDestination } = req.body;
  const ngoId = req.user.userId;

  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");

  if (donation.status !== "Quality Check Pending") {
    throw new ApiError(400, "Invalid state for quality check");
  }

  if (decision === "approve") {
    donation.qualityStatus = "Approved";
    donation.status = "Approved for Distribution";
  } else if (decision === "reject") {
    donation.qualityStatus = "Rejected";
    donation.status = "Rejected - Waste";
    donation.wasteDestination = wasteDestination;
  } else {
    throw new ApiError(400, "Invalid decision");
  }

  donation.qualityCheckedBy = ngoId;
  donation.qualityCheckedAt = new Date();

  await donation.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, donation, "Quality check completed"));
});

// const updateFoodDonationStatus = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         throw new ApiError(400,"Invalid Food Id!")
//     }

//     const donation = await FoodDonation.findById(id);
//     if (!donation) throw new ApiError(404, "Donation not found");

//     donation.status = status;
//     await donation.save({validateBeforeSave:false});

//     return res.status(200).json(
//       new ApiResponse(200, donation, "Donation status updated")
//     );
// });

// const assignCollectionAgent = asyncHandler(async (req, res) => {
//     const { donationId, agentId } = req.body;

//     const donation = await FoodDonation.findById(donationId);
//     if (!donation) throw new ApiError(404, "Donation not found");

//     if (donation.status !== "Awaiting Collection") {
//         throw new ApiError(400, "Invalid status for assigning collection agent");
//     }

//     const ngo = await NGO.findById(donation.ngo);
//     const volunteer = await Volunteer.findById(donation.volunteer);

//     donation.collectionAgent = agentId;
//     donation.destinationAddress = ngo?.address;
//     donation.pickupAddress = volunteer?.address;
//     await donation.save({ validateBeforeSave: false });

//     return res.status(200).json(
//       new ApiResponse(200, {
//         donation,
//         destinationAddress: donation.destinationAddress,
//         pickupAddress: donation.pickupAddress
//       }, "Collection agent assigned successfully!")
//     );

// });

// const confirmFoodCollected = asyncHandler(async (req, res) => {
//     const { donationId } = req.body;

//     const donation = await FoodDonation.findById(donationId);
//     if (!donation) throw new ApiError(404, "Donation not found");

//     if (!donation.collectionAgent) {
//       throw new ApiError(400, "Collection agent must be assigned first");
//     }

//     donation.status = "Collected by NGO";
//     await donation.save({ validateBeforeSave: false });

//     await NGO.findByIdAndUpdate(donation.ngo, {
//       $pull: { pendingFoodDonations: donation._id },
//       $push: { foodCollected: donation._id },
//     });

//     return res.status(200).json(
//       new ApiResponse(200, donation, "Food marked as collected")
//     );
// });

// const assignDistributionAgent = asyncHandler(async (req, res) => {
//   const { donationId, agentId, destinationAddress } = req.body;

//   if (!destinationAddress) {
//       throw new ApiError(400, "Destination address is required");
//   }

//   const donation = await FoodDonation.findById(donationId);
//   if (!donation) throw new ApiError(404, "Donation not found");

//   if (donation.status !== "Collected by NGO") {
//       throw new ApiError(400, "Food must be collected before assigning distribution agent");
//   }

//   const ngo = await NGO.findById(donation.ngo);
//   if (!ngo) {
//       throw new ApiError(500, "NGO not found");
//   }

//   donation.distributionAgent = agentId;
//   donation.destinationAddress = destinationAddress;  // From req.body
//   donation.pickupAddress = ngo?.address;    // Static from NGO

//   await donation.save({ validateBeforeSave: false });

//   return res.status(200).json(
//       new ApiResponse(200, {donation,pickupAddress: donation.pickupAddress,
//         donorAddress: donation.donorAddress}, "Distribution agent assigned successfully")
//   );
// });

// const confirmFoodDistributed = asyncHandler(async (req, res) => {
//     const { donationId } = req.body;

//     const donation = await FoodDonation.findById(donationId);
//     if (!donation) throw new ApiError(404, "Donation not found");

//     if (!donation.distributionAgent) {
//       throw new ApiError(400, "Distribution agent must be assigned first");
//     }

//     donation.status = "Distributed to Needy";
//     await donation.save({ validateBeforeSave: false });

//     await NGO.findByIdAndUpdate(donation.ngo, {
//       $pull: { foodCollected: donation._id },
//       $push: { distributedFood: donation._id },
//     });

//     await Volunteer.findByIdAndUpdate(donation.volunteer,{
//         $pull: { pendingFoodDonations: donation._id},
//         $push: { completedFoodDonations: donation._id}
//     });

//     return res.status(200).json(
//       new ApiResponse(200, donation, "Food marked as distributed")
//     );
// });

export {
  getAllFoodDonations,
  getFoodDonationById,
  createFoodDonation,
  deleteFoodDonation,
  qualityCheckDonation,
};
