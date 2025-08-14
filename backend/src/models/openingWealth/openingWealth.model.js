import mongoose from 'mongoose';

const openingWealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxYear: { type: String, required: true }, // e.g. "2024-2025"
  openingWealth: { type: Number, required: true } // value as of July 1st
}, { timestamps: true });

export default mongoose.model('OpeningWealth', openingWealthSchema);
