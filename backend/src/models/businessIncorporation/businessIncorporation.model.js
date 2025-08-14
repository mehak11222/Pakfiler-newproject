import mongoose from "mongoose"

const businessIncorporationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    irisPin: {
      type: String,
    },
    irisPassword: {
      type: String,
    },
    cessationDate: {
      type: Date,
    },

    purpose: {
      type: String,
      enum: ["SOLE_PROPRIETOR", "AOP_PARTNERSHIP", "ADD_BUSINESS_NTN", "REMOVE_BUSINESS_NTN"],
      required: true,
    },

    documents: {
      partnershipDeed: { type: String, default: "" },
      partnershipCertificate: { type: String, default: "" },
      authorityLetter: { type: String, default: "" },
      cnicCopies: { type: String, default: "" },
      rentAgreement: { type: String, default: "" },
      letterhead: { type: String, default: "" },
      electricityBill: { type: String, default: "" },
    },

    // Document Status Management for each document type
    documentStatus: {
      partnershipDeed: { type: String, enum: ["pending", "approved", "rejected", "under_review"], default: "pending" },
      partnershipCertificate: {
        type: String,
        enum: ["pending", "approved", "rejected", "under_review"],
        default: "pending",
      },
      authorityLetter: { type: String, enum: ["pending", "approved", "rejected", "under_review"], default: "pending" },
      cnicCopies: { type: String, enum: ["pending", "approved", "rejected", "under_review"], default: "pending" },
      rentAgreement: { type: String, enum: ["pending", "approved", "rejected", "under_review"], default: "pending" },
      letterhead: { type: String, enum: ["pending", "approved", "rejected", "under_review"], default: "pending" },
      electricityBill: { type: String, enum: ["pending", "approved", "rejected", "under_review"], default: "pending" },
    },

    approvedBy: {
      partnershipDeed: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      partnershipCertificate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      authorityLetter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      cnicCopies: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rentAgreement: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      letterhead: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      electricityBill: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    approvedAt: {
      partnershipDeed: { type: Date },
      partnershipCertificate: { type: Date },
      authorityLetter: { type: Date },
      cnicCopies: { type: Date },
      rentAgreement: { type: Date },
      letterhead: { type: Date },
      electricityBill: { type: Date },
    },

    rejectionReason: {
      partnershipDeed: { type: String },
      partnershipCertificate: { type: String },
      authorityLetter: { type: String },
      cnicCopies: { type: String },
      rentAgreement: { type: String },
      letterhead: { type: String },
      electricityBill: { type: String },
    },

    reviewNotes: {
      partnershipDeed: { type: String },
      partnershipCertificate: { type: String },
      authorityLetter: { type: String },
      cnicCopies: { type: String },
      rentAgreement: { type: String },
      letterhead: { type: String },
      electricityBill: { type: String },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("BusinessIncorporation", businessIncorporationSchema)
