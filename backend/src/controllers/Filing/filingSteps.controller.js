import mongoose from "mongoose"
import TaxFiling from "../../models/TaxFiling/TaxFiling.js"
import User from "../../models/User.js"
import PersonalInfo from "../../models/PersonalInfo.js"
import IncomeSources from "../../models/incomeSources.model.js"
import AssetSelection from "../../models/assetSelection/assetSelection.model.js"
import BankAccount from "../../models/assetDetails/bankAccount.model.js"
import Cash from "../../models/assetDetails/cash.model.js"
import Vehicle from "../../models/assetDetails/vehicle.model.js"
import PropertyAsset from "../../models/assetDetails/propertyAsset.model.js"
import Insurance from "../../models/assetDetails/insurance.model.js"
import SalaryIncome from "../../models/incomeDetails/salaryIncome.model.js"
import BusinessIncome from "../../models/incomeDetails/businessIncome.model.js"
import Rent from "../../models/incomeDetails/rent.js"
import Commission from "../../models/incomeDetails/commission.js"
import Dividend from "../../models/incomeDetails/dividend.js"
import BankLoan from "../../models/bankLoan/bankLoan.model.js"
import OtherLiability from "../../models/bankLoan/otherLiability.model.js"
import TaxCredits from "../../models/taxCredits/taxCredits.js"
import OpeningWealth from "../../models/openingWealth/openingWealth.model.js"
import Expense from "../../models/expense/expense.model.js"
import BankTransaction from "../../models/deduction/bankTransaction.js"
import UtilityDeduction from "../../models/deduction/utilityDeduction.js"
import VehicleDeduction from "../../models/deduction/vehicleDeduction.js"
import OtherDeduction from "../../models/deduction/otherDeduction.js"
import { WrapUp } from "../../models/wrapUp/wrapup.model.js";

// Define the exact 12 filing steps as shown in the image
const FILING_STEPS = {
  taxYear: {
    name: "Tax Year",
    description: "Select tax year for filing",
    order: 1,
    checkMethod: "taxFiling", // Special case - check if tax filing exists
  },
  personalInfo: {
    name: "Personal Info",
    model: PersonalInfo,
    description: "Basic personal details and contact information",
    order: 2,
    queryField: "filingId",
  },
  incomeSources: {
    name: "Income Sources",
    model: IncomeSources,
    description: "Select applicable income sources",
    order: 3,
    queryField: "userId",
  },
  incomeDetails: {
    name: "Income Details",
    description: "Employment, business, and other income details",
    order: 4,
    checkMethod: "multiple", // Check multiple income models
    models: [
      { model: SalaryIncome, name: "Salary Income" },
      { model: BusinessIncome, name: "Business Income" },
      { model: Rent, name: "Rental Income" },
      { model: Commission, name: "Commission Income" },
      { model: Dividend, name: "Dividend Income" },
    ],
  },
  taxCredits: {
    name: "Tax Credits",
    model: TaxCredits,
    description: "Tax credits and rebates",
    order: 5,
    queryField: "userId",
  },
  deductions: {
    name: "Deductions",
    description: "Tax deductions and allowances",
    order: 6,
    checkMethod: "multiple",
    models: [
      { model: BankTransaction, name: "Bank Transactions" },
      { model: UtilityDeduction, name: "Utility Deductions" },
      { model: VehicleDeduction, name: "Vehicle Deductions" },
      { model: OtherDeduction, name: "Other Deductions" },
    ],
  },
  openingWealth: {
    name: "Opening Wealth",
    model: OpeningWealth,
    description: "Opening wealth and net worth",
    order: 7,
    queryField: "userId",
  },
  assetSelection: {
    name: "Asset Selection",
    model: AssetSelection,
    description: "Select assets to declare",
    order: 8,
    queryField: "userId",
  },
  assetDetails: {
    name: "Asset Details",
    description: "Detailed asset information",
    order: 9,
    checkMethod: "multiple",
    models: [
      { model: BankAccount, name: "Bank Accounts" },
      { model: Cash, name: "Cash Assets" },
      { model: Vehicle, name: "Vehicles" },
      { model: PropertyAsset, name: "Property Assets" },
      { model: Insurance, name: "Insurance Policies" },
    ],
  },
  liabilities: {
    name: "Liabilities",
    description: "Loans and financial liabilities",
    order: 10,
    checkMethod: "multiple",
    models: [
      { model: BankLoan, name: "Bank Loans" },
      { model: OtherLiability, name: "Other Liabilities" },
    ],
  },
  expenseDetails: {
    name: "Expense Details",
    model: Expense,
    description: "Business and personal expenses",
    order: 11,
    queryField: "userId",
  },
  wrapUp: {
    name: "Wrap Up",
    model: WrapUp,
    description: "Final review and submission",
    order: 12,
    queryField: "userId",
  },
}

