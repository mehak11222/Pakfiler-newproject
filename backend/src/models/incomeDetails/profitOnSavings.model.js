import mongoose from 'mongoose';

const profitSavingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  bankDeposit: { type: Number, default: 0 },
  govtScheme: { type: Number, default: 0 },
  behbood: { type: Number, default: 0 },
  pensionerBenefit: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('ProfitOnSavings', profitSavingsSchema);
