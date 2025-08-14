import express from 'express';
import {
  createNTN,
  getNTNByUser,
  getNTNByUserId // ✅ Add this import
} from '../../controllers/ntnRegistration/ntn.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { verifyUser } from '../../middlewares/verifyUser.js';

const router = express.Router();

// POST with file upload
router.post('/', verifyUser, upload.single('cnicFile'), createNTN);

// GET for logged-in user
router.get('/', verifyUser, getNTNByUser);

// ✅ GET by userId
router.get('/:userId', verifyUser, getNTNByUserId);

export default router;
