import express from 'express';
import { verifyUser } from '../../middlewares/verifyUser.js';
import {
  getAllDocuments,
  getSingleDocument,
  updateDocumentStatus,
  getDocumentSummary,
} from '../../controllers/documentSummary/documentSummaryController.js';

const router = express.Router();

router.get('/', verifyUser, getAllDocuments);

// ✅ Place this before `/:id` to prevent route conflict
router.get('/summary', verifyUser, getDocumentSummary);

router.get('/:id', verifyUser, getSingleDocument);
router.patch('/:id/status', verifyUser, updateDocumentStatus);

export default router;
