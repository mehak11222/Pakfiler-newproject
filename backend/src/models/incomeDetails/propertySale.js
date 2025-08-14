import mongoose from 'mongoose';

const propertySaleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true },
  propertySales: [
    {
      location: String,
      saleAmount: Number,
      purchaseAmount: Number,
      gain: Number,
      taxPaid: Number,
    }
  ]
}, { timestamps: true });

const PropertySaleIncome = mongoose.model('PropertySaleIncome', propertySaleSchema);
export default PropertySaleIncome;
