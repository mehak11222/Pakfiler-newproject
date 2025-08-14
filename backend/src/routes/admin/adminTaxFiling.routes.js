import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import { checkRole } from "../../middlewares/roleCheck.js"
import {
  getAllTaxFilings,
  getTaxFilingById,
  updateTaxFilingStatus,
  getTaxFilingStats,
  bulkUpdateTaxFilingStatus,
} from "../../controllers/admin/adminTaxFiling.controller.js"

const router = express.Router()

// Apply authentication and admin role check
router.use(verifyUser)
router.use(checkRole(["admin", "accountant"]))

// GET /api/admin/tax-filings - Get all tax filings with filtering and pagination
router.get("/", getAllTaxFilings)

// GET /api/admin/tax-filings/stats - Get tax filing statistics
router.get("/stats", getTaxFilingStats)

// GET /api/admin/tax-filings/:id - Get single tax filing details
router.get("/:id", getTaxFilingById)

// PUT /api/admin/tax-filings/:id/status - Update tax filing status
router.put("/:id/status", updateTaxFilingStatus)

// PUT /api/admin/tax-filings/bulk/status - Bulk update tax filing status
router.put("/bulk/status", bulkUpdateTaxFilingStatus)

export default router
