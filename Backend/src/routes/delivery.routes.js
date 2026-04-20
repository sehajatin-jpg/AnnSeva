// routes/delivery.routes.js
import { Router } from "express";
import { verifyJwt, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  assignCollectionAgent,
  assignDistributionAgent,
  respondToAssignment,
  startDelivery,
  completeDelivery,
  reassignDelivery,
  cancelDelivery,
  assignWasteAgent
} from "../controllers/delivery.controller.js";

const router = Router();

// All routes require a valid JWT
router.use(verifyJwt);

/**
 * NGO: assign agents
 */
router.post(
  "/assign/collection",
  authorizeRoles("NGO"),
  assignCollectionAgent
);

router.post(
  "/assign/distribution",
  authorizeRoles("NGO"),
  assignDistributionAgent
);

/**
 * DeliveryAgent: respond to assignment (accept / reject)
 * :id is the deliveryId
 */
router.post(
  "/:id/respond",
  authorizeRoles("DeliveryAgent"),
  respondToAssignment
);

/**
 * DeliveryAgent: start an accepted delivery (moves to In-Transit)
 */
router.post(
  "/:id/start",
  authorizeRoles("DeliveryAgent"),
  startDelivery
);

/**
 * DeliveryAgent: complete an in-transit delivery (marks Delivered + updates ledgers)
 */
router.post(
  "/:id/deliver",
  authorizeRoles("DeliveryAgent"),
  completeDelivery
);

/**
 * NGO: reassign/cancel
 */
router.post(
  "/:id/reassign",
  authorizeRoles("NGO"),
  reassignDelivery
);

router.post(
  "/:id/cancel",
  authorizeRoles("NGO"),
  cancelDelivery
);

router.post(
  "/assign-waste-agent",
  verifyJwt,
  authorizeRoles("NGO"),
  assignWasteAgent
);

export default router;
