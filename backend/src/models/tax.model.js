import mongoose from 'mongoose';

const taxFilingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  year: String,
  income: Number,
  deductions: Number,
  family: {
    spouse: { type: Boolean, required: true },
    children: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TaxFiling", taxFilingSchema);
