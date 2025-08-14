import mongoose from 'mongoose';

const taxCreditsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },

  donationAmount: { type: Number, default: 0 }, // crossed cheque to charity
  pensionFundInvestment: { type: Number, default: 0 }, // investment in approved pension funds
  tuitionFee: { type: Number, default: 0 } // optional
}, { timestamps: true });

export default mongoose.model('TaxCredit', taxCreditsSchema);
