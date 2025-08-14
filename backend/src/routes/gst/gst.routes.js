import express from 'express';
import { verifyUser } from '../../middlewares/verifyUser.js';
import { upload } from '../../middlewares/upload.middleware.js';
import {
  saveGSTBusinessDetails,
  uploadGSTDocument,
  submitGST,
  getGSTRegistrations
} from '../../controllers/gst/gst.controller.js';

const router = express.Router();

router.post('/business-details', verifyUser, saveGSTBusinessDetails);
router.post('/upload-document', verifyUser, upload.array('documents'), uploadGSTDocument);
router.post('/submit', verifyUser, submitGST);
router.get('/', verifyUser, getGSTRegistrations);

export default router;
