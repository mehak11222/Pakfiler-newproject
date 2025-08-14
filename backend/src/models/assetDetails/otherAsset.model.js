import mongoose from 'mongoose';

const otherAssetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  transactionType: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('OtherAsset', otherAssetSchema);
