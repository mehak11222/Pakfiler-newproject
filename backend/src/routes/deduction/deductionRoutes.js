import express from 'express';
import { getDeductionSummary } from '../../controllers/deduction/deductionController.js';

const router = express.Router();

router.get('/summary/:userId/:taxYear', getDeductionSummary);

export default router;
