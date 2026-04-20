// src/routes/deliveryAgent.routes.js
import express from "express";
import multer from "multer";
import { verifyJwt, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getAllDeliveryAgents,
  getDeliveryAgentById,
  getDeliveryAgentProfile,
  changeCurrentDeliveryAgentPassword,
  updateDeliveryAgentProfile,
  updateDeliveryAgentAvatar,
  deleteDeliveryAgent,
  getMyDeliveries,
  markCollectionAsComplete,
  markDistributionAsComplete,
  getUnassignedDeliveryAgents,
  getHiredAgents,
} from "../controllers/deliveryAgent.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ---------- Public endpoints ---------- */

// Keep static routes FIRST so they aren't captured by :id
router.get("/unassigned", getUnassignedDeliveryAgents);
router.get("/hired-agents", verifyJwt, authorizeRoles("NGO"), getHiredAgents);
router.get("/", getAllDeliveryAgents);

// Parameter route LAST (no inline regex; validate in controller)
router.get("/:id", getDeliveryAgentById);

/* ---------- Auth: DeliveryAgent-only ---------- */
router.get("/me/profile", verifyJwt, authorizeRoles("DeliveryAgent"), getDeliveryAgentProfile);
router.patch("/me/password", verifyJwt, authorizeRoles("DeliveryAgent"), changeCurrentDeliveryAgentPassword);
router.patch("/me", verifyJwt, authorizeRoles("DeliveryAgent"), updateDeliveryAgentProfile);
router.patch("/me/avatar", verifyJwt, authorizeRoles("DeliveryAgent"), upload.single("avatar"), updateDeliveryAgentAvatar);
router.delete("/me", verifyJwt, authorizeRoles("DeliveryAgent"), deleteDeliveryAgent);

router.get("/me/deliveries", verifyJwt, authorizeRoles("DeliveryAgent"), getMyDeliveries);
router.post("/collection-complete", verifyJwt, authorizeRoles("DeliveryAgent"), markCollectionAsComplete);
router.post("/distribution-complete", verifyJwt, authorizeRoles("DeliveryAgent"), markDistributionAsComplete);

export default router;