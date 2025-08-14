import express from 'express';
import { createBusinessRequest, getBusinessRequests } from '../../controllers/businessIncorporation/businessIncorporation.controller.js';
import { verifyUser } from '../../middlewares/verifyUser.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = express.Router();

// Handle multiple fields
const documentFields = [
  { name: 'partnershipDeed' },
  { name: 'partnershipCertificate' },
  { name: 'authorityLetter' },
  { name: 'cnicCopies' },
  { name: 'rentAgreement' },
  { name: 'letterhead' },
  { name: 'electricityBill' }
];

router.post('/', verifyUser, upload.fields(documentFields), createBusinessRequest);
router.get('/', verifyUser, getBusinessRequests);

export default router;
