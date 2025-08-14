import mongoose from 'mongoose';

const taxFinalizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  
  autoAdjustWealth: { type: Boolean, required: true }, // true if "Auto Adjust", false if "I Will Adjust"
  termsAccepted: { type: Boolean, required: true },
  finalizedAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model('TaxFinalization', taxFinalizationSchema);
