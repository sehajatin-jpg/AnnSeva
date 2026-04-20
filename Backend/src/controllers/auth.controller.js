import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Volunteer } from "../models/volunteer.model.js";
import { NGO } from "../models/NGO.model.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessRefreshToken = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens!!"
    );
  }
};

const signupVolunteer = asyncHandler(async (req, res) => {
  const { username, email, password, phone, address } = req.body;
  if (
    [username, email, password, phone, address].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All feilds are mandatory!");
  }

  const existingUser = await Volunteer.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exist!!");
  }

  // const avatarLocalPath = req.file?.avatar?.avatar[0]?.path
  // const avatar = await uploadOnCloudinary(avatarLocalPath)

  const newUser = await Volunteer.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    phone,
    address,
    // avatar:avatar?.url || "default-volunteer-avatar.png"
  });

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    newUser
  );

  const isProd = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProd, // false on localhost
    sameSite: isProd ? "none" : "lax", // if your frontend is on a different origin and you use HTTPS in prod
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: { ...newUser._doc, role: "Volunteer" },
          accessToken,
          refreshToken,
        },
        "User registered Successfully!!"
      )
    );
});

const signupNGO = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, ngoId } = req.body;
  if (
    [name, email, password, phone, address, ngoId].some(
      (feild) => feild?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All feilds are mandatory!");
  }

  const existingUser = await NGO.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "NGO with this email already exist!!");
  }

  const verifiedNGOLocalPath = req.files?.verifiedNGO?.[0]?.path;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!verifiedNGOLocalPath) {
    throw new ApiError(400, "NGO Verification is required!!");
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!!");
  }

  const verifiedNGO = await uploadOnCloudinary(verifiedNGOLocalPath);
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!verifiedNGO) {
    throw new ApiError(500, "Verification file failed to upload on cloudinary");
  }

  if (!avatar) {
    throw new ApiError(500, "Verification file failed to upload on cloudinary");
  }

  const newUser = await NGO.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    ngoId,
    address,
    verifiedNGO: verifiedNGO.url,
    avatar: avatar.url,
  });

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    newUser
  );

  const isProd = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProd, // false on localhost
    sameSite: isProd ? "none" : "lax", // if your frontend is on a different origin and you use HTTPS in prod
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: { ...newUser._doc, role: "NGO" }, accessToken, refreshToken },
        "NGO registered Successfully!!"
      )
    );
});

const signupDeliveryAgent = asyncHandler(async (req, res) => {
  const { username, email, password, phone, address, bio, drivingId } =
    req.body;
  if (
    [username, email, password, phone, address, bio, drivingId].some(
      (feild) => feild?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All feilds are mandatory!");
  }

  const existingUser = await DeliveryAgent.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exist!!");
  }

  const drivingLisenceLocalPath = req.files?.drivingLisence?.[0]?.path;

  // const avatarLocalPath = req.file?.avatar?.avatar[0]?.paths

  if (!drivingLisenceLocalPath) {
    throw new ApiError(400, "Driving License is required!!");
  }

  const drivingLisence = await uploadOnCloudinary(drivingLisenceLocalPath);
  // const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!drivingLisence) {
    throw new ApiError(500, "Driving Lisence failed to upload on cloudinary");
  }

  const newUser = await DeliveryAgent.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    bio: bio ? bio : "",
    drivingId,
    phone,
    address,
    drivingLisence: drivingLisence.url,
    // avatar:avatar?.url || "default-agent-avatar.png"
  });

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    newUser
  );

  const isProd = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProd, // false on localhost
    sameSite: isProd ? "none" : "lax", // if your frontend is on a different origin and you use HTTPS in prod
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: { ...newUser._doc, role: "DeliveryAgent" },
          accessToken,
          refreshToken,
        },
        "User registered Successfully!!"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required!");
  }

  // Find user by email across all roles
  let user = await Volunteer.findOne({ email });
  let role = "Volunteer";

  if (!user) {
    user = await NGO.findOne({ email });
    if (user) role = "NGO";
  }
  if (!user) {
    user = await DeliveryAgent.findOne({ email });
    if (user) role = "DeliveryAgent";
  }
  if (!user) {
    throw new ApiError(404, "User doesn't exist!!!");
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials!!!");
  }

  // Tokens & cookie options
  const { accessToken, refreshToken } = await generateAccessRefreshToken(user);
  const isProd = process.env.NODE_ENV === "production";
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,              // false on localhost (http)
    sameSite: isProd ? "none" : "lax",
  };

  // Prepare safe user payload
  const safeUser = {
    ...(user.toObject ? user.toObject() : user),
    role,
  };
  delete safeUser.password;
  delete safeUser.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOpts)
    .cookie("refreshToken", refreshToken, cookieOpts)
    .json(
      new ApiResponse(
        200,
        { user: safeUser, accessToken, refreshToken },
        "User Logged In SuccessFully!!"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  let user = await Volunteer.findById(req.user.userId);
  if (!user) user = await NGO.findById(req.user.userId);
  if (!user) user = await DeliveryAgent.findById(req.user.userId);
  if (!user) {
    throw new ApiError(401, "Unauthorized request!!");
  }

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  const isProd = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProd, // false on localhost
    sameSite: isProd ? "none" : "lax", // if your frontend is on a different origin and you use HTTPS in prod
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut Successfully!!"));
});

const regenerateAccessFromRefresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) {
    throw new ApiError(401, "Unauthorized request!");
  }

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  let user = await Volunteer.findById(decoded?._id);
  if (!user) user = await NGO.findById(decoded?._id);
  if (!user) user = await DeliveryAgent.findById(decoded?._id);
  if (!user) {
    throw new ApiError(403, "Invalid refresh token!!");
  }

  if (token !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used!!");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(user);

  const isProd = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProd, // false on localhost
    sameSite: isProd ? "none" : "lax", // if your frontend is on a different origin and you use HTTPS in prod
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access Token regenerated!!"
      )
    );
});

export {
  generateAccessRefreshToken,
  signupVolunteer,
  signupDeliveryAgent,
  signupNGO,
  login,
  logout,
  regenerateAccessFromRefresh,
};
