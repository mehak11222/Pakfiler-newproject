import mongoose from 'mongoose';

const partnershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  partnerships: [{
    name: String,
    annualIncome: Number,
    sharePercentage: Number,
  }]
}, { timestamps: true });

export default mongoose.model('PartnershipAOPIncome', partnershipSchema);
