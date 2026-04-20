import {
    signupVolunteer,
    signupDeliveryAgent,
    signupNGO,
    login,
    logout,
    regenerateAccessFromRefresh,
  } from "../controllers/auth.controller.js";
  import express from "express";
  const router = express.Router();
  import { verifyJwt } from "../middlewares/auth.middleware.js";
  import { upload } from "../middlewares/multer.middleware.js";

router.post("/signup/volunteer",signupVolunteer)

router.post("/signup/ngo",
    upload.fields([
        {
            name:"verifiedNGO",
            maxCount:1
        },
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    signupNGO)

router.post("/signup/agent",
    upload.fields([
        {
            name:"drivingLisence",
            maxCount:1
        }
    ]),
    signupDeliveryAgent
)

router.post("/login",login)

router.post("/logout",verifyJwt,logout)

router.post("/refresh-token",regenerateAccessFromRefresh)

export default router;