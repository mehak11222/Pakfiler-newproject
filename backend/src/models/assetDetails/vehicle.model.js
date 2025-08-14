import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  vehicleType: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('VehicleAsset', vehicleSchema);
