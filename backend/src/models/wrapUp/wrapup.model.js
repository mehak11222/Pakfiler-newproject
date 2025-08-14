import mongoose from 'mongoose';

// ===== WrapUp Schema =====
const wrapUpSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  taxYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'filed'],
    default: 'pending'
  },
  filingStatus: {
    type: String,
    enum: ['not-started', 'in-review', 'approved', 'rejected'],
    default: 'not-started'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'paid', 'refunded'],
    default: 'unpaid'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  taxCredits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxCredit'
  }],
  deductions: {
    bankTransactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankTransaction'
    }],
    utilities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UtilityDeduction'
    }],
    vehicles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleDeduction'
    }],
    others: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OtherDeduction'
    }]
  },
  serviceCharges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCharge'
  }],
  notes: String,
  lastUpdated: Date
}, { timestamps: true });

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
}, { timestamps: true });

// ===== Document Schema =====
const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  status: String,
}, { timestamps: true });

// ===== ServiceCharge Schema =====
const serviceChargeSchema = new mongoose.Schema({
  category: String,
  serviceName: String,
  fee: Number,
  completionTime: String,
  requirements: [String],
  contactMethods: [String],
}, { timestamps: true });

// ===== TaxCredit Schema =====
const taxCreditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taxYear: String,
  amount: Number,
  source: String,
}, { timestamps: true });

// ===== Deduction Schemas =====
const bankTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taxYear: String,
  amount: Number,
  description: String,
}, { timestamps: true });

const utilityDeductionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taxYear: String,
  amount: Number,
  utilityType: String,
}, { timestamps: true });

const vehicleDeductionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taxYear: String,
  amount: Number,
  vehicleType: String,
}, { timestamps: true });

const otherDeductionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taxYear: String,
  amount: Number,
  reason: String,
}, { timestamps: true });

// ===== Tax Filing Schema =====
const taxFilingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taxYear: String,
  cnicFiles: [String],
  ntnCart: { type: Boolean, default: false },
}, { timestamps: true });

// Export all models
export const WrapUp = mongoose.models.WrapUp || mongoose.model('WrapUp', wrapUpSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);
export const ServiceCharge = mongoose.models.ServiceCharge || mongoose.model('ServiceCharge', serviceChargeSchema);
export const TaxCredit = mongoose.models.TaxCredit || mongoose.model('TaxCredit', taxCreditSchema);
export const BankTransaction = mongoose.models.BankTransaction || mongoose.model('BankTransaction', bankTransactionSchema);
export const UtilityDeduction = mongoose.models.UtilityDeduction || mongoose.model('UtilityDeduction', utilityDeductionSchema);
export const VehicleDeduction = mongoose.models.VehicleDeduction || mongoose.model('VehicleDeduction', vehicleDeductionSchema);
export const OtherDeduction = mongoose.models.OtherDeduction || mongoose.model('OtherDeduction', otherDeductionSchema);
export const TaxFiling = mongoose.models.TaxFiling || mongoose.model('TaxFiling', taxFilingSchema);