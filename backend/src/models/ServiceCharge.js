import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  serviceType: String,
  amount: Number
});

export default mongoose.model("ServiceCharge", schema);