// Helper function to check step completion
const checkStepCompletion = async (stepKey, stepInfo, userId, filingId) => {
  try {
    let isCompleted = false
    let data = null
    let completedAt = null
    let recordCount = 0
    let summary = {}

    if (stepInfo.checkMethod === "taxFiling") {
      // Special case for tax year - check if tax filing exists
      const taxFiling = await TaxFiling.findById(filingId)
      isCompleted = !!taxFiling
      if (taxFiling) {
        data = {
          taxYear: taxFiling.taxYear,
          filingType: taxFiling.filingType,
          status: taxFiling.status,
        }
        completedAt = taxFiling.createdAt
        recordCount = 1
      }
    } else if (stepInfo.checkMethod === "multiple") {
      // Check multiple models
      const results = await Promise.all(
        stepInfo.models.map(async (modelInfo) => {
          const count = await modelInfo.model.countDocuments({ userId })
          const records = count > 0 ? await modelInfo.model.find({ userId }).limit(5) : []
          return {
            modelName: modelInfo.name,
            count,
            records,
          }
        }),
      )

      const totalRecords = results.reduce((sum, result) => sum + result.count, 0)
      isCompleted = totalRecords > 0
      recordCount = totalRecords

      if (isCompleted) {
        data = results.filter((result) => result.count > 0)
        completedAt = data[0]?.records[0]?.createdAt || new Date()

        // Generate summary based on step type
        if (stepKey === "incomeDetails") {
          const totalIncome = results.reduce((sum, result) => {
            return (
              sum +
              result.records.reduce((recordSum, record) => {
                return recordSum + (record.grossSalary || record.totalIncome || record.amount || 0)
              }, 0)
            )
          }, 0)
          summary = { totalIncome, sourceCount: results.filter((r) => r.count > 0).length }
        } else if (stepKey === "assetDetails") {
          const totalValue = results.reduce((sum, result) => {
            return (
              sum +
              result.records.reduce((recordSum, record) => {
                return recordSum + (record.balance || record.currentValue || record.amount || 0)
              }, 0)
            )
          }, 0)
          summary = { totalValue, assetCount: totalRecords }
        } else if (stepKey === "liabilities") {
          const totalLiability = results.reduce((sum, result) => {
            return (
              sum +
              result.records.reduce((recordSum, record) => {
                return recordSum + (record.outstandingAmount || record.amount || 0)
              }, 0)
            )
          }, 0)
          summary = { totalLiability, liabilityCount: totalRecords }
        }
      }
    } else {
      // Single model check
      const queryField = stepInfo.queryField || "userId"
      const query = {}
      query[queryField] = queryField === "filingId" ? filingId : userId

      const records = await stepInfo.model.find(query)
      isCompleted = records.length > 0
      recordCount = records.length

      if (records.length > 0) {
        data = records.map((record) => ({
          id: record._id,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          ...record.toObject(),
        }))
        completedAt = records[0].createdAt

        // Generate step-specific summaries
        if (stepKey === "taxCredits" && records.length > 0) {
          summary = {
            totalCredits: records.reduce((sum, r) => sum + (r.amount || 0), 0),
            creditCount: records.length,
          }
        } else if (stepKey === "expenseDetails" && records.length > 0) {
          summary = {
            totalExpenses: records.reduce((sum, r) => sum + (r.amount || 0), 0),
            expenseCount: records.length,
          }
        }
      }
    }

    return {
      stepKey,
      stepName: stepInfo.name,
      description: stepInfo.description,
      order: stepInfo.order,
      isCompleted,
      completedAt,
      recordCount,
      summary,
      data: isCompleted ? data : null,
    }
  } catch (error) {
    console.error(`Error checking ${stepKey}:`, error)
    return {
      stepKey,
      stepName: stepInfo.name,
      description: stepInfo.description,
      order: stepInfo.order,
      isCompleted: false,
      completedAt: null,
      recordCount: 0,
      summary: {},
      data: null,
    }
  }
}

