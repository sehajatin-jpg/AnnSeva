import express from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {
  getAllNGOs,
  getNGOProfile,
  getNGOById,
  changeCurrentNGOPassword,
  updateNGOProfile,
  updateNGOAvatar,
  deleteNGO,
  // getAllVolunteersUnderNGO,
  getAllDeliveryAgentsUnderNGO,
  getAllFoodDonations,
  // addVolunteerToNGO,
  // hireDeliveryAgent,
  getAllNGOIdsAndNames,
  getPendingDonationsForNGO,
  getCollectedDonationsForNGO,
  getDistributedDonationsForNGO,
  getRejectedDonations
} from "../controllers/ngo.controller.js";

import { verifyJwt, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllNGOs);
router.get("/all",getAllNGOIdsAndNames)


router.use(verifyJwt, authorizeRoles("NGO"));

router.get("/profile/me", getNGOProfile);
router.post("/change-password", changeCurrentNGOPassword);
router.put("/update", updateNGOProfile);
router.put("/update-avatar", upload.single("avatar"), updateNGOAvatar);
router.delete("/delete", deleteNGO);

// router.get("/volunteers/all", getAllVolunteersUnderNGO);
router.get(
  "/rejected-donations",
  verifyJwt,
  authorizeRoles("NGO"),
  getRejectedDonations
);
router.get("/delivery-agents/all", getAllDeliveryAgentsUnderNGO);
router.get("/food-donations/all", getAllFoodDonations);
router.get("/pending-donations",verifyJwt,authorizeRoles("NGO"),getPendingDonationsForNGO);
router.get("/collected-donations",verifyJwt,authorizeRoles("NGO"),getCollectedDonationsForNGO);
router.get("/distributed-donations",verifyJwt,authorizeRoles("NGO"),getDistributedDonationsForNGO);
router.get("/:id", getNGOById);


// router.post("/volunteers/add", addVolunteerToNGO);
// router.post("/delivery-agents/hire", hireDeliveryAgent);

export default router;
