import mongoose from "mongoose"

const statusHistorySchema = new mongoose.Schema(
  {
    previousStatus: {
      type: String,
      enum: ["pending", "under_review", "completed", "rejected"],
    },
    newStatus: {
      type: String,
      enum: ["pending", "under_review", "completed", "rejected"],
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
)

const taxFilingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v),
        message: (props) => `${props.value} is not a valid user ID!`,
      },
    },
    taxYear: {
      type: String,
      required: [true, "Tax year is required"],
      validate: {
        validator: (v) => /^\d{4}$/.test(v),
        message: (props) => `${props.value} is not a valid tax year!`,
      },
    },
    filingType: {
      type: String,
      enum: ["individual", "business"],
      required: [true, "Filing type is required"],
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "completed", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    personalInfo: {
      fullName: {
        type: String,
        trim: true,
      },
    },
    family: {
      spouse: { type: Boolean, required: true },
      children: { type: Number, required: true },
    },
    payment: {
      amount: {
        type: Number,
        min: 0,
      },
      date: Date,
      method: String,
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },
      transactionId: String,
      proofUploaded: {
        type: Boolean,
        default: false,
      },
      proofUploadedAt: Date,
      paymentProofId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentProof",
      },
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rejectedAt: Date,
      rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rejectionReason: String,
    },
    remarks: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    submittedAt: Date,
    reviewStartedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processingSteps: [String],
    statusHistory: [statusHistorySchema],
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

// Add index for better performance
taxFilingSchema.index({ userId: 1, taxYear: 1 }, { unique: true })
taxFilingSchema.index({ status: 1 })
taxFilingSchema.index({ createdAt: -1 })
taxFilingSchema.index({ taxYear: 1 })

export default mongoose.models.TaxFiling || mongoose.model("TaxFiling", taxFilingSchema)
