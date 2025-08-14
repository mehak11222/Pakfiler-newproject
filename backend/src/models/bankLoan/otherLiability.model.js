import mongoose from 'mongoose';

const otherLiabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  liabilityType: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('OtherLiability', otherLiabilitySchema);
