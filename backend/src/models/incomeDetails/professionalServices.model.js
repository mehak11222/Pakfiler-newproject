import mongoose from 'mongoose';

const professionalServiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  professionType: {
    type: String,
    enum: ['Doctor', 'Lawyer', 'Accountant', 'Engineer/Architect', 'Tutor/Trainer/Coach', 'Management Consultant', 'Other Professionals'],
  },
  amount: { type: Number },
  expenses: { type: Number },
  taxPaid: { type: Number }
}, { timestamps: true });

export default mongoose.model('ProfessionalServicesIncome', professionalServiceSchema);
