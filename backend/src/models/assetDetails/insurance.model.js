import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  premiumPaid: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('InsuranceAsset', insuranceSchema);
