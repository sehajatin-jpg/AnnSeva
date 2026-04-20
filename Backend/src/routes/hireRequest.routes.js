import express from "express";
import {
  createHireRequest,
  getAllHireRequests,
  getHireRequestsByNGO,
  getHireRequestsForDeliveryAgent,
  respondToHireRequest,
  deleteHireRequestByNGO,
} from "../controllers/hireRequest.controller.js";

import { verifyJwt, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ROUTES STRUCTURE:
 * POST   /hire-requests/                   → NGO sends hire request
 * GET    /hire-requests/                   → Admin (optional) view all requests
 * GET    /hire-requests/ngo                → Logged-in NGO fetches its sent requests
 * GET    /hire-requests/agent              → Logged-in Delivery Agent fetches received requests
 * PATCH  /hire-requests/:requestId/respond → Delivery Agent accepts/rejects a request
 * DELETE /hire-requests/:requestId         → NGO cancels pending request
 */

// ✅ NGO creates a hire request
router.post(
  "/",
  verifyJwt,
  authorizeRoles("NGO"),
  createHireRequest
);

// ✅ (Optional) Admin — get all hire requests
router.get(
  "/",
  verifyJwt,
  authorizeRoles("Admin", "NGO"), // Keep "Admin" if you have it
  getAllHireRequests
);

// ✅ NGO — get hire requests they sent
router.get(
  "/ngo",
  verifyJwt,
  authorizeRoles("NGO"),
  getHireRequestsByNGO
);

// ✅ Delivery Agent — get hire requests received
router.get(
  "/agent",
  verifyJwt,
  authorizeRoles("DeliveryAgent"),
  getHireRequestsForDeliveryAgent
);

// ✅ Delivery Agent — accept/reject a request
router.patch(
  "/:requestId/respond",
  verifyJwt,
  authorizeRoles("DeliveryAgent"),
  respondToHireRequest
);

// ✅ NGO — delete (cancel) a pending request
router.delete(
  "/:requestId",
  verifyJwt,
  authorizeRoles("NGO"),
  deleteHireRequestByNGO
);

export default router;
