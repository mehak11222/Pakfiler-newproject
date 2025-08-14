import express from "express";
import {
  createUnifiedIncome,
  getUnifiedIncome,
} from "../../controllers/incomeDetails/incomeSummaryController.js";
import { verifyUser } from "../../middlewares/verifyUser.js";

const router = express.Router();

// Create unified income
router.post("/unified", verifyUser, createUnifiedIncome);

// Get unified income by userId and taxYear
router.get("/unified", verifyUser, getUnifiedIncome);

export default router;
