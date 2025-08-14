import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  bankName: String,
  accountNumber: String
}, { _id: false });

const irisProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Personal Info
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  presentAddress: { type: String, required: true },
  pin: { type: String, required: true },
  password: { type: String, required: true },
  sourceOfIncome: { type: String, required: true },
  bankAccounts: [bankAccountSchema],

  // Employer Info
  employerName: String,
  employerAddress: String,
  employerNTN: String,

  isNTNRegistered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('IRISProfile', irisProfileSchema);
