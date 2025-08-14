// models/incomeSources.model.js
import mongoose from 'mongoose';

const incomeSourcesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taxYear: {
      type: String,
      required: true,
    },
    selectedSources: [
      {
        type: String,
        enum: [
          'Salary Income',
          'Business/Self Employed',
          'Freelancer',
          'Professional Services',
          'Pension',
          'Agriculture',
          'Commission/Service',
          'Partnership/AOP',
          'Rent',
          'Property Sale',
          'Profit on Savings',
          'Dividend/Capital Gain',
          'Other Income',
        ],
      },
    ],
  },
  { timestamps: true }
);

const IncomeSources = mongoose.model('IncomeSources', incomeSourcesSchema);
export default IncomeSources;
