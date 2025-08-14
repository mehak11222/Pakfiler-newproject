import mongoose from 'mongoose';

const freelancerIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  totalEarnings: { type: Number, required: true },
  expenses: { type: Number, default: 0 },
  netIncome: { type: Number, required: true },
  taxPaid: { type: Number, default: 0 },
  fromAbroad: { type: Boolean, default: false } // updated from hasForeignITIncome
}, { timestamps: true });

export default mongoose.model('FreelancerIncome', freelancerIncomeSchema);
