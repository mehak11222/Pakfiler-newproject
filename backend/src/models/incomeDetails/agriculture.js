import mongoose from 'mongoose';

const agricultureIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  annualIncome: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('AgricultureIncome', agricultureIncomeSchema);
