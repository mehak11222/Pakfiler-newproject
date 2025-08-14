import mongoose from 'mongoose';

const vehicleDeductionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  activityType: { type: String, required: true },
  vehicleType: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  taxDeducted: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('VehicleDeduction', vehicleDeductionSchema);
