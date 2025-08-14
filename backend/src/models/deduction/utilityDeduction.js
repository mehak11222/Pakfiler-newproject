import mongoose from 'mongoose';

const utilityDeductionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  utilityType: { type: String, required: true },
  provider: { type: String, required: true },
  consumerNumber: { type: String, required: true },
  taxDeducted: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('UtilityDeduction', utilityDeductionSchema);
