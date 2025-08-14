// File: src/routes/personalInfo.routes.js
import express from 'express';
import { submitPersonalInfo, getPersonalInfo } from '../controllers/personalInfo.controller.js';
import { verifyUser } from '../middlewares/auth.middleware.js'; // Add auth middleware

const router = express.Router();

router.post('/submit', verifyUser, submitPersonalInfo);
router.get('/:filingId', verifyUser, getPersonalInfo); // Changed to filingId

export default router;  