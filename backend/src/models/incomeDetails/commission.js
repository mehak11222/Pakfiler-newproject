import mongoose from 'mongoose';

const commissionIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  lifeInsuranceAgent: { type: Number, default: 0 },
  generalInsuranceAgent: { type: Number, default: 0 },
  realEstateAgent: { type: Number, default: 0 },
  servicesConsultancy: { type: Number, default: 0 },
  otherCommissions: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('CommissionServiceIncome', commissionIncomeSchema);
