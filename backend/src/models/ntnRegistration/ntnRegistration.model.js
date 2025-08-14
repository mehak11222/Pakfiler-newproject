import mongoose from "mongoose"

const bankAccountSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
})

const ntnRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

  // Step 1: Personal Info
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  pin: { type: String, required: true },
  password: { type: String, required: true },
  sourceOfIncome: { type: String, required: true },
  bankAccounts: [bankAccountSchema],

  // Step 2: Employer Info
  employerName: { type: String },
  employerAddress: { type: String },
  employerNTN: { type: String },

  // Step 3: CNIC Upload
  cnicDocumentName: { type: String },
  cnicFile: { type: String }, // file path

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

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("NTNRegistration", ntnRegistrationSchema)
