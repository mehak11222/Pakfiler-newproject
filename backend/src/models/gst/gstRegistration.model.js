import mongoose from "mongoose"

const documentSchema = new mongoose.Schema({
  docType: { type: String, required: true },
  filePaths: [{ type: String }],

  // Document Status Management
  documentStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "under_review"],
    default: "pending",
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  reviewNotes: { type: String },
})

const gstRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

  // Step 1: Business Details
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  startDate: { type: Date, required: true },
  businessNature: { type: String, required: true },
  description: { type: String },
  consumerNumber: { type: String },

  // Step 2: Uploaded Documents
  documents: [documentSchema],

  // Status tracking
  status: {
    type: String,
    enum: ["pending", "completed", "inactive", "submitted"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("GSTRegistration", gstRegistrationSchema)
