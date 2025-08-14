// File: src/models/familyAccount.model.js
import mongoose from 'mongoose';

const familyAccountSchema = new mongoose.Schema({
  mainUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  accountName: { // updated from fullName
    type: String,
    required: true
  },
  cnic: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
 relation: {
  type: String,
  required: function () {
    // Make `relation` required only when not tagging (i.e., no linkedUserId)
    return !this.linkedUserId;
  }
},

  accountEmail: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['Family', 'Business'],
    required: true
  },
  linkedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('FamilyAccount', familyAccountSchema);
