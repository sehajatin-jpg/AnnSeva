import { asyncHandler } from "../utils/asyncHandler.js";
import { Volunteer } from "../models/volunteer.model.js";
import { NGO } from "../models/NGO.model.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";
import { Delivery } from "../models/delivery.model.js";
import { FoodDonation } from "../models/foodDonation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const assignCollectionAgent = asyncHandler(async (req, res) => {
  const { donationId, agentId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(donationId) ||
    !mongoose.Types.ObjectId.isValid(agentId)
  ) {
    throw new ApiError(400, "Invalid donationId or agentId");
  }

  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");

  if (donation.status !== "Awaiting Collection") {
    throw new ApiError(400, "Invalid status for assigning collection agent");
  }

  const [ngo, volunteer, agent] = await Promise.all([
    NGO.findById(donation.ngo).select("_id address"),
    Volunteer.findById(donation.volunteer).select("_id address"),
    DeliveryAgent.findById(agentId).select("_id"),
  ]);

  if (!ngo) throw new ApiError(404, "NGO not found");
  if (!volunteer) throw new ApiError(404, "Volunteer not found");
  if (!agent) throw new ApiError(404, "Delivery Agent not found");

  // Update donation with routing hints (addresses) and assigned agent
  donation.collectionAgent = agentId;
  donation.pickupAddress = volunteer.address || donation.pickupAddress;
  donation.destinationAddress = ngo.address || donation.destinationAddress;
  await donation.save({ validateBeforeSave: false });

  // Create a Delivery in "Assigned" state. Agent will accept/reject from their dashboard.
  const newDelivery = await Delivery.create({
    deliveryAgent: agentId,
    ngo: ngo._id,
    volunteer: volunteer._id,
    foodDonation: donation._id,
    phase: "Collection",
    pickup: volunteer.address || "",
    destination: ngo.address || "",
    status: "Assigned", // <-- key change (was: In-Transit)
  });

  // Attach delivery to agent record (for quick lookups)
  await DeliveryAgent.findByIdAndUpdate(agentId, {
    $addToSet: { deliveries: newDelivery._id },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { donation, delivery: newDelivery },
        "Collection agent assigned. Awaiting agent response."
      )
    );
});

const assignDistributionAgent = asyncHandler(async (req, res) => {
  const { donationId, agentId, destinationAddress } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(donationId) ||
    !mongoose.Types.ObjectId.isValid(agentId)
  ) {
    throw new ApiError(400, "Invalid donationId or agentId");
  }
  if (!destinationAddress) {
    throw new ApiError(400, "Destination address is required");
  }

  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");

  if (donation.status !== "Approved for Distribution") {
    throw new ApiError(
      400,
      "Food must be collected before assigning distribution agent"
    );
  }

  const [ngo, agent] = await Promise.all([
    NGO.findById(donation.ngo).select("_id address"),
    DeliveryAgent.findById(agentId).select("_id"),
  ]);

  if (!ngo) throw new ApiError(404, "NGO not found");
  if (!agent) throw new ApiError(404, "Delivery Agent not found");

  // Update donation with routing hints (addresses) and assigned agent
  donation.distributionAgent = agentId;
  donation.pickupAddress = ngo.address || donation.pickupAddress;
  donation.destinationAddress = destinationAddress;
  await donation.save({ validateBeforeSave: false });

  // Create a Delivery in "Assigned" state. Agent will accept/reject from their dashboard.
  const newDelivery = await Delivery.create({
    deliveryAgent: agentId,
    ngo: ngo._id,
    volunteer: donation.volunteer, // still useful for final ledger updates
    foodDonation: donation._id,
    phase: "Distribution",
    pickup: ngo.address || "",
    destination: destinationAddress,
    status: "Assigned", // <-- key change (was: In-Transit)
  });

  await DeliveryAgent.findByIdAndUpdate(agentId, {
    $addToSet: { deliveries: newDelivery._id },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { donation, delivery: newDelivery },
        "Distribution agent assigned. Awaiting agent response."
      )
    );
});

const respondToAssignment = asyncHandler(async (req, res) => {
  const agentId = req.user.userId; // must be DeliveryAgent
  const { id } = req.params;
  const { decision, reason, estimatedTime } = req.body;

  const delivery = await Delivery.findById(id);
  if (!delivery) throw new ApiError(404, "Delivery not found");

  if (!delivery.deliveryAgent.equals(agentId)) {
    throw new ApiError(403, "Not your assignment");
  }
  if (delivery.status !== "Assigned") {
    throw new ApiError(400, "This delivery is not awaiting response");
  }

  if (decision === "accept") {
    delivery.status = "Accepted";
    delivery.acceptedAt = new Date();
    await delivery.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, delivery, "Assignment accepted"));
  }

  if (decision === "reject") {
    delivery.status = "Rejected";
    delivery.rejectionReason = reason || "Not specified";
    delivery.rejectedAt = new Date();
    await delivery.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, delivery, "Assignment rejected"));
  }

  throw new ApiError(400, "decision must be 'accept' or 'reject'");
});

const startDelivery = asyncHandler(async (req, res) => {
  const agentId = req.user.userId;
  const { id } = req.params;
  const { estimatedTime } = req.body ?? {}; // <-- safe default

  const delivery = await Delivery.findById(id);
  if (!delivery) throw new ApiError(404, "Delivery not found");
  if (!delivery.deliveryAgent.equals(agentId)) throw new ApiError(403, "Not your delivery");

  if (delivery.status !== "Accepted") {
    throw new ApiError(400, "Delivery must be in 'Accepted' status to start");
  }

  delivery.status = "In-Transit";
  delivery.startedAt = new Date();
  if (estimatedTime) delivery.estimatedTime = new Date(estimatedTime);
  await delivery.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, delivery, "Delivery started"));
});


