import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import { checkRole } from "../../middlewares/roleCheck.js"
import {
  getCurrentUserFilingSteps,
  getUserFilingSteps,
  getAllUsersFilingSteps,
  getDetailedFilingSteps,
  updateFilingStatus,
  resumeFiling,
} from "../../controllers/Filing/filingSteps.controller.js"

const router = express.Router()

// User Routes (require authentication)
router.use(verifyUser)

// GET /api/filing-steps/my-progress - Get current user's filing steps progress (token-based)
router.get("/my-progress", getCurrentUserFilingSteps)

// GET /api/filing-steps/resume - Get current user's resume filing information (token-based)
router.get("/resume", resumeFiling)

// GET /api/filing-steps/user/:userId - Get specific user's filing steps progress
router.get("/user/:userId", getUserFilingSteps)

// Admin Routes (require admin/accountant role)
router.use(checkRole(["admin", "accountant"]))

// GET /api/filing-steps/admin/all - Get all users filing steps progress (Admin)
router.get("/admin/all", getAllUsersFilingSteps)

// GET /api/filing-steps/admin/user/:userId - Get detailed filing steps for admin
router.get("/admin/user/:userId", getDetailedFilingSteps)

// PUT /api/filing-steps/admin/user/:userId/status - Update filing status (Admin)
router.put("/admin/user/:userId/status", updateFilingStatus)

export default router
