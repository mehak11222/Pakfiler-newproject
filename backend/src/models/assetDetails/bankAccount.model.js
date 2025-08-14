import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  balance: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('BankAccountAsset', bankAccountSchema);
