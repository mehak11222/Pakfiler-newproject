import TaxFiling from "../../models/TaxFiling/TaxFiling.js"
import mongoose from "mongoose"

// Get all filings for a user
export const getUserFilings = async (req, res) => {
  const { userId } = req.params

  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    const filings = await TaxFiling.find({ userId }).sort({ createdAt: -1 })

    // Match the expected frontend response structure
    const response = {
      success: true,
      data: {
        totalFilings: filings.length,
        pending: filings.filter((f) => f.status === "pending").length,
        completed: filings.filter((f) => f.status === "completed").length,
        underReview: filings.filter((f) => f.status === "under_review").length,
        rejected: filings.filter((f) => f.status === "rejected").length,
        filings: filings.map((filing) => ({
          _id: filing._id,
          taxYear: filing.taxYear,
          filingType: filing.filingType,
          status: filing.status,
          personalInfo: {
            fullName: filing.personalInfo?.fullName,
          },
          createdAt: filing.createdAt,
          payment: filing.payment
            ? {
                amount: filing.payment.amount,
                date: filing.payment.date,
              }
            : undefined,
          remarks: filing.remarks,
        })),
      },
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error fetching filings:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching filings",
      error: error.message,
    })
  }
}

// Create a new tax filing
export const createFiling = async (req, res) => {
  try {
    const { taxYear, filingType, userId, fullName } = req.body

    // Validate required fields
    if (!taxYear || !filingType || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: taxYear, filingType, userId",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Check if filing already exists for this user and tax year
    const existingFiling = await TaxFiling.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      taxYear: taxYear.toString(),
    })

    if (existingFiling) {
      return res.status(400).json({
        success: false,
        message: `Tax filing for year ${taxYear} already exists`,
      })
    }

    const newFiling = new TaxFiling({
      userId: new mongoose.Types.ObjectId(userId),
      taxYear: taxYear.toString(),
      filingType,
      personalInfo: {
        fullName: fullName || "Not provided",
      },
    })

    const savedFiling = await newFiling.save()

    res.status(201).json({
      success: true,
      message: "Tax filing created successfully",
      data: {
        id: savedFiling._id, // Frontend expects 'id' field
        _id: savedFiling._id,
        taxYear: savedFiling.taxYear,
        filingType: savedFiling.filingType,
        status: savedFiling.status,
        personalInfo: {
          fullName: savedFiling.personalInfo?.fullName,
        },
        createdAt: savedFiling.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating tax filing:", error)

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tax filing for this year already exists",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating tax filing",
      error: error.message,
    })
  }
}

// Get a specific filing by ID
export const getFilingById = async (req, res) => {
  const { filingId } = req.params

  try {
    if (!mongoose.Types.ObjectId.isValid(filingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filing ID format",
      })
    }

    const filing = await TaxFiling.findById(filingId)

    if (!filing) {
      return res.status(404).json({
        success: false,
        message: "Tax filing not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        _id: filing._id,
        taxYear: filing.taxYear,
        filingType: filing.filingType,
        status: filing.status,
        personalInfo: {
          fullName: filing.personalInfo?.fullName,
        },
        createdAt: filing.createdAt,
        updatedAt: filing.updatedAt,
        payment: filing.payment,
        remarks: filing.remarks,
      },
    })
  } catch (error) {
    console.error("Error fetching filing:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching filing",
      error: error.message,
    })
  }
}