// Get Filing Steps Progress for Current User (Token-based)
export const getCurrentUserFilingSteps = async (req, res) => {
  try {
    const userId = req.user._id // Get user ID from token

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      })
    }

    // Get the most recent tax filing for this user
    const taxFiling = await TaxFiling.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email cnic")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "No tax filing found for this user",
      })
    }

    const filingId = taxFiling._id

    // Check completion status for each step
    const stepsProgress = await Promise.all(
      Object.entries(FILING_STEPS).map(([stepKey, stepInfo]) =>
        checkStepCompletion(stepKey, stepInfo, userId, filingId),
      ),
    )

    // Sort by order
    stepsProgress.sort((a, b) => a.order - b.order)

    // Calculate overall progress
    const completedSteps = stepsProgress.filter((step) => step.isCompleted).length
    const totalSteps = stepsProgress.length
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

    // Determine current step (first incomplete step)
    const currentStep = stepsProgress.find((step) => !step.isCompleted) || stepsProgress[stepsProgress.length - 1]

    // Get next steps (up to 3 incomplete steps)
    const nextSteps = stepsProgress.filter((step) => !step.isCompleted).slice(0, 3)

    return res.status(200).json({
      success: true,
      message: "Filing steps progress retrieved successfully",
      data: {
        taxFiling: {
          id: taxFiling._id,
          userId: taxFiling.userId._id,
          userInfo: {
            fullName: taxFiling.userId.fullName,
            email: taxFiling.userId.email,
            cnic: taxFiling.userId.cnic,
          },
          taxYear: taxFiling.taxYear,
          filingType: taxFiling.filingType,
          status: taxFiling.status,
          createdAt: taxFiling.createdAt,
          updatedAt: taxFiling.updatedAt,
        },
        progress: {
          completedSteps,
          totalSteps,
          progressPercentage,
          isComplete: completedSteps === totalSteps,
          canSubmit: completedSteps >= totalSteps * 0.8, // Can submit if 80% complete
        },
        currentStep: {
          stepKey: currentStep.stepKey,
          stepName: currentStep.stepName,
          description: currentStep.description,
          isCompleted: currentStep.isCompleted,
          order: currentStep.order,
        },
        nextSteps: nextSteps.map((step) => ({
          stepKey: step.stepKey,
          stepName: step.stepName,
          description: step.description,
          order: step.order,
        })),
        steps: stepsProgress,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving filing steps:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve filing steps progress",
      error: error.message,
    })
  }
}

