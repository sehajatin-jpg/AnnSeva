import express from "express";
import {
  getAllFoodDonations,
  getFoodDonationById,
  createFoodDonation,
  deleteFoodDonation,
  qualityCheckDonation
  // assignCollectionAgent,
  // confirmFoodCollected,
  // assignDistributionAgent,
//   confirmFoodDistributed,
} from "../controllers/foodDonation.controller.js";
import { verifyJwt, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch(
  "/quality-check",
  verifyJwt,
  authorizeRoles("NGO"),
  qualityCheckDonation
);

router.get("/all", verifyJwt, authorizeRoles("NGO"), getAllFoodDonations);
router.get("/:id", verifyJwt, authorizeRoles("NGO","Volunteer"), getFoodDonationById);
router.delete("/delete//:id", verifyJwt, authorizeRoles("NGO"), deleteFoodDonation);


router.post("/", verifyJwt, authorizeRoles("Volunteer"), createFoodDonation);




// router.post("/assign-collection-agent", verifyJwt, authorizeRoles("NGO"), assignCollectionAgent);


// router.post("/confirm-collected", verifyJwt, authorizeRoles("NGO"), confirmFoodCollected);


// router.post("/assign-distribution-agent", verifyJwt, authorizeRoles("NGO"), assignDistributionAgent);


// router.post("/confirm-distributed", verifyJwt, authorizeRoles("deliveryAgent"), confirmFoodDistributed);

export default router;
