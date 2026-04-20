// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Volunteer } from "../models/volunteer.model.js";
import { NGO } from "../models/NGO.model.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  // 1) Read token from cookie or Authorization header
  const rawAuth = req.header("Authorization") || "";
  const bearer = rawAuth.startsWith("Bearer ") ? rawAuth.slice(7) : null;
  const token = req.cookies?.accessToken || bearer;

  if (!token) {
    throw new ApiError(401, "Unauthorized: missing token");
  }

  // 2) Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (e) {
    throw new ApiError(401, "Unauthorized: invalid token");
  }

  // 3) Load user by decoded _id (your tokens use `_id`)
  const id = decoded?._id;
  if (!id) {
    throw new ApiError(401, "Unauthorized: malformed token payload");
  }

  let user =
    (await Volunteer.findById(id)) ||
    (await NGO.findById(id)) ||
    (await DeliveryAgent.findById(id));

  if (!user) {
    throw new ApiError(401, "Unauthorized: user not found");
  }

  // 4) Attach stable fields for downstream
  req.user = {
    userId: user._id.toString(),
    role: decoded.role, // your access token includes role:"NGO" for NGOs
  };

  // Optional debug (remove after confirming):

  next();
});

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, "Access denied. You do not have permission.");
  }
  next();
};
