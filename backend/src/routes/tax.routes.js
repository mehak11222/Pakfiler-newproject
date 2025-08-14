import express from "express";
import { submitTax, getTaxHistory } from "../controllers/tax.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// These will now be /api/tax-filing/submit and /api/tax-filing/history
router.post("/submit", verifyUser, submitTax);
router.get("/history", verifyUser, getTaxHistory);
export default router;
