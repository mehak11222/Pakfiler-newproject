import mongoose from "mongoose"
import PaymentProof from "../../models/payment/paymentProof.model.js"
import TaxFiling from "../../models/TaxFiling/TaxFiling.js"
import path from "path"
import fs from "fs"

// Upload Payment Proof
export const uploadPaymentProof = async (req, res) => {
  try {
    const {
      taxFilingId,
      taxYear,
      paymentMethod,
      transactionId,
      paymentAmount,
      paymentDate,
      description,
      bankName,
      accountNumber,
    } = req.body

    const userId = req.user._id
    const uploadedFiles = req.files

    // Validation
    if (!taxYear) {
      return res.status(400).json({
        success: false,
        message: "Tax year is required",
      })
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one payment proof file is required",
      })
    }

    if (!paymentMethod || !paymentAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment method and amount are required",
      })
    }

    // Validate file types (images and PDFs only)
    const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf", ".gif"]
    const invalidFiles = uploadedFiles.filter((file) => {
      const ext = path.extname(file.originalname).toLowerCase()
      return !allowedTypes.includes(ext)
    })

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Only image files (JPG, PNG, GIF) and PDF files are allowed",
        invalidFiles: invalidFiles.map((f) => f.originalname),
      })
    }

    // Check if tax filing exists (optional)
    let taxFiling = null
    if (taxFilingId) {
      taxFiling = await TaxFiling.findOne({ _id: taxFilingId, userId })
      if (!taxFiling) {
        return res.status(404).json({
          success: false,
          message: "Tax filing not found",
        })
      }
    }

    // Process uploaded files
    const proofFiles = uploadedFiles.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    }))

    // Create payment proof record
    const paymentProof = new PaymentProof({
      userId,
      taxFilingId: taxFilingId || null,
      taxYear,
      paymentMethod,
      transactionId: transactionId || null,
      paymentAmount: Number.parseFloat(paymentAmount),
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      description: description || "",
      bankDetails: {
        bankName: bankName || "",
        accountNumber: accountNumber || "",
      },
      proofFiles,
      status: "pending", // pending, verified, rejected
      submittedAt: new Date(),
    })

    await paymentProof.save()

    // Update tax filing payment status if tax filing exists
    if (taxFiling) {
      taxFiling.payment = {
        ...taxFiling.payment,
        proofUploaded: true,
        proofUploadedAt: new Date(),
        paymentProofId: paymentProof._id,
      }
      await taxFiling.save()
    }

    // Populate user info for response
    await paymentProof.populate("userId", "fullName email cnic")

    return res.status(201).json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: {
        paymentProof: {
          id: paymentProof._id,
          userId: paymentProof.userId,
          taxFilingId: paymentProof.taxFilingId,
          taxYear: paymentProof.taxYear,
          paymentMethod: paymentProof.paymentMethod,
          transactionId: paymentProof.transactionId,
          paymentAmount: paymentProof.paymentAmount,
          paymentDate: paymentProof.paymentDate,
          description: paymentProof.description,
          bankDetails: paymentProof.bankDetails,
          status: paymentProof.status,
          submittedAt: paymentProof.submittedAt,
          filesCount: paymentProof.proofFiles.length,
          files: paymentProof.proofFiles.map((file) => ({
            originalName: file.originalName,
            fileName: file.fileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            uploadedAt: file.uploadedAt,
          })),
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error uploading payment proof:", error)

    // Clean up uploaded files if database operation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
      })
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload payment proof",
      error: error.message,
    })
  }
}

