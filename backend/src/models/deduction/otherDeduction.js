import mongoose from 'mongoose';

const otherDeductionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  propertyPurchase: { type: Number, default: 0 },
  propertySale: { type: Number, default: 0 },
  gatherings: { type: Number, default: 0 },
  pensionWithdrawal: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('OtherDeduction', otherDeductionSchema);
