// models/ServiceCharge/serviceCharge.model.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  fee: { type: String, required: true },
  completionTime: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  contactMethods: [{ type: String, required: true }]
});

const serviceChargeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  services: [serviceSchema]
}, { timestamps: true });

// Clear the model first if it exists to avoid OverwriteModelError
if (mongoose.models.ServiceCharge) {
  mongoose.deleteModel('ServiceCharge');
}

export const ServiceCharge = mongoose.model('ServiceCharge', serviceChargeSchema);