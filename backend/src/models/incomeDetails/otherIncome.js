import mongoose from 'mongoose';

const otherIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  inflows: [{
    type: String,
    amount: Number,
    description: String,
  }],
}, { timestamps: true });

export default mongoose.model('OtherIncome', otherIncomeSchema);
