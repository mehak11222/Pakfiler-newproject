import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fileType: String, // cnic or salarySlip
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", docSchema);
