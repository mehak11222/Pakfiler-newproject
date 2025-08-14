import mongoose from 'mongoose';

const assetSelectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  properties: { type: Boolean, default: false },
  vehicles: { type: Boolean, default: false },
  bankAccounts: { type: Boolean, default: false },
  insurances: { type: Boolean, default: false },
  possessions: { type: Boolean, default: false },
  foreignAssets: { type: Boolean, default: false },
  cash: { type: Boolean, default: false },
  otherAssets: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('AssetSelection', assetSelectionSchema);