// Get Payment Proofs for User
export const getUserPaymentProofs = async (req, res) => {
  try {
    const { taxYear, status, page = 1, limit = 10 } = req.query
    const userId = req.user._id

    // Build query
    const query = { userId }
    if (taxYear) query.taxYear = taxYear
    if (status) query.status = status

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get payment proofs with pagination
    const paymentProofs = await PaymentProof.find(query)
      .populate("userId", "fullName email cnic")
      .populate("taxFilingId", "taxYear filingType status")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const totalCount = await PaymentProof.countDocuments(query)
    const totalPages = Math.ceil(totalCount / Number.parseInt(limit))

    // Calculate statistics
    const stats = await PaymentProof.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$paymentAmount" },
        },
      },
    ])

    const statistics = {
      total: totalCount,
      pending: 0,
      verified: 0,
      rejected: 0,
      totalAmount: 0,
    }

    stats.forEach((stat) => {
      statistics[stat._id] = stat.count
      statistics.totalAmount += stat.totalAmount
    })

    return res.status(200).json({
      success: true,
      message: "Payment proofs retrieved successfully",
      data: {
        paymentProofs: paymentProofs.map((proof) => ({
          id: proof._id,
          taxFilingId: proof.taxFilingId,
          taxYear: proof.taxYear,
          paymentMethod: proof.paymentMethod,
          transactionId: proof.transactionId,
          paymentAmount: proof.paymentAmount,
          paymentDate: proof.paymentDate,
          description: proof.description,
          bankDetails: proof.bankDetails,
          status: proof.status,
          submittedAt: proof.submittedAt,
          verifiedAt: proof.verifiedAt,
          rejectedAt: proof.rejectedAt,
          rejectionReason: proof.rejectionReason,
          filesCount: proof.proofFiles.length,
          files: proof.proofFiles.map((file) => ({
            originalName: file.originalName,
            fileName: file.fileName,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            uploadedAt: file.uploadedAt,
          })),
        })),
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: Number.parseInt(page) < totalPages,
          hasPrevPage: Number.parseInt(page) > 1,
        },
        statistics,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving payment proofs:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment proofs",
      error: error.message,
    })
  }
}

// Get Single Payment Proof
export const getPaymentProofById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment proof ID",
      })
    }

    const paymentProof = await PaymentProof.findOne({ _id: id, userId })
      .populate("userId", "fullName email cnic phone")
      .populate("taxFilingId", "taxYear filingType status")

    if (!paymentProof) {
      return res.status(404).json({
        success: false,
        message: "Payment proof not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Payment proof retrieved successfully",
      data: {
        paymentProof: {
          id: paymentProof._id,
          user: paymentProof.userId,
          taxFiling: paymentProof.taxFilingId,
          taxYear: paymentProof.taxYear,
          paymentMethod: paymentProof.paymentMethod,
          transactionId: paymentProof.transactionId,
          paymentAmount: paymentProof.paymentAmount,
          paymentDate: paymentProof.paymentDate,
          description: paymentProof.description,
          bankDetails: paymentProof.bankDetails,
          status: paymentProof.status,
          submittedAt: paymentProof.submittedAt,
          verifiedAt: paymentProof.verifiedAt,
          verifiedBy: paymentProof.verifiedBy,
          rejectedAt: paymentProof.rejectedAt,
          rejectedBy: paymentProof.rejectedBy,
          rejectionReason: paymentProof.rejectionReason,
          adminNotes: paymentProof.adminNotes,
          files: paymentProof.proofFiles.map((file) => ({
            originalName: file.originalName,
            fileName: file.fileName,
            filePath: file.filePath,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
            uploadedAt: file.uploadedAt,
          })),
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving payment proof:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment proof",
      error: error.message,
    })
  }
}

// Delete Payment Proof (only if pending)
export const deletePaymentProof = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment proof ID",
      })
    }

    const paymentProof = await PaymentProof.findOne({ _id: id, userId })

    if (!paymentProof) {
      return res.status(404).json({
        success: false,
        message: "Payment proof not found",
      })
    }

    // Only allow deletion if status is pending
    if (paymentProof.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot delete payment proof with status: ${paymentProof.status}`,
      })
    }

    // Delete associated files
    paymentProof.proofFiles.forEach((file) => {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath)
      }
    })

    // Delete the record
    await PaymentProof.findByIdAndDelete(id)

    // Update tax filing if associated
    if (paymentProof.taxFilingId) {
      await TaxFiling.findByIdAndUpdate(paymentProof.taxFilingId, {
        $unset: {
          "payment.proofUploaded": "",
          "payment.proofUploadedAt": "",
          "payment.paymentProofId": "",
        },
      })
    }

    return res.status(200).json({
      success: true,
      message: "Payment proof deleted successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error deleting payment proof:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete payment proof",
      error: error.message,
    })
  }
}
