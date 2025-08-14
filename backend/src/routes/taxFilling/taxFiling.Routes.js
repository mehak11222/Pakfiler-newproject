import express from "express"
import { getUserFilings, createFiling, getFilingById } from "../../controllers/TaxFiling/taxFiling.controller.js"

const router = express.Router()

// GET all filings for a user - matches frontend call pattern
router.get("/user/:userId", getUserFilings)

// GET a specific filing by ID
router.get("/:filingId", getFilingById)

// CREATE a new tax filing
router.post("/", createFiling)

export default router
