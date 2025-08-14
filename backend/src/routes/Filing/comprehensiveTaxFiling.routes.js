import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import {
  submitComprehensiveTaxFiling,
  getCompleteTaxFilingData
} from "../../controllers/Filing/comprehensiveTaxFiling.controller.js"

const router = express.Router()

// Apply authentication middleware
router.use(verifyUser)

// POST /api/tax-filing/comprehensive/submit - Submit complete tax filing (all 12 steps + wrap-up + cart + checkout)
router.post("/submit", submitComprehensiveTaxFiling)

// GET /api/tax-filing/comprehensive/data - Get complete tax filing data
router.get("/data", getCompleteTaxFilingData)

export default router
