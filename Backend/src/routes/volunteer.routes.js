import express from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {
  getAllVolunteers,
  getVolunteerProfile,
  getVolunteerById,
  changeCurrentVolunteerPassword,
  updateVolunteerProfile,
  updateVolunteerAvatar,
  deleteVolunteer,
  getCompletedFoodDonations,
  getPendingFoodDonations,
} from "../controllers/volunteer.controller.js";
import { verifyJwt, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJwt, authorizeRoles("NGO"), getAllVolunteers);

router.get("/:id", verifyJwt, authorizeRoles("NGO"), getVolunteerById);

router.use(verifyJwt, authorizeRoles("Volunteer"));

router.get("/me/profile", getVolunteerProfile);
router.post("/me/change-password", changeCurrentVolunteerPassword);
router.put("/me/update", updateVolunteerProfile);
router.post("/me/avatar", upload.single("avatar"), updateVolunteerAvatar);
router.delete("/me", deleteVolunteer);

router.get("/me/pending-donations", getPendingFoodDonations);
router.get("/me/completed-donations", getCompletedFoodDonations);

export default router;
