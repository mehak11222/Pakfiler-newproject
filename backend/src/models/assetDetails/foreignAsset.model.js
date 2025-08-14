import mongoose from 'mongoose';

const foreignAssetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('ForeignAsset', foreignAssetSchema);

