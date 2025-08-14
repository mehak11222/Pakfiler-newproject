import mongoose from 'mongoose';

const salaryIncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taxYear: {
    type: String,
    required: true,
  },
  annualSalary: {
    type: Number,
    required: true,
  },
  taxDeducted: {
    type: Number,
    required: true,
  },
  taDaReceived: {
    type: Boolean,
    required: true,
  },
  medicalProvided: {
    type: Boolean,
    required: true,
  },
  providentFund: {
    type: Boolean,
    required: true,
  },
  vehicleProvided: {
    type: Boolean,
    required: true,
  },
  vehicleAfterJune2020: {
    type: Boolean,
  },
  vehicleCost: {
    type: Number,
  },
  otherAllowances: {
    type: Boolean,
    required: true,
  },
  gratuityFundWithdrawal: {
    type: Boolean,
    required: true,
  },
  taxBorneByEmployer: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

const SalaryIncome = mongoose.model('SalaryIncome', salaryIncomeSchema);
export default SalaryIncome;
