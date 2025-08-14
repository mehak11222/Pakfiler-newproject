import mongoose from "mongoose"
import TaxFiling from "../../models/TaxFiling/TaxFiling.js"
import User from "../../models/User.js"
import PersonalInfo from "../../models/PersonalInfo.js"
import PaymentProof from "../../models/payment/paymentProof.model.js"

// Get All Tax Filings (Admin)
export const getAllTaxFilings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "all",
      filingType = "all",
      taxYear = "all",
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      dateFrom,
      dateTo,
    } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Build query
    const query = {}

    if (status !== "all") {
      query.status = status
    }

    if (filingType !== "all") {
      query.filingType = filingType
    }

    if (taxYear !== "all") {
      query.taxYear = taxYear
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom)
      if (dateTo) query.createdAt.$lte = new Date(dateTo)
    }

    // Search functionality
    let userIds = []
    if (search) {
      const users = await User.find({
        $or: [
          { fullName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { cnic: new RegExp(search, "i") },
        ],
      }).select("_id")
      userIds = users.map((user) => user._id)

      if (userIds.length > 0) {
        query.userId = { $in: userIds }
      } else {
        // If no users found, also search in tax filing fields
        query.$or = [{ taxYear: new RegExp(search, "i") }, { "personalInfo.fullName": new RegExp(search, "i") }]
      }
    }

    // Sort configuration
    const sortConfig = {}
    sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get tax filings with pagination
    const taxFilings = await TaxFiling.find(query)
      .populate("userId", "fullName email cnic phone status")
      .sort(sortConfig)
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get additional data for each filing
    const enrichedFilings = await Promise.all(
      taxFilings.map(async (filing) => {
        // Get personal info
        const personalInfo = await PersonalInfo.findOne({ filingId: filing._id })

        // Get payment proof if exists
        const paymentProof = await PaymentProof.findOne({
          taxFilingId: filing._id,
        }).select("status paymentAmount paymentMethod submittedAt")

        return {
          id: filing._id,
          userId: filing.userId,
          taxYear: filing.taxYear,
          filingType: filing.filingType,
          status: filing.status,
          createdAt: filing.createdAt,
          updatedAt: filing.updatedAt,
          submittedAt: filing.submittedAt,
          personalInfo: {
            fullName: personalInfo?.fullName || filing.personalInfo?.fullName || "N/A",
            email: personalInfo?.email || filing.userId?.email || "N/A",
            cnic: personalInfo?.cnic || filing.userId?.cnic || "N/A",
            occupation: personalInfo?.occupation || "N/A",
          },
          payment: {
            amount: filing.payment?.amount || 0,
            status: filing.payment?.status || "pending",
            method: filing.payment?.method || "N/A",
            date: filing.payment?.date || null,
            proofStatus: paymentProof?.status || "not_uploaded",
            proofAmount: paymentProof?.paymentAmount || 0,
          },
          family: filing.family || { spouse: false, children: 0 },
          remarks: filing.remarks || "",
          processingSteps: filing.processingSteps || [],
        }
      }),
    )

    const totalCount = await TaxFiling.countDocuments(query)
    const totalPages = Math.ceil(totalCount / Number.parseInt(limit))

    // Calculate statistics
    const stats = await TaxFiling.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const statistics = {
      total: totalCount,
      pending: 0,
      under_review: 0,
      completed: 0,
      rejected: 0,
    }

    stats.forEach((stat) => {
      statistics[stat._id] = stat.count
    })

    // Get unique values for filters
    const [taxYears, filingTypes] = await Promise.all([TaxFiling.distinct("taxYear"), TaxFiling.distinct("filingType")])

    return res.status(200).json({
      success: true,
      message: "Tax filings retrieved successfully",
      data: {
        taxFilings: enrichedFilings,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: Number.parseInt(page) < totalPages,
          hasPrevPage: Number.parseInt(page) > 1,
          limit: Number.parseInt(limit),
        },
        statistics,
        filters: {
          availableTaxYears: taxYears.sort(),
          availableFilingTypes: filingTypes,
          availableStatuses: ["pending", "under_review", "completed", "rejected"],
          currentFilters: {
            status,
            filingType,
            taxYear,
            search,
            sortBy,
            sortOrder,
            dateFrom,
            dateTo,
          },
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving tax filings:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tax filings",
      error: error.message,
    })
  }
}