// Get Filing Steps Progress for Specific User (by userId parameter)
export const getUserFilingSteps = async (req, res) => {
  try {
    const { userId } = req.params

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Get the most recent tax filing for this user
    const taxFiling = await TaxFiling.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email cnic")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "No tax filing found for this user",
      })
    }

    const filingId = taxFiling._id

    // Check completion status for each step
    const stepsProgress = await Promise.all(
      Object.entries(FILING_STEPS).map(([stepKey, stepInfo]) =>
        checkStepCompletion(stepKey, stepInfo, userId, filingId),
      ),
    )

    // Sort by order
    stepsProgress.sort((a, b) => a.order - b.order)

    // Calculate overall progress
    const completedSteps = stepsProgress.filter((step) => step.isCompleted).length
    const totalSteps = stepsProgress.length
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

    // Determine current step (first incomplete step)
    const currentStep = stepsProgress.find((step) => !step.isCompleted) || stepsProgress[stepsProgress.length - 1]

    // Get next steps (up to 3 incomplete steps)
    const nextSteps = stepsProgress.filter((step) => !step.isCompleted).slice(0, 3)

    return res.status(200).json({
      success: true,
      message: "Filing steps progress retrieved successfully",
      data: {
        taxFiling: {
          id: taxFiling._id,
          userId: taxFiling.userId._id,
          userInfo: {
            fullName: taxFiling.userId.fullName,
            email: taxFiling.userId.email,
            cnic: taxFiling.userId.cnic,
          },
          taxYear: taxFiling.taxYear,
          filingType: taxFiling.filingType,
          status: taxFiling.status,
          createdAt: taxFiling.createdAt,
          updatedAt: taxFiling.updatedAt,
        },
        progress: {
          completedSteps,
          totalSteps,
          progressPercentage,
          isComplete: completedSteps === totalSteps,
          canSubmit: completedSteps >= totalSteps * 0.8,
        },
        currentStep: {
          stepKey: currentStep.stepKey,
          stepName: currentStep.stepName,
          description: currentStep.description,
          isCompleted: currentStep.isCompleted,
          order: currentStep.order,
        },
        nextSteps: nextSteps.map((step) => ({
          stepKey: step.stepKey,
          stepName: step.stepName,
          description: step.description,
          order: step.order,
        })),
        steps: stepsProgress,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving filing steps:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve filing steps progress",
      error: error.message,
    })
  }
}

