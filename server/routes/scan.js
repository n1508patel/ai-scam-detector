import { Router } from "express";
import { scanMessage, getHistory, deleteScan } from "../controllers/scanController.js";
import { scanLimiter } from "../middleware/rateLimit.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { getStats } from "../controllers/scanController.js";
const router = Router();

router.get("/history", protect, getHistory);
router.get("/stats", getStats);
router.delete("/:id", protect, deleteScan);
router.post("/", scanLimiter, optionalAuth, scanMessage);

export default router;