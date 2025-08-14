import mongoose from 'mongoose';

const propertyAssetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  propertyType: { type: String, required: true }, // e.g., Plot, House, Flat
  size: { type: Number, required: true },          // e.g., 500
  unitType: { type: String, required: true },      // e.g., sq. yards, sq. feet
  address: { type: String, required: true },
  fbrValue: { type: Number, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('PropertyAsset', propertyAssetSchema);
