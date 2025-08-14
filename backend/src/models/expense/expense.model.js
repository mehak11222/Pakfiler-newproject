import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },

  // Optional if using detailed view
  totalHouseholdExpense: { type: Number },

  // Detailed fields
  rent: { type: Number, default: 0 },
  vehicleMaintenance: { type: Number, default: 0 },
  electricity: { type: Number, default: 0 },
  gas: { type: Number, default: 0 },
  medical: { type: Number, default: 0 },
  functions: { type: Number, default: 0 },
  insurancePremium: { type: Number, default: 0 },
  interestExpense: { type: Number, default: 0 },
  traveling: { type: Number, default: 0 },
  ratesTaxes: { type: Number, default: 0 },
  incomeTax: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  telephone: { type: Number, default: 0 },
  educational: { type: Number, default: 0 },
  donations: { type: Number, default: 0 },
  personalExpense: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