// Get Single Tax Filing Details (Admin)
export const getTaxFilingById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tax filing ID",
      })
    }

    const taxFiling = await TaxFiling.findById(id).populate("userId", "fullName email cnic phone status createdAt")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "Tax filing not found",
      })
    }

    // Get additional related data
    const [personalInfo, paymentProofs] = await Promise.all([
      PersonalInfo.findOne({ filingId: taxFiling._id }),
      PaymentProof.find({ taxFilingId: taxFiling._id }).sort({ submittedAt: -1 }),
    ])

    const detailedFiling = {
      id: taxFiling._id,
      user: taxFiling.userId,
      taxYear: taxFiling.taxYear,
      filingType: taxFiling.filingType,
      status: taxFiling.status,
      createdAt: taxFiling.createdAt,
      updatedAt: taxFiling.updatedAt,
      submittedAt: taxFiling.submittedAt,
      personalInfo: personalInfo
        ? {
            fullName: personalInfo.fullName,
            email: personalInfo.email,
            cnic: personalInfo.cnic,
            dateOfBirth: personalInfo.dateOfBirth,
            nationality: personalInfo.nationality,
            residentialStatus: personalInfo.residentialStatus,
            occupation: personalInfo.occupation,
          }
        : taxFiling.personalInfo || {},
      family: taxFiling.family || { spouse: false, children: 0 },
      payment: taxFiling.payment || {},
      remarks: taxFiling.remarks || "",
      processingSteps: taxFiling.processingSteps || [],
      paymentProofs: paymentProofs.map((proof) => ({
        id: proof._id,
        paymentMethod: proof.paymentMethod,
        paymentAmount: proof.paymentAmount,
        paymentDate: proof.paymentDate,
        transactionId: proof.transactionId,
        status: proof.status,
        submittedAt: proof.submittedAt,
        filesCount: proof.proofFiles.length,
      })),
    }

    return res.status(200).json({
      success: true,
      message: "Tax filing details retrieved successfully",
      data: {
        taxFiling: detailedFiling,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving tax filing details:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tax filing details",
      error: error.message,
    })
  }
}

// Update Tax Filing Status (Admin)
export const updateTaxFilingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, remarks, adminNotes } = req.body
    const adminId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tax filing ID",
      })
    }

    const validStatuses = ["pending", "under_review", "completed", "rejected"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      })
    }

    const taxFiling = await TaxFiling.findById(id).populate("userId", "fullName email")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "Tax filing not found",
      })
    }

    // Update tax filing
    const updateData = {
      status,
      updatedAt: new Date(),
    }

    // Add status-specific fields
    if (status === "under_review") {
      updateData.reviewStartedAt = new Date()
      updateData.reviewedBy = adminId
    } else if (status === "completed") {
      updateData.completedAt = new Date()
      updateData.completedBy = adminId
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date()
      updateData.rejectedBy = adminId
      if (!remarks) {
        return res.status(400).json({
          success: false,
          message: "Remarks are required when rejecting a tax filing",
        })
      }
    }

    if (remarks) {
      updateData.remarks = remarks
    }

    if (adminNotes) {
      updateData.adminNotes = adminNotes
    }

    const updatedFiling = await TaxFiling.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "userId",
      "fullName email",
    )

    // Log the status change
    const statusHistory = {
      previousStatus: taxFiling.status,
      newStatus: status,
      changedBy: adminId,
      changedAt: new Date(),
      remarks: remarks || "",
    }

    // Add to status history if it doesn't exist
    if (!updatedFiling.statusHistory) {
      updatedFiling.statusHistory = []
    }
    updatedFiling.statusHistory.push(statusHistory)
    await updatedFiling.save()

    return res.status(200).json({
      success: true,
      message: `Tax filing status updated to ${status} successfully`,
      data: {
        taxFiling: {
          id: updatedFiling._id,
          userId: updatedFiling.userId,
          taxYear: updatedFiling.taxYear,
          filingType: updatedFiling.filingType,
          status: updatedFiling.status,
          previousStatus: taxFiling.status,
          updatedAt: updatedFiling.updatedAt,
          remarks: updatedFiling.remarks,
          adminNotes: updatedFiling.adminNotes,
        },
        statusChange: statusHistory,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating tax filing status:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update tax filing status",
      error: error.message,
    })
  }
}

