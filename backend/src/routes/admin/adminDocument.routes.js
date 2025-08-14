import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import { checkRole } from "../../middlewares/roleCheck.js"
import {
  getAllUserDocuments,
  // getDocumentsByUserId,
  updateDocumentStatus,
  getAdminDashboardStats,
  getTaxFilingDetails,
  generateDocumentReport,
  getUploadTimeline,
  getDocumentsByStatus,
} from "../../controllers/admin/adminDocument.controller.js"

const router = express.Router()

// All routes require authentication
router.use(verifyUser)
router.use(checkRole(["admin", "accountant"]))

// GET /api/admin/documents - Get all documents with enhanced filtering
router.get("/", getAllUserDocuments)

// GET /api/admin/documents/dashboard - Get comprehensive dashboard statistics
router.get("/dashboard", getAdminDashboardStats)

// GET /api/admin/documents/tax-filings - Get tax filing details with document integration
router.get("/tax-filings", getTaxFilingDetails)

// GET /api/admin/documents/report - Generate and download PDF report
router.get("/report", generateDocumentReport)

// GET /api/admin/documents/timeline - Get upload timeline
router.get("/timeline", getUploadTimeline)

// GET /api/admin/documents/status/:status - Get documents by specific status
router.get("/status/:status", getDocumentsByStatus)

// GET /api/admin/documents/user/:userId - Get all documents for a specific user
// router.get("/user/:userId", getDocumentsByUserId)

// PATCH /api/admin/documents/:documentId/status - Update document status
router.patch("/:documentId/status", updateDocumentStatus)

export default router