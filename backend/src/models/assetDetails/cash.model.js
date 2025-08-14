import mongoose from 'mongoose';

const cashSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  balance: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('CashAsset', cashSchema);
