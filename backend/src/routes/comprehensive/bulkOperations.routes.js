import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import { checkRole } from "../../middlewares/roleCheck.js"
import {
  bulkCreateRecords,
  bulkUpdateRecords,
  bulkDeleteRecords,
  getDataStatistics,
} from "../../controllers/comprehensive/bulkOperations.controller.js"

const router = express.Router()

// Apply authentication middleware
router.use(verifyUser)

// POST /api/comprehensive/bulk/create - Bulk create records
router.post("/create", bulkCreateRecords)

// PUT /api/comprehensive/bulk/update - Bulk update records
router.put("/update", bulkUpdateRecords)

// DELETE /api/comprehensive/bulk/delete - Bulk delete records (admin only)
router.delete("/delete", checkRole(["admin"]), bulkDeleteRecords)

// GET /api/comprehensive/bulk/statistics - Get data statistics
router.get("/statistics", getDataStatistics)

export default router
