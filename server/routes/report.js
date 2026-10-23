import { Router } from "express";
import { createReport, getReports } from "../controllers/reportController.js";
import { reportLimiter } from "../middleware/rateLimit.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getReports);
router.post("/", reportLimiter, optionalAuth, createReport);

export default router;