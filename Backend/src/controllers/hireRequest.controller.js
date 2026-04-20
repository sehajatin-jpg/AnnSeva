import { HireRequest } from "../models/hireRequest.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { NGO } from "../models/NGO.model.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";

const createHireRequest = asyncHandler(async (req, res) => {
    const { deliveryAgent, salary, message } = req.body;
    const ngoId = req.user.userId; // assuming NGO is logged in
  
    // Check if a request already exists
    const existing = await HireRequest.findOne({ ngo: ngoId, deliveryAgent });
    if (existing) {
      throw new ApiError(400, "Hire request already sent to this delivery agent.");
    }
  
    const hireRequest = await HireRequest.create({
      ngo: ngoId,
      deliveryAgent,
      salary,
      message
    });
  
    return res.status(201).json(
      new ApiResponse(201, hireRequest, "Hire request sent successfully.")
    );
});

const getAllHireRequests = asyncHandler(async (req, res) => {
    const requests = await HireRequest.find()
      .populate("ngo", "ngoName email")
      .populate("deliveryAgent", "name email")
      .sort({ createdAt: -1 });
  
    return res.status(200).json(
      new ApiResponse(200, requests, "All hire requests fetched.")
    );
});

const getHireRequestsByNGO = asyncHandler(async (req, res) => {
    const ngoId = req.user._id;
  
    const requests = await HireRequest.find({ ngo: ngoId })
      .populate("deliveryAgent", "name email address drivingIdPhoto photo")
      .sort({ createdAt: -1 });
  
    return res.status(200).json(
      new ApiResponse(200, requests, "Hire requests sent by NGO.")
    );
});
  
const getHireRequestsForDeliveryAgent = asyncHandler(async (req, res) => {
    const agentId = req.user.userId;
  
    const requests = await HireRequest.find({ deliveryAgent: agentId })
      .populate("ngo", "ngoName email address")
      .sort({ createdAt: -1 });
  
    return res.status(200).json(
      new ApiResponse(200, requests, "Hire requests received by delivery agent.")
    );
});

const respondToHireRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  const agentId = req.user?.userId; // set by verifyJwt (role: DeliveryAgent)

  if (!agentId) throw new ApiError(401, "Unauthorized");
  if (!["Accepted", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be Accepted or Rejected.");
  }
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(400, "Invalid request id");
  }

  // Find the request and ensure it targets this agent
  const request = await HireRequest.findById(requestId);
  if (!request || request.deliveryAgent.toString() !== agentId.toString()) {
    throw new ApiError(404, "Hire request not found or unauthorized.");
  }

  // Update status
  request.status = status;
  await request.save();

  // If accepted: attach agent <-> NGO
  if (status === "Accepted") {
    const ngoId = request.ngo;

    // Add agent to NGO list (no duplicates)
    await NGO.findByIdAndUpdate(
      ngoId,
      { $addToSet: { deliveryAgents: agentId } },
      { new: true }
    );

    // Mark agent as assigned to this NGO
    await DeliveryAgent.findByIdAndUpdate(
      agentId,
      { $set: { assignedNGO: ngoId } },
      { new: true }
    );

    // Optional: auto-reject other pending requests for this agent
    // await HireRequest.updateMany(
    //   { deliveryAgent: agentId, status: "Pending", _id: { $ne: requestId } },
    //   { $set: { status: "Rejected" } }
    // );
  }

  // Return populated request for UI
  const populated = await HireRequest.findById(requestId)
    .populate("ngo", "name ngoName email address")
    .populate("deliveryAgent", "username email assignedNGO");

  return res
    .status(200)
    .json(new ApiResponse(200, populated, `Hire request ${status.toLowerCase()} successfully.`));
});
  
const deleteHireRequestByNGO = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const ngoId = req.user._id;
  
    const request = await HireRequest.findOneAndDelete({
      _id: requestId,
      ngo: ngoId,
      status: "Pending"
    });
  
    if (!request) {
      throw new ApiError(404, "Pending hire request not found or cannot be deleted.");
    }
  
    return res.status(200).json(
      new ApiResponse(200, request, "Hire request cancelled successfully.")
    );
});

export {createHireRequest,deleteHireRequestByNGO,respondToHireRequest,getHireRequestsForDeliveryAgent,getHireRequestsByNGO,getAllHireRequests}