import mongoose from 'mongoose';

const businessIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  businessTypes: [{
    type: String,
    enum: ['Trader/Shop', 'Dealers', 'Wholesalers/Supplier', 'Manufacturers', 'Imports', 'Exports']
  }],
}, { timestamps: true });

export default mongoose.model('BusinessIncome', businessIncomeSchema);
