import mongoose from 'mongoose';

const incomeCategorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
}, { _id: false });

const incomeSummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taxYear: {
    type: Number,
    required: true,
  },
  salary: [incomeCategorySchema],
  business: [incomeCategorySchema],
  freelance: [incomeCategorySchema],
  foreign: [incomeCategorySchema],
  agriculture: [incomeCategorySchema],
  capitalGains: [incomeCategorySchema],
  dividend: [incomeCategorySchema],
  property: [incomeCategorySchema],
  profitOnSavings: [incomeCategorySchema],
  rent: [incomeCategorySchema],
  commission: [incomeCategorySchema],
  other: [incomeCategorySchema],
}, { timestamps: true });

const IncomeSummary = mongoose.model('IncomeSummary', incomeSummarySchema);
export default IncomeSummary;
