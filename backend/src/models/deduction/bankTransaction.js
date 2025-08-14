// src/models/deduction/bankTransaction.model.js

import mongoose from 'mongoose';

const bankTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taxYear: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  taxDeducted: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('BankTransaction', bankTransactionSchema);