// Get All Users Filing Steps Progress (Admin)
export const getAllUsersFilingSteps = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "all",
      progressFilter = "all", // all, incomplete, complete, high_progress
      search = "",
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Build query for tax filings
    const query = {}
    if (status !== "all") {
      query.status = status
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
      }
    }

    // Sort configuration
    const sortConfig = {}
    sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get unique users first, then get their most recent filing
    const pipeline = [
      { $match: query },
      { $sort: { userId: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          latestFiling: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latestFiling" } },
      { $sort: sortConfig },
      { $skip: skip },
      { $limit: Number.parseInt(limit) },
    ]

    const taxFilings = await TaxFiling.aggregate(pipeline)

    // Populate user details
    await TaxFiling.populate(taxFilings, {
      path: "userId",
      select: "fullName email cnic phone status",
    })

    // Get progress for each filing
    const filingsWithProgress = await Promise.all(
      taxFilings.map(async (filing) => {
        // Quick progress check (count completed steps)
        const progressChecks = await Promise.all(
          Object.entries(FILING_STEPS).map(async ([stepKey, stepInfo]) => {
            try {
              if (stepInfo.checkMethod === "taxFiling") {
                return 1 // Tax filing exists if we're here
              } else if (stepInfo.checkMethod === "multiple") {
                const counts = await Promise.all(
                  stepInfo.models.map((modelInfo) => modelInfo.model.countDocuments({ userId: filing.userId._id })),
                )
                return counts.some((count) => count > 0) ? 1 : 0
              } else {
                const queryField = stepInfo.queryField || "userId"
                const query = {}
                query[queryField] = queryField === "filingId" ? filing._id : filing.userId._id
                const count = await stepInfo.model.countDocuments(query)
                return count > 0 ? 1 : 0
              }
            } catch (error) {
              return 0
            }
          }),
        )

        const completedSteps = progressChecks.reduce((sum, completed) => sum + completed, 0)
        const totalSteps = Object.keys(FILING_STEPS).length
        const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

        return {
          id: filing._id,
          user: {
            id: filing.userId._id,
            fullName: filing.userId.fullName,
            email: filing.userId.email,
            cnic: filing.userId.cnic,
            phone: filing.userId.phone,
            status: filing.userId.status,
          },
          taxYear: filing.taxYear,
          filingType: filing.filingType,
          status: filing.status,
          createdAt: filing.createdAt,
          updatedAt: filing.updatedAt,
          progress: {
            completedSteps,
            totalSteps,
            progressPercentage,
            isComplete: completedSteps === totalSteps,
            canSubmit: completedSteps >= totalSteps * 0.8,
          },
          lastActivity: filing.updatedAt,
        }
      }),
    )

    // Apply progress filter
    let filteredFilings = filingsWithProgress
    if (progressFilter !== "all") {
      filteredFilings = filingsWithProgress.filter((filing) => {
        switch (progressFilter) {
          case "incomplete":
            return filing.progress.progressPercentage < 100
          case "complete":
            return filing.progress.progressPercentage === 100
          case "high_progress":
            return filing.progress.progressPercentage >= 80 && filing.progress.progressPercentage < 100
          default:
            return true
        }
      })
    }

    const totalCount = await TaxFiling.distinct("userId", query).then((users) => users.length)
    const totalPages = Math.ceil(totalCount / Number.parseInt(limit))

    // Calculate statistics
    const stats = {
      total: filingsWithProgress.length,
      complete: filingsWithProgress.filter((f) => f.progress.progressPercentage === 100).length,
      highProgress: filingsWithProgress.filter((f) => f.progress.progressPercentage >= 80).length,
      lowProgress: filingsWithProgress.filter((f) => f.progress.progressPercentage < 50).length,
      averageProgress:
        filingsWithProgress.length > 0
          ? Math.round(
              filingsWithProgress.reduce((sum, f) => sum + f.progress.progressPercentage, 0) /
                filingsWithProgress.length,
            )
          : 0,
    }

    return res.status(200).json({
      success: true,
      message: "All users filing steps progress retrieved successfully",
      data: {
        filings: filteredFilings,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: Number.parseInt(page) < totalPages,
          hasPrevPage: Number.parseInt(page) > 1,
          limit: Number.parseInt(limit),
        },
        statistics: stats,
        filters: {
          availableStatuses: ["pending", "under_review", "completed", "rejected"],
          availableProgressFilters: ["all", "incomplete", "complete", "high_progress"],
          currentFilters: {
            status,
            progressFilter,
            search,
            sortBy,
            sortOrder,
          },
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving all users filing steps:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all users filing steps progress",
      error: error.message,
    })
  }
}

// Get Detailed Filing Steps for Admin (by userId)
export const getDetailedFilingSteps = async (req, res) => {
  try {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Get the most recent tax filing with user details
    const taxFiling = await TaxFiling.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email cnic phone status")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "Tax filing not found for this user",
      })
    }

    const filingId = taxFiling._id

    // Get detailed data for each step
    const detailedSteps = await Promise.all(
      Object.entries(FILING_STEPS).map(([stepKey, stepInfo]) =>
        checkStepCompletion(stepKey, stepInfo, userId, filingId),
      ),
    )

    // Sort by order
    detailedSteps.sort((a, b) => a.order - b.order)

    // Calculate progress
    const completedSteps = detailedSteps.filter((step) => step.isCompleted).length
    const totalSteps = detailedSteps.length
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

    return res.status(200).json({
      success: true,
      message: "Detailed filing steps retrieved successfully",
      data: {
        taxFiling: {
          id: taxFiling._id,
          user: {
            id: taxFiling.userId._id,
            fullName: taxFiling.userId.fullName,
            email: taxFiling.userId.email,
            cnic: taxFiling.userId.cnic,
            phone: taxFiling.userId.phone,
            status: taxFiling.userId.status,
          },
          taxYear: taxFiling.taxYear,
          filingType: taxFiling.filingType,
          status: taxFiling.status,
          createdAt: taxFiling.createdAt,
          updatedAt: taxFiling.updatedAt,
          remarks: taxFiling.remarks,
          adminNotes: taxFiling.adminNotes,
        },
        progress: {
          completedSteps,
          totalSteps,
          progressPercentage,
          isComplete: completedSteps === totalSteps,
          canSubmit: completedSteps >= totalSteps * 0.8,
        },
        steps: detailedSteps,
        completionSummary: {
          taxYearComplete: detailedSteps.find((s) => s.stepKey === "taxYear")?.isCompleted || false,
          personalInfoComplete: detailedSteps.find((s) => s.stepKey === "personalInfo")?.isCompleted || false,
          incomeDataComplete: detailedSteps.find((s) => s.stepKey === "incomeDetails")?.isCompleted || false,
          assetDataComplete: detailedSteps.find((s) => s.stepKey === "assetDetails")?.isCompleted || false,
          liabilitiesComplete: detailedSteps.find((s) => s.stepKey === "liabilities")?.isCompleted || false,
          wrapUpComplete: detailedSteps.find((s) => s.stepKey === "wrapUp")?.isCompleted || false,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving detailed filing steps:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve detailed filing steps",
      error: error.message,
    })
  }
}

