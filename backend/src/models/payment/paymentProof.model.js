import mongoose from "mongoose"

const proofFileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
)

const paymentProofSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taxFilingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxFiling",
      default: null,
      index: true,
    },
    taxYear: {
      type: String,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "bank_transfer",
        "online_banking",
        "mobile_banking",
        "credit_card",
        "debit_card",
        "cash_deposit",
        "cheque",
        "other",
      ],
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    bankDetails: {
      bankName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
    },
    proofFiles: [proofFileSchema],
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v
        return ret
      },
    },
  },
)

// Indexes for better performance
paymentProofSchema.index({ userId: 1, taxYear: 1 })
paymentProofSchema.index({ userId: 1, status: 1 })
paymentProofSchema.index({ submittedAt: -1 })

// Virtual for file count
paymentProofSchema.virtual("fileCount").get(function () {
  return this.proofFiles.length
})

// Virtual for total file size
paymentProofSchema.virtual("totalFileSize").get(function () {
  return this.proofFiles.reduce((total, file) => total + file.fileSize, 0)
})

export default mongoose.model("PaymentProof", paymentProofSchema)
