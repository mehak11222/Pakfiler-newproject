// File: src/models/personalInfo.model.js
import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  filingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxFiling',
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  residentialStatus: {
    type: String,
    enum: ['Resident', 'Non-Resident'],
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('PersonalInfo', personalInfoSchema);