// Update Filing Status (Admin) - by userId
export const updateFilingStatus = async (req, res) => {
  try {
    const { userId } = req.params
    const { status, remarks, adminNotes } = req.body
    const adminId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    const validStatuses = ["pending", "under_review", "completed", "rejected"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      })
    }

    const taxFiling = await TaxFiling.findOne({ userId }).sort({ createdAt: -1 }).populate("userId", "fullName email")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "Tax filing not found for this user",
      })
    }

    // Update tax filing
    const updateData = {
      status,
      updatedAt: new Date(),
    }

    if (remarks) updateData.remarks = remarks
    if (adminNotes) updateData.adminNotes = adminNotes

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

    const updatedFiling = await TaxFiling.findByIdAndUpdate(taxFiling._id, updateData, { new: true }).populate(
      "userId",
      "fullName email",
    )

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
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating filing status:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update filing status",
      error: error.message,
    })
  }
}

// Resume Filing (Current User - Token-based)
export const resumeFiling = async (req, res) => {
  try {
    const userId = req.user._id // Get user ID from token

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      })
    }

    // Get the most recent tax filing
    const taxFiling = await TaxFiling.findOne({ userId }).sort({ createdAt: -1 }).populate("userId", "fullName email")

    if (!taxFiling) {
      return res.status(404).json({
        success: false,
        message: "No tax filing found for this user",
      })
    }

    // Check if filing can be resumed
    if (taxFiling.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot resume a completed tax filing",
      })
    }

    const filingId = taxFiling._id

    // Get current progress
    const progressChecks = await Promise.all(
      Object.entries(FILING_STEPS).map(async ([stepKey, stepInfo]) => {
        const stepResult = await checkStepCompletion(stepKey, stepInfo, userId, filingId)
        return {
          stepKey,
          stepName: stepInfo.name,
          order: stepInfo.order,
          isCompleted: stepResult.isCompleted,
        }
      }),
    )

    // Sort by order and find next step
    progressChecks.sort((a, b) => a.order - b.order)
    const nextStep = progressChecks.find((step) => !step.isCompleted) || progressChecks[progressChecks.length - 1]

    const completedSteps = progressChecks.filter((step) => step.isCompleted).length
    const totalSteps = progressChecks.length
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

    return res.status(200).json({
      success: true,
      message: "Filing resume information retrieved successfully",
      data: {
        taxFiling: {
          id: taxFiling._id,
          userId: taxFiling.userId._id,
          userInfo: {
            fullName: taxFiling.userId.fullName,
            email: taxFiling.userId.email,
          },
          taxYear: taxFiling.taxYear,
          filingType: taxFiling.filingType,
          status: taxFiling.status,
          createdAt: taxFiling.createdAt,
          updatedAt: taxFiling.updatedAt,
        },
        resumeInfo: {
          canResume: taxFiling.status !== "completed",
          nextStep: {
            stepKey: nextStep.stepKey,
            stepName: nextStep.stepName,
            order: nextStep.order,
          },
          progress: {
            completedSteps,
            totalSteps,
            progressPercentage,
            remainingSteps: totalSteps - completedSteps,
          },
          completedStepsList: progressChecks
            .filter((step) => step.isCompleted)
            .map((step) => ({
              stepKey: step.stepKey,
              stepName: step.stepName,
              order: step.order,
            })),
          pendingStepsList: progressChecks
            .filter((step) => !step.isCompleted)
            .map((step) => ({
              stepKey: step.stepKey,
              stepName: step.stepName,
              order: step.order,
            })),
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error getting resume filing info:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to get resume filing information",
      error: error.message,
    })
  }
}
