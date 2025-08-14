import mongoose from 'mongoose';

const bankLoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  bankName: { type: String, required: true },
  outstandingLoan: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('BankLoan', bankLoanSchema);