// Get Tax Filing Dashboard Statistics (Admin)
export const getTaxFilingStats = async (req, res) => {
  try {
    const { period = "30" } = req.query // days
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - Number.parseInt(period))

    // Overall statistics
    const [totalStats, recentStats, yearStats, typeStats] = await Promise.all([
      // Total statistics
      TaxFiling.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Recent statistics (last N days)
      TaxFiling.aggregate([
        { $match: { createdAt: { $gte: daysAgo } } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Tax year statistics
      TaxFiling.aggregate([
        {
          $group: {
            _id: "$taxYear",
            count: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            under_review: { $sum: { $cond: [{ $eq: ["$status", "under_review"] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
          },
        },
        { $sort: { _id: -1 } },
      ]),

      // Filing type statistics
      TaxFiling.aggregate([
        {
          $group: {
            _id: "$filingType",
            count: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            under_review: { $sum: { $cond: [{ $eq: ["$status", "under_review"] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
          },
        },
      ]),
    ])

    // Process statistics
    const processStats = (stats) => {
      const result = { pending: 0, under_review: 0, completed: 0, rejected: 0 }
      stats.forEach((stat) => {
        result[stat._id] = stat.count
      })
      result.total = result.pending + result.under_review + result.completed + result.rejected
      return result
    }

    const overallStats = processStats(totalStats)
    const recentStatsProcessed = processStats(recentStats)

    // Daily filing trend (last 7 days)
    const dailyTrend = await TaxFiling.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          under_review: { $sum: { $cond: [{ $eq: ["$status", "under_review"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Completion rate
    const completionRate = overallStats.total > 0 ? (overallStats.completed / overallStats.total) * 100 : 0

    return res.status(200).json({
      success: true,
      message: "Tax filing statistics retrieved successfully",
      data: {
        overall: {
          ...overallStats,
          completionRate: Math.round(completionRate * 100) / 100,
        },
        recent: {
          ...recentStatsProcessed,
          period: `${period} days`,
        },
        taxYears: yearStats,
        filingTypes: typeStats,
        dailyTrend,
        insights: {
          mostActiveYear: yearStats.length > 0 ? yearStats[0]._id : "N/A",
          pendingReviewCount: overallStats.pending + overallStats.under_review,
          successRate: Math.round(completionRate * 100) / 100,
          totalProcessed: overallStats.completed + overallStats.rejected,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving tax filing statistics:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tax filing statistics",
      error: error.message,
    })
  }
}

// Bulk Update Tax Filing Status (Admin)
export const bulkUpdateTaxFilingStatus = async (req, res) => {
  try {
    const { filingIds, status, remarks } = req.body
    const adminId = req.user._id

    if (!Array.isArray(filingIds) || filingIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Filing IDs array is required",
      })
    }

    const validStatuses = ["pending", "under_review", "completed", "rejected"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      })
    }

    if (status === "rejected" && !remarks) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required when rejecting tax filings",
      })
    }

    // Validate all IDs
    const validIds = filingIds.filter((id) => mongoose.Types.ObjectId.isValid(id))
    if (validIds.length !== filingIds.length) {
      return res.status(400).json({
        success: false,
        message: "All filing IDs must be valid ObjectIds",
      })
    }

    // Build update data
    const updateData = {
      status,
      updatedAt: new Date(),
    }

    if (status === "under_review") {
      updateData.reviewStartedAt = new Date()
      updateData.reviewedBy = adminId
    } else if (status === "completed") {
      updateData.completedAt = new Date()
      updateData.completedBy = adminId
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date()
      updateData.rejectedBy = adminId
    }

    if (remarks) {
      updateData.remarks = remarks
    }

    // Update all filings
    const updateResult = await TaxFiling.updateMany({ _id: { $in: validIds } }, updateData)

    return res.status(200).json({
      success: true,
      message: `${updateResult.modifiedCount} tax filings updated to ${status} successfully`,
      data: {
        updatedCount: updateResult.modifiedCount,
        totalRequested: filingIds.length,
        status,
        updatedAt: new Date(),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error bulk updating tax filing status:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to bulk update tax filing status",
      error: error.message,
    })
  }
}
