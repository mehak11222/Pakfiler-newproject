import mongoose from 'mongoose';

const dividendGainSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  dividend: { type: Number, default: 0 },
  capitalGain: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('DividendCapitalGainIncome', dividendGainSchema);
