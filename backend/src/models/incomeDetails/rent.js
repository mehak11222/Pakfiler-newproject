import mongoose from 'mongoose';

const rentIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  rentReceived: { type: Number, default: 0 },
  rentExpense: { type: Number, default: 0 },
  taxDeducted: { type: Number, default: 0 },
  tenantDeductedTax: { type: Number, default: 0 }
}, { timestamps: true });

const RentIncome = mongoose.model('RentIncome', rentIncomeSchema);
export default RentIncome;
