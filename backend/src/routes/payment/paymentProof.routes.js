import express from "express"
import { verifyUser } from "../../middlewares/verifyUser.js"
import { paymentUpload, handlePaymentUploadError } from "../../middlewares/paymentUpload.middleware.js"
import {
  uploadPaymentProof,
  getUserPaymentProofs,
  getPaymentProofById,
  deletePaymentProof,
} from "../../controllers/payment/paymentProof.controller.js"

const router = express.Router()

// Apply authentication middleware to all routes
router.use(verifyUser)

// POST /api/tax-filing/upload-payment-proof - Upload payment proof
router.post(
  "/upload-payment-proof",
  paymentUpload.array("paymentProofs", 5), // Accept up to 5 files with field name 'paymentProofs'
  handlePaymentUploadError,
  uploadPaymentProof,
)

// GET /api/tax-filing/payment-proofs - Get user's payment proofs with pagination and filtering
router.get("/payment-proofs", getUserPaymentProofs)

// GET /api/tax-filing/payment-proof/:id - Get single payment proof by ID
router.get("/payment-proof/:id", getPaymentProofById)

// DELETE /api/tax-filing/payment-proof/:id - Delete payment proof (only if pending)
router.delete("/payment-proof/:id", deletePaymentProof)

export default router