const completeDelivery = asyncHandler(async (req, res) => {
  const agentId = req.user.userId;
  const { id } = req.params;

  const delivery = await Delivery.findById(id);
  if (!delivery) throw new ApiError(404, "Delivery not found");
  if (!delivery.deliveryAgent.equals(agentId))
    throw new ApiError(403, "Not your delivery");
  if (delivery.status !== "In-Transit") {
    throw new ApiError(400, "Only in-transit deliveries can be completed");
  }

  delivery.status = "Delivered";
  delivery.deliveredAt = new Date();
  await delivery.save({ validateBeforeSave: false });

  // Update donation & ledgers (phase-aware)
  const donation = await FoodDonation.findById(delivery.foodDonation);
  if (donation) {
    if (delivery.phase === "Collection") {
  donation.status = "Quality Check Pending"; // 🆕
  donation.qualityStatus = "Pending";

  await donation.save({ validateBeforeSave: false });

  await NGO.findByIdAndUpdate(donation.ngo, {
    $pull: { pendingFoodDonations: donation._id },
    $push: { foodCollected: donation._id },
  });
} else if (delivery.phase === "Distribution") {
      // mirror your markDistributionAsComplete logic
      donation.status = "Distributed to Needy";
      await donation.save({ validateBeforeSave: false });

      await NGO.findByIdAndUpdate(donation.ngo, {
        $pull: { foodCollected: donation._id },
        $push: { distributedFood: donation._id },
      });

      await Volunteer.findByIdAndUpdate(donation.volunteer, {
        $pull: { pendingFoodDonations: donation._id },
        $push: { completedFoodDonations: donation._id },
      });
    }else if (delivery.phase === "Waste") {
  donation.status = "Sent to Biodegradable System";

  await donation.save({ validateBeforeSave: false });

  await NGO.findByIdAndUpdate(donation.ngo, {
    $pull: { foodCollected: donation._id },
  });
}
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { delivery, donation },
        "Delivery marked as delivered"
      )
    );
});

const reassignDelivery = asyncHandler(async (req, res) => {
  const ngoId = req.user.userId; // must be NGO
  const { id } = req.params;     // deliveryId
  const { deliveryAgent: newAgentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(newAgentId)) {
    throw new ApiError(400, "Invalid deliveryId or deliveryAgent");
  }

  const delivery = await Delivery.findById(id);
  if (!delivery) throw new ApiError(404, "Delivery not found");
  if (!delivery.ngo.equals(ngoId)) throw new ApiError(403, "Not your NGO's delivery");

  // Disallow reassign in terminal states
  if (["Delivered", "Cancelled"].includes(delivery.status)) {
    throw new ApiError(400, `Cannot reassign a ${delivery.status.toLowerCase()} delivery`);
  }

  // Validate new agent
  const newAgent = await DeliveryAgent.findById(newAgentId).select("_id");
  if (!newAgent) throw new ApiError(404, "New delivery agent not found");

  const oldAgentId = delivery.deliveryAgent?.toString();
  if (oldAgentId === newAgentId) {
    return res
      .status(200)
      .json(new ApiResponse(200, delivery, "Delivery already assigned to this agent"));
  }

  // Reassign agent
  delivery.deliveryAgent = newAgentId;

  // Reset workflow fields so the new agent can respond
  delivery.status = "Assigned";
  delivery.rejectionReason = undefined;
  delivery.acceptedAt = undefined;
  delivery.rejectedAt = undefined;
  delivery.startedAt = undefined;
  delivery.deliveredAt = undefined;
  delivery.estimatedTime = undefined;

  await delivery.save({ validateBeforeSave: false });

  // Update agents' delivery arrays (optional but useful for quick lookups)
  if (oldAgentId) {
    await DeliveryAgent.findByIdAndUpdate(oldAgentId, { $pull: { deliveries: delivery._id } });
  }
  await DeliveryAgent.findByIdAndUpdate(newAgentId, { $addToSet: { deliveries: delivery._id } });

  return res.status(200).json(new ApiResponse(200, delivery, "Delivery reassigned"));
});

const cancelDelivery = asyncHandler(async (req, res) => {
  const ngoId = req.user.userId;
  const { id } = req.params;

  const delivery = await Delivery.findById(id);
  if (!delivery) throw new ApiError(404, "Delivery not found");
  if (!delivery.ngo.equals(ngoId))
    throw new ApiError(403, "Not your NGO's delivery");

  delivery.status = "Cancelled";
  await delivery.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, delivery, "Delivery cancelled"));
});

const assignWasteAgent = asyncHandler(async (req, res) => {
  const { donationId, agentId, wasteDestination } = req.body;

  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");

  if (donation.qualityStatus !== "Rejected") {
    throw new ApiError(400, "Only rejected food can be sent to waste");
  }

  const ngo = await NGO.findById(donation.ngo);

  donation.wasteAgent = agentId;
  donation.destinationAddress = wasteDestination;

  await donation.save({ validateBeforeSave: false });

  const delivery = await Delivery.create({
    deliveryAgent: agentId,
    ngo: ngo._id,
    foodDonation: donation._id,
    phase: "Waste", // 🆕
    pickup: ngo.address,
    destination: wasteDestination,
    status: "Assigned"
  });

  await DeliveryAgent.findByIdAndUpdate(agentId, {
    $addToSet: { deliveries: delivery._id },
  });

  return res.status(200).json(
    new ApiResponse(200, delivery, "Waste delivery assigned")
  );
});

export {
  assignCollectionAgent,
  assignDistributionAgent,
  respondToAssignment,
  startDelivery,
  completeDelivery,
  reassignDelivery,
  cancelDelivery,
  assignWasteAgent
};
